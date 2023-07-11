import { Module } from '@nestjs/common';

import { SharedModule } from '~@modules/shared/shared.module';
import { TokenService } from '~@modules/auth/services/token.service';
import { AccountService } from '~@modules/account/services/account.service';

import { UserService } from './services/user.service';
import { UserController } from './routes/user.controller';

@Module({
  imports: [SharedModule],
  controllers: [UserController],
  providers: [UserService, AccountService, TokenService],
})
export class UserModule {}
