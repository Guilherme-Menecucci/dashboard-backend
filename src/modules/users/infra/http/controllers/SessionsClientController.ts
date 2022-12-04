import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateSessionClientService from '@modules/users/services/CreateSessionClientService';

export default class SessionsClientController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { client: id_cliente } = req.body;
    const { id } = req.user;

    const createSessionClient = container.resolve(CreateSessionClientService);

    const user = await createSessionClient.execute({
      id: Number(id),
      id_cliente,
    });

    return res.json({ user });
  }
}
