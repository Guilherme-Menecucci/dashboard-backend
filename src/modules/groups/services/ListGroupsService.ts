import { injectable, inject } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import IGroupsRepository from '../repositories/IGroupsRepository';
import Group from '../infra/typeorm/entities/Group';

interface IRequest {
  id_cliente: number;
  search?: string;
}

@injectable()
class ListGroupsService {
  constructor(
    @inject('GroupsRepository')
    private groupRepository: IGroupsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    id_cliente,
    search,
  }: IRequest): Promise<Group[] | undefined> {
    let groupsList = await this.cacheProvider.recover<Group[]>(
      `groups-list:${id_cliente}`,
    );

    if (!groupsList || search) {
      groupsList = await this.groupRepository.find({ id_cliente, search });

      groupsList = instanceToInstance(groupsList);

      if (!search) {
        await this.cacheProvider.save(`groups-list:${id_cliente}`, groupsList);
      }
    }

    return groupsList;
  }
}

export default ListGroupsService;
