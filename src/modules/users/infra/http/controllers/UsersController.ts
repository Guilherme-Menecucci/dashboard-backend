import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '@modules/users/services/CreateUserService';
import ListUsersService from '@modules/users/services/ListUsersService';
import GetUserService from '@modules/users/services/GetUserService';
import { instanceToInstance } from 'class-transformer';
import UpdateUserService from '@modules/users/services/UpdateUserService';

export default class UsersController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { search } = req.query;
    const { id_cliente } = req.user;

    const listUser = container.resolve(ListUsersService);
    let s;

    if (search) {
      s = String(search).toLowerCase();
    }

    const users = await listUser.execute({ id_cliente, search: s });

    return res.json({ users });
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const {
      email,
      password,
      loginName: pseudo_login,
      displayName: display_name,
    } = req.body;
    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
      idClient: 17,
      email,
      password,
      pseudo_login,
      display_name,
    });

    return res.json({ user });
  }

  public async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const getUser = container.resolve(GetUserService);

    const user = await getUser.execute(Number(id));

    return res.json({ user });
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const {
      email,
      old_password,
      password,
      loginName: pseudo_login,
      displayName: display_name,
    } = req.body;

    const { id } = req.params;

    const updateUser = container.resolve(UpdateUserService);

    const user = await updateUser.execute({
      id: Number(id),
      email,
      old_password,
      password,
      pseudo_login,
      display_name,
    });

    return res.json({ user: instanceToInstance(user) });
  }
}
