import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';

import CreateConferenceService from '@modules/conferences/services/CreateConferenceService';
import ListConferencesService from '@modules/conferences/services/ListConferencesService';
import UpdateConferenceService from '@modules/conferences/services/UpdateConferenceService';

export default class ConferencesController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { search } = req.query;
    const { id_cliente } = req.user;

    const listConferences = container.resolve(ListConferencesService);
    let s;

    if (search) {
      s = String(search).toLowerCase();
    }

    const conferences = await listConferences.execute({
      id_cliente,
      search: s,
    });

    return res.json({ conferences });
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const { titulo, grupo: id_grupo } = req.body;
    const createConference = container.resolve(CreateConferenceService);
    const { id_cliente } = req.user;

    const conference = await createConference.execute({
      id_cliente,
      id_grupo,
      titulo,
    });

    return res.json({ conference });
  }

  // public async show(req: Request, res: Response): Promise<Response> {
  //   const { id } = req.params;

  //   const getUser = container.resolve(GetUserService);

  //   const user = await getUser.execute(Number(id));

  //   return res.json({ user });
  // }

  public async update(req: Request, res: Response): Promise<Response> {
    const { titulo, grupo: id_grupo } = req.body;

    const { id } = req.params;

    const updateConference = container.resolve(UpdateConferenceService);

    const conference = await updateConference.execute({
      id: Number(id),
      id_grupo,
      titulo,
    });

    return res.json({ conference: instanceToInstance(conference) });
  }
}
