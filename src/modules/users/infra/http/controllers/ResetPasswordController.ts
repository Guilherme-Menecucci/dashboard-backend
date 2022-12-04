import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ResetPasswordService from '@modules/users/services/ResetPasswordService';
import HttpStatusCode from '@shared/enums/HttpStatusCode';

export default class ResetPasswordController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { token, password } = req.body;
    const resetPassword = container.resolve(ResetPasswordService);

    await resetPassword.execute({ token, password });

    return res.status(HttpStatusCode.NO_CONTENT).json();
  }
}
