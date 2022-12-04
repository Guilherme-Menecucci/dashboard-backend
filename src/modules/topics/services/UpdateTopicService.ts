import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Topic from '@modules/topics/infra/typeorm/entities/Topic';
import IUpdateTopicDTO from '@modules/topics/dtos/IUpdateTopicDTO';
import ITopicsRepository from '@modules/topics/repositories/ITopicsRepository';

@injectable()
class UpdateUserService {
  constructor(
    @inject('TopicsRepository')
    private topicsRepository: ITopicsRepository,
  ) {}

  public async execute(data: IUpdateTopicDTO): Promise<Topic> {
    const { id, title } = data;

    const topic = await this.topicsRepository.findById(id);

    if (!topic) {
      throw new AppError('Topic not found.');
    }

    topic.title = title;

    return this.topicsRepository.update(topic);
  }
}

export default UpdateUserService;
