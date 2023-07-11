import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { AccountService } from '../services/account.service';
import { UserService } from '~@modules/user/services/user.service';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private readonly userService: UserService,
    private readonly accountService: AccountService,
  ) {
    super({
      clientID: process.env.CLIENT_GITHUB_ID,
      clientSecret: process.env.CLIENT_GITHUB_SECRET,
      callbackURL: process.env.APP_WEB_URL + '/auth/callback/github',
      scope: 'user, user:email, repo, repo:status',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    // Validate the user and return the relevant user object
    // You can use the profile object to get the user's GitHub profile information
    const foundAccount = await this.accountService.findOne({
      provider: profile.provider,
      providerAccountId: profile.id,
    });

    if (foundAccount) {
      return { accessToken, refreshToken, user: foundAccount.user };
    }

    const user = await this.userService.create({
      name: profile.username,
      image: profile._json.avatar_url,
    });

    await this.accountService.create({
      type: 'oauth',
      token_type: 'bearer',
      scope: profile.scope,
      provider: profile.provider,
      providerAccountId: profile.id,
      userId: user.id,
      email: profile.emails[0].value,
    });

    return { accessToken, refreshToken, user };
  }
}
