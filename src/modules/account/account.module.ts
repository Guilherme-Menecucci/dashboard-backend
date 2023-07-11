import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { SharedModule } from '~@modules/shared/shared.module';
import { UserService } from '~@modules/user/services/user.service';

import { AccountService } from './services/account.service';
import { AccountController } from './routes/account.controller';
import { TokenService } from '~@modules/auth/services/token.service';
import { GitHubStrategy } from './strategies/github.strategy';

@Module({
  imports: [
    SharedModule,
    PassportModule.register({ defaultStrategy: 'github' }),
  ],
  controllers: [AccountController],
  providers: [TokenService, AccountService, UserService, GitHubStrategy],
  exports: [AccountService],
})
export class AccountModule {}
