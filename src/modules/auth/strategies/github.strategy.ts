import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.APP_WEB_URL + '/auth/callback/github',
      scope: 'user, user:email, repo, repo:status',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    // Validate the user and return the relevant user object
    // You can use the profile object to get the user's GitHub profile information

    profile.scope = this._scope;

    return { accessToken, refreshToken, profile };
  }
}
