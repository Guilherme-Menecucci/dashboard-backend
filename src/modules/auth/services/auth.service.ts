import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GitHubStrategy } from '../strategies/github.strategy';

@Injectable()
export class AuthService {
  private readonly secretKey: string;

  constructor(
    @Inject(JwtService) private jwtService: JwtService,
    private readonly githubStrategy: GitHubStrategy,
  ) {
    this.secretKey = 'secretKey';
  }

  async authenticate() {
    return await this.githubStrategy.authenticate();
  }

  async callback(req) {
    try {
      const user = await this.githubStrategy.callback(req);
      return user;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async createToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: this.secretKey,
      expiresIn: '60s',
    });
  }

  async verifyToken(token: string): Promise<any> {
    return this.jwtService.verify(token, { secret: this.secretKey });
  }

  async invalidateToken(token: string): Promise<string> {
    // decode the token to get the payload
    const decoded = this.jwtService.verify(token, {
      secret: this.secretKey,
      complete: true,
    });
    if (!decoded) {
      throw new Error('Invalid token');
    }

    // set the exp claim to a date in the past
    decoded.exp = Math.floor(Date.now() / 1000) - 60;

    // sign the modified token and return it
    return this.jwtService.sign(decoded, {
      secret: this.secretKey,
      expiresIn: '60s',
    });
  }
}
