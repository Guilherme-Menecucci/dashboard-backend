import { Request, Response, NextFunction, request } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import HttpStatusCode from '@shared/enums/HttpStatusCode';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
  client: number;
}

export default function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.header(
      'WWW-Authentication',
      'Bearer realm="Access to the staging site"',
    );
    throw new AppError(
      'Missing Authorization Header.',
      HttpStatusCode.UNAUTHORIZED,
    );
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { sub, client } = decoded as ITokenPayload;

    request.user = {
      id: sub,
      id_cliente: client,
    };

    return next();
  } catch {
    throw new AppError('Invalid JWT token.', HttpStatusCode.FORBIDDEN);
  }
}
