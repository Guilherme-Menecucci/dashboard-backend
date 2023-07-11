import { Inject, Injectable } from '@nestjs/common';
import { Refresh, Session } from '@prisma/client';
import { addMilliseconds } from 'date-fns';

import { v4 } from 'uuid';

import { PrismaService } from '~@modules/shared/services/prisma.service';
import getCookieExpire from '~@server/shared/utils/getCookieExpire';

@Injectable()
export class TokenService {
  constructor(@Inject(PrismaService) private prismaService: PrismaService) {}

  async generateSessionToken(userId: string): Promise<Session> {
    const date = new Date();
    const expiresAt = addMilliseconds(date, getCookieExpire());

    const session = await this.prismaService.session.create({
      data: {
        token: v4(),
        expiresAt,
        user: { connect: { id: userId } },
      },
    });

    return session;
  }

  async generateRefreshToken(userId: string): Promise<Refresh> {
    const refresh = await this.prismaService.refresh.create({
      data: {
        token: v4(),
        user: { connect: { id: userId } },
      },
    });

    return refresh;
  }

  async storeSessionToken(
    sessionToken: string,
    userId: string,
  ): Promise<Session> {
    const date = new Date();
    const expiresAt = addMilliseconds(date, getCookieExpire());

    const session = await this.prismaService.session.create({
      data: {
        token: sessionToken,
        expiresAt,
        user: { connect: { id: userId } },
      },
    });

    return session;
  }

  async storeRefreshToken(
    refreshToken: string,
    userId: string,
  ): Promise<Refresh> {
    const refresh = await this.prismaService.refresh.create({
      data: {
        token: refreshToken,
        user: { connect: { id: userId } },
      },
    });

    return refresh;
  }

  async validateSessionToken(sessionToken: string): Promise<any> {
    const session = await this.prismaService.session.findUnique({
      where: { token: sessionToken },
      include: { user: true },
    });

    if (session) {
      return { userId: session.user.id };
    }

    throw new Error('Invalid session token');
  }

  async validateRefreshToken(refreshToken: string): Promise<any> {
    const refresh = await this.prismaService.refresh.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (refresh) {
      return { userId: refresh.user.id };
    }

    throw new Error('Invalid refresh token');
  }

  async invalidateSessionToken(sessionToken: string): Promise<void> {
    console.log('token', sessionToken);

    await this.prismaService.session.update({
      data: { expiresAt: new Date(-1) },
      where: { token: sessionToken },
      include: { user: true },
    });
  }

  async invalidateRefreshToken(refreshToken: string): Promise<void> {
    await this.prismaService.refresh.delete({
      where: { token: refreshToken },
    });
  }
}
