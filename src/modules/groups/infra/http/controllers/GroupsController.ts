import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';

import CreateGroupService from '@modules/groups/services/CreateGroupService';
import ListGroupsService from '@modules/groups/services/ListGroupsService';
import UpdateGroupService from '@modules/groups/services/UpdateGroupService';

export default class GroupsController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { search } = req.query;
    const { id_cliente } = req.user;

    const listGroups = container.resolve(ListGroupsService);
    let s;

    if (search) {
      s = String(search).toLowerCase();
    }

    const groups = await listGroups.execute({
      id_cliente,
      search: s,
    });

    return res.json({ groups });
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const { display_name, users } = req.body;
    const { id_cliente } = req.user;

    const createGroup = container.resolve(CreateGroupService);

    const group = await createGroup.execute({
      id_cliente,
      display_name,
      users,
    });

    return res.json({ group });
  }

  // public async show(req: Request, res: Response): Promise<Response> {
  //   const { id } = req.params;

  //   const getUser = container.resolve(GetUserService);

  //   const user = await getUser.execute(Number(id));

  //   return res.json({ user });
  // }

  public async update(req: Request, res: Response): Promise<Response> {
    const { display_name } = req.body;

    const { id } = req.params;

    const updateGroup = container.resolve(UpdateGroupService);

    const group = await updateGroup.execute({
      id: Number(id),
      display_name,
    });

    return res.json({ group: instanceToInstance(group) });
  }
}
