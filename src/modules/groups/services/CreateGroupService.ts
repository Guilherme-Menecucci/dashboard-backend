import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IGroupsRepository from '../repositories/IGroupsRepository';

import Group from '../infra/typeorm/entities/Group';

interface IRequest {
  display_name: string;
  id_cliente: number;
  users: number[];
}

@injectable()
class CreateGroupService {
  constructor(
    @inject('GroupsRepository')
    private groupRepository: IGroupsRepository,

    @inject('UsersRepository')
    private userRepository: IUsersRepository,
  ) {}

  public async execute({
    display_name,
    id_cliente,
    users,
  }: IRequest): Promise<Group> {
    if (display_name !== 'Agendamentos') {
      const foundDisplayName = await this.groupRepository.findByDisplayName(
        display_name,
      );

      if (foundDisplayName) {
        throw new AppError('A group already has this name');
      }
    }

    const newGroup = {
      display_name,
      id_cliente,
      userList: await this.userRepository.findByIds(users),
    };

    const group = await this.groupRepository.create(newGroup);

    return group;
  }
}

export default CreateGroupService;
