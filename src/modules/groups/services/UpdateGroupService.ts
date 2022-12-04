import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUpdateUserDTO from '../dtos/IUpdateGroupDTO';
import IGroupsRepository from '../repositories/IGroupsRepository';
import Group from '../infra/typeorm/entities/Group';

@injectable()
class UpdateGroupService {
  constructor(
    @inject('GroupsRepository')
    private groupRepository: IGroupsRepository,
  ) {}

  public async execute(data: IUpdateUserDTO): Promise<Group> {
    const group = await this.groupRepository.findById(data.id);

    if (!group) {
      throw new AppError('Group not found');
    }

    const foundDisplayName = await this.groupRepository.findByDisplayName(
      data.display_name,
    );

    if (foundDisplayName && foundDisplayName.id !== group.id) {
      throw new AppError('A group already has this name');
    }

    return this.groupRepository.update(data);
  }
}

export default UpdateGroupService;
