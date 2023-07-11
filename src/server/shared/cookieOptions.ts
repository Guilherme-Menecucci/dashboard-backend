import getCookieExpire from './utils/getCookieExpire';

const cookieOptions = {
  domain: process.env.COOKIE_DOMAIN,
  secure: process.env.NODE_ENV !== 'development',
  // sameSite: 'none',
  httpOnly: false,
  path: '/',
  maxAge: getCookieExpire(),
};

export default cookieOptions;
