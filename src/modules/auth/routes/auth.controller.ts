import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  Res,
  Inject,
  Req,
} from '@nestjs/common';
import { Response } from 'express';

import { differenceInMilliseconds } from 'date-fns';

import cookieOptions from '~@server/shared/cookieOptions';

import { PasswordService } from '~@modules/shared/services/password.service';
import { AccountService } from '~@modules/account/services/account.service';

import { TokenService } from '../services/token.service';
import { LoginDto } from '../dto/loginDto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(TokenService) private readonly tokenService: TokenService,
    @Inject(AccountService) private readonly accountsService: AccountService,
    @Inject(PasswordService) private readonly passwordService: PasswordService,
  ) {}

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body('refreshToken') refreshToken,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { userId } = await this.tokenService.validateRefreshToken(
        refreshToken,
      );
      const sessionToken = await this.tokenService.generateSessionToken(userId);
      return { sessionToken: sessionToken.token };
    } catch (error) {
      return res.status(HttpStatus.FORBIDDEN).json({
        error: 'Invalid refresh token',
      });
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { email, password } = loginDto;

    try {
      const account = await this.accountsService.findOne({ email });

      if (!account) {
        return {
          error: 'Invalid credentials',
        };
      }

      const passwordMatch = await this.passwordService.verifyPassword(
        password,
        account.password,
      );

      if (!passwordMatch) {
        return {
          error: 'Invalid credentials',
        };
      }

      const session = await this.tokenService.generateSessionToken(
        account.userId,
      );
      const refresh = await this.tokenService.generateRefreshToken(
        account.userId,
      );

      const cookieOpt = {
        ...cookieOptions,
        maxAge: differenceInMilliseconds(
          session.expiresAt.getTime(),
          Date.now(),
        ),
      };

      res.cookie(
        'session',
        JSON.stringify({
          sessionToken: session.token,
          refreshToken: refresh.token,
          displayName: account.user.name,
          id: account.id,
          login: account.email,
          roles: [],
        }),
        cookieOpt,
      );

      res.cookie('refreshToken', refresh.token, cookieOpt);

      return res.json({
        message: 'Login successful',
        data: {
          sessionToken: session.token,
          refreshToken: refresh.token,
          displayName: account.user.name,
          id: account.id,
          login: account.email,
          roles: [],
        },
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: 'Invalid credentials',
      });
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    try {
      const cookies = req.cookies;
      const session = JSON.parse(cookies.session);

      await this.tokenService.invalidateSessionToken(session.sessionToken);

      res.clearCookie('session');
      res.clearCookie('refreshToken');

      res.json({
        message: 'User logged out',
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        error: 'Invalid authorization token provided.',
      });
    }
  }
}
