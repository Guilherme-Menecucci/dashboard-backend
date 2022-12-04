import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateSessionService from '@modules/users/services/CreateSessionService';

export default class SessionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { loginName: pseudoLogin, password } = req.body;
    const createSession = container.resolve(CreateSessionService);

    const user = await createSession.execute({
      pseudoLogin,
      password,
    });

    return res.json({ user });
  }
}
