import { Request, Response, NextFunction } from 'express';
import mysql from 'mysql';
import { RateLimiterMySQL } from 'rate-limiter-flexible';
import HttpStatusCode from '@shared/enums/HttpStatusCode';
import AppError from '@shared/errors/AppError';

const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.TYPEORM_HOST,
  user: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
});

const rateLimiter = new RateLimiterMySQL({
  storeClient: pool,
  keyPrefix: 'vconf:main',
  dbName: process.env.TYPEORM_DATABASE,
  tableName: 'ratelimiter', // all limiters store data in one table
  points: 5, // Number of points
  duration: 1, // Per second(s)
});

export default async function (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await rateLimiter.consume(req.ip);

    return next();
  } catch {
    throw new AppError('Too Many Requests', HttpStatusCode.TOO_MANY_REQUESTS);
  }
}
