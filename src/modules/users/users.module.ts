import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './routes/users.controller';
import { SharedModule } from '../shared/shared.module';
import { AccountsService } from '~@modules/auth/services/accounts.service';
import { SessionsService } from '~@modules/auth/services/sessions.service';

@Module({
  imports: [SharedModule],
  controllers: [UsersController],
  providers: [UsersService, AccountsService, SessionsService],
})
export class UsersModule {}
