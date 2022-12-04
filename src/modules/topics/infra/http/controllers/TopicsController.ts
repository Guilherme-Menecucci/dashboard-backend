import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateTopicService from '@modules/topics/services/CreateTopicService';
import ListTopicsService from '@modules/topics/services/ListTopicsService';
import GetTopicService from '@modules/topics/services/GetTopicService';
import { instanceToInstance } from 'class-transformer';
import UpdateTopicService from '@modules/topics/services/UpdateTopicService';

export default class UsersController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { search } = req.query;
    const { id: user_id } = req.user;

    const listTopics = container.resolve(ListTopicsService);
    let s;

    if (search) {
      s = String(search).toLowerCase();
    }

    const topics = await listTopics.execute({ user_id, search: s });

    return res.json({ topics });
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const { title } = req.body;
    const { id } = req.user;

    const createTopic = container.resolve(CreateTopicService);

    const topic = await createTopic.execute({
      title,
      user_id: id,
    });

    return res.json({ topic });
  }

  public async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const getTopic = container.resolve(GetTopicService);

    const topic = await getTopic.execute(Number(id));

    return res.json({ user: topic });
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { title } = req.body;
    const { id } = req.params;
    const { id: user_id } = req.user;

    const updateTopic = container.resolve(UpdateTopicService);

    const topic = await updateTopic.execute({
      id: Number(id),
      title,
      user_id,
    });

    return res.json({ topic: instanceToInstance(topic) });
  }
}
