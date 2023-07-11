import {
  Controller,
  UseGuards,
  Request,
  Res,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

import { TokenService } from '~@modules/auth/services/token.service';
import cookieOptions from '~@server/shared/cookieOptions';
import { CreateAccountDto } from '../dto/create-account.dto';
import { AccountService } from '../services/account.service';
import { UserService } from '~@modules/user/services/user.service';
import { differenceInMilliseconds } from 'date-fns';
import { CreateUserDto } from '~@modules/user/dto/create-user.dto';

@Controller('account')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() createAccountDto: CreateAccountDto & CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const createUserDto = {
        name: createAccountDto.name,
        image: createAccountDto.image,
      };

      const createdUser = await this.userService.create(createUserDto);

      const createdAccount = await this.accountService.create({
        type: 'credentials',
        token_type: 'bearer',
        scope: '',
        provider: 'credentials',
        providerAccountId: createdUser.id,
        userId: createdUser.id,
        email: createAccountDto.email,
        password: createAccountDto.password,
      });

      const session = await this.tokenService.generateSessionToken(
        createdUser.id,
      );
      const refresh = await this.tokenService.generateRefreshToken(
        createdUser.id,
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
          displayName: createdUser.name,
          id: createdUser.id,
          login: createdAccount.email,
          roles: [],
        }),
        cookieOpt,
      );

      res.cookie('refreshToken', session.token, cookieOpt);

      return res.json({
        message: 'User registered successfully',
        user: createdUser,
        data: {
          sessionToken: session.token,
          refreshToken: refresh.token,
          displayName: createdUser.name,
          id: createdUser.id,
          login: createdAccount.email,
          roles: [],
        },
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: 'Failed to register user',
      });
    }
  }

  //# Will be done by frontend, so its not needed
  // @Get('github')
  // @UseGuards(AuthGuard('github'))
  // githubAuth() {
  //   // Initiates the GitHub authentication process
  // }

  @Get('callback/github')
  @UseGuards(AuthGuard('github'))
  async githubAuthCallback(@Request() req, @Res() res: Response) {
    // Handles the GitHub authentication callback
    // You can use the "req.user" object to get the authenticated user's information

    const { user } = req.user;

    const session = await this.tokenService.generateSessionToken(user.id);
    const refresh = await this.tokenService.generateRefreshToken(user.id);

    const cookieOpt = {
      ...cookieOptions,
      maxAge: differenceInMilliseconds(session.expiresAt.getTime(), Date.now()),
    };

    res.cookie(
      'session',
      JSON.stringify({
        sessionToken: session.token,
        refreshToken: refresh.token,
        displayName: user.name,
        id: user.id,
        login: user.email,
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
        displayName: user.name,
        id: user.id,
        login: user.email,
        roles: [],
      },
    });
  }
}
