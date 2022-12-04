import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';

import GetProfileService from '@modules/users/services/GetProfileService';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';

export default class ProfileController {
  public async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.user;

    const getProfile = container.resolve(GetProfileService);

    const user = await getProfile.execute(Number(id));

    return res.json({ user: instanceToInstance(user) });
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const {
      email,
      old_password,
      password,
      loginName: pseudo_login,
      displayName: display_name,
    } = req.body;

    const { id } = req.user;

    const updateUser = container.resolve(UpdateProfileService);

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
