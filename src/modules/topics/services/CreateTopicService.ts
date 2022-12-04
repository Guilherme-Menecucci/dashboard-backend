import { injectable, inject } from 'tsyringe';

import ITopicsRepository from '../repositories/ITopicsRepository';
import ICreateTopicDTO from '../dtos/ICreateTopicDTO';

import User from '../infra/typeorm/entities/Topic';

@injectable()
class CreateUserService {
  constructor(
    @inject('TopicsRepository')
    private topicRepository: ITopicsRepository,
  ) {}

  public async execute(data: ICreateTopicDTO): Promise<User> {
    const topic = await this.topicRepository.create(data);

    return topic;
  }
}

export default CreateUserService;
