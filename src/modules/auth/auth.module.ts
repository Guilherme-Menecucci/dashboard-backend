import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SharedModule } from '~@modules/shared/shared.module';
import { UsersService } from '~@modules/users/services/users.service';

import { AuthController } from './routes/auth.controller';
import { AccountsService } from './services/accounts.service';
import { AuthService } from './services/auth.service';
import { SessionsService } from './services/sessions.service';
import { GitHubStrategy } from './strategies/github.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    SharedModule,
    PassportModule.register({ defaultStrategy: 'github' }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'secretKey',
      signOptions: {
        expiresIn: 3600,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccountsService,
    SessionsService,
    JwtStrategy,
    GitHubStrategy,
    UsersService,
  ],
  exports: [AuthService, AccountsService],
})
export class AuthModule {}
