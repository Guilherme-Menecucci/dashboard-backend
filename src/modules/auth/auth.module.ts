import { Module } from '@nestjs/common';

import { SharedModule } from '~@modules/shared/shared.module';

import { AuthController } from './routes/auth.controller';

import { TokenService } from './services/token.service';
import { AccountService } from '~@modules/account/services/account.service';

@Module({
  imports: [SharedModule],
  controllers: [AuthController],
  providers: [TokenService, AccountService],
  exports: [TokenService],
})
export class AuthModule {}
