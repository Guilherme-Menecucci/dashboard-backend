import { injectable, inject } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';

import ITopicsRepository from '@modules/topics/repositories/ITopicsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import Topic from '@modules/topics/infra/typeorm/entities/Topic';

interface IRequest {
  user_id: number;
  search?: string;
}

@injectable()
class ListTopicsService {
  constructor(
    @inject('TopicsRepository')
    private topicRepository: ITopicsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ search, user_id }: IRequest): Promise<Topic[] | undefined> {
    let topicsList = await this.cacheProvider.recover<Topic[]>(
      `topics:users-list:${user_id}`,
    );

    if (!topicsList || search) {
      topicsList = await this.topicRepository.find({ search });

      if (!search) {
        await this.cacheProvider.save(
          `topics:users-list:${user_id}`,
          instanceToInstance(topicsList),
        );
      }
    }

    return topicsList;
  }
}

export default ListTopicsService;
