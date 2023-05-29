import { Module } from '@nestjs/common';
import { LoggingService } from './services/logging.service';
import { PrismaService } from './services/prisma.service';
import { PasswordService } from './services/password.service';

@Module({
  providers: [PasswordService, PrismaService, LoggingService],
  exports: [PasswordService, PrismaService, LoggingService],
})
export class SharedModule {}
