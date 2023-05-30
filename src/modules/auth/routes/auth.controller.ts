import {
  Controller,
  Post,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Body,
  Res,
  UnauthorizedException,
  Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

import { v4 as uuidv4 } from 'uuid';

import { addMilliseconds, differenceInMilliseconds } from 'date-fns';

import { UsersService } from '~@modules/users/services/users.service';

import { AuthService } from '../services/auth.service';
import { AccountsService } from '../services/accounts.service';
import { SessionsService } from '../services/sessions.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly accountsService: AccountsService,
    private readonly sessionsService: SessionsService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body, @Res({ passthrough: true }) res: Response) {
    // authenticate the user
    // code to authenticate the user goes here
    const user = await this.usersService.findOne({
      email: body.email,
      password: body.password,
    });

    if (!user) return new UnauthorizedException();

    // generate a JWT
    const token = await this.authService.createToken({
      userId: user.id,
      username: user.email,
    });

    // set the JWT on a cookie
    return res.cookie('access_token', token, {
      httpOnly: true,
      maxAge: 3600,
    });
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async refresh(@Request() req, @Res({ passthrough: true }) res: Response) {
    // verify the token
    const decoded = await this.authService.verifyToken(
      req.headers.authorization,
    );

    // generate a new token
    const token = await this.authService.createToken({
      userId: decoded.userId,
      username: decoded.username,
    });

    // set the new token on a cookie
    return res.cookie('access_token', token, {
      httpOnly: true,
      maxAge: 3600,
    });
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard('jwt'))
  logout(@Request() req, @Res({ passthrough: true }) res: Response) {
    // invalidate the token
    const token = this.authService.invalidateToken(req.headers.authorization);

    // set the invalidated token on a cookie
    return res.cookie('access_token', token, {
      httpOnly: true,
      maxAge: 0,
    });
  }

  // --
  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubAuth() {
    // Initiates the GitHub authentication process
  }

  @Get('callback/github')
  @UseGuards(AuthGuard('github'))
  async githubAuthCallback(@Request() req, @Res() res: Response) {
    // Handles the GitHub authentication callback
    // You can use the "req.user" object to get the authenticated user's information

    const { accessToken, profile } = req.user;

    const user = await this.usersService.findOrCreate({
      name: profile.username,
      email: profile.emails[0].value,
      image: profile._json.avatar_url,
    });

    await this.accountsService.findOrCreate({
      type: 'oauth',
      token_type: 'bearer',
      scope: profile.scope,
      provider: profile.provider,
      providerAccountId: profile.id,
      userId: user.id,
      access_token: accessToken,
    });

    const date = new Date();

    const expires = addMilliseconds(
      date,
      Number.parseInt(process.env.COOKIE_DAYS_EXPIRE) * 24 * 60 * 60 * 1000, // translate the COOKIE_DAYS_EXPIRE to milliseconds
    );

    const session = await this.sessionsService.findOrCreate({
      userId: user.id,
      expires,
      sessionToken: uuidv4(),
    });

    // const options: CookieOptions = {
    //   maxAge: differenceInMilliseconds(session.expires.getTime(), Date.now()),
    //   domain: process.env.COOKIE_DOMAIN,
    //   secure: process.env.NODE_ENV !== 'development',
    //   sameSite: 'none',
    //   httpOnly: false,
    //   path: '/',
    // };

    // res.cookie('authToken', session.sessionToken, options);

    // res.cookie(
    //   'session',
    //   JSON.stringify({
    //     authToken: session.sessionToken,
    //     displayName: user.name,
    //     id: user.id,
    //     login: user.email,
    //     roles: [],
    //   }),
    //   options,
    // );

    res.json({
      session: {
        authToken: session.sessionToken,
        displayName: user.name,
        id: user.id,
        login: user.email,
        roles: [],
      },
      maxAge: differenceInMilliseconds(session.expires.getTime(), Date.now()),
    });
  }
}
