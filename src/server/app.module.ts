import { Module } from '@nestjs/common';
import { AuthModule } from '~@modules/auth/auth.module';
import { UsersModule } from '~@modules/users/users.module';
import { AppService } from './services/app.service';

@Module({
  imports: [AuthModule, UsersModule],
  providers: [AppService],
})
export class AppModule {}
