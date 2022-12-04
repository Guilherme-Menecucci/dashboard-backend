import { Request, Response, NextFunction } from 'express';
import AppError from '@shared/errors/AppError';
import HttpStatusCode from '@shared/enums/HttpStatusCode';

export default function (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
): Response<unknown> {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }
  return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
    error: 'Internal Server Error',
  });
}
