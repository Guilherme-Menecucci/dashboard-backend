import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import { v4 as uuidv4 } from 'uuid';

import { addMilliseconds, differenceInMilliseconds } from 'date-fns';

import { AccountsService } from '~@modules/auth/services/accounts.service';
import { SessionsService } from '~@modules/auth/services/sessions.service';

import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Controller('user')
export class UsersController {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly sessionsService: SessionsService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const user = await this.usersService.create(createUserDto);

    await this.accountsService.create({
      type: 'credentials',
      token_type: 'bearer',
      scope: '',
      provider: '',
      providerAccountId: '',
      userId: user.id,
      access_token: '',
    });

    const date = new Date();

    // translate the COOKIE_DAYS_EXPIRE to milliseconds
    const expires = addMilliseconds(
      date,
      Number.parseInt(process.env.COOKIE_DAYS_EXPIRE) * 24 * 60 * 60 * 1000,
    );

    const session = await this.sessionsService.create({
      userId: user.id,
      expires,
      sessionToken: uuidv4(),
    });

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

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne({ id });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
