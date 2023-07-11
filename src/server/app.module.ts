import { Module } from '@nestjs/common';

import { AccountModule } from '~@modules/account/account.module';
import { AuthModule } from '~@modules/auth/auth.module';
import { UserModule } from '~@modules/user/user.module';

import { AppService } from './services/app.service';

@Module({
  imports: [AccountModule, UserModule, AuthModule],
  providers: [AppService],
})
export class AppModule {}
