import { instanceToInstance } from 'class-transformer';
import { injectable, inject } from 'tsyringe';

import Topic from '@modules/topics/infra/typeorm/entities/Topic';
import ITopicsRepository from '@modules/topics/repositories/ITopicsRepository';

@injectable()
class GetTopicService {
  private topicsRepository: ITopicsRepository;

  constructor(
    @inject('TopicsRepository')
    topicsRepository: ITopicsRepository,
  ) {
    this.topicsRepository = topicsRepository;
  }

  public async execute(id: number): Promise<Topic | undefined> {
    const topic = await this.topicsRepository.findById(id);

    return instanceToInstance(topic);
  }
}

export default GetTopicService;
