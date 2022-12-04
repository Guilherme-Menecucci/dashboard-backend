import { Request, Response } from 'express';
import { container } from 'tsyringe';

import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';
import HttpStatusCode from '@shared/enums/HttpStatusCode';

export default class ForgotPasswordController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { loginName: pseudo_login } = req.body;

    const sendForgotPasswordEmail = container.resolve(
      SendForgotPasswordEmailService,
    );

    await sendForgotPasswordEmail.execute({ pseudo_login });

    return res.status(HttpStatusCode.NO_CONTENT).json();
  }
}
