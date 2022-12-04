import AppError from '@shared/errors/AppError';

import FakeGroupsRepository from '../repositories/fakes/FakeGroupsRepository';

import UpdateGroupService from './UpdateGroupService';

let fakeGroupsRepository: FakeGroupsRepository;

let updateGroup: UpdateGroupService;

describe('UpdateGroup', () => {
  beforeEach(() => {
    fakeGroupsRepository = new FakeGroupsRepository();

    updateGroup = new UpdateGroupService(fakeGroupsRepository);
  });

  it('should be able to update group data', async () => {
    const group = await fakeGroupsRepository.create({
      display_name: 'Group 1',
      userList: [],
      id_cliente: 17,
    });

    const updatedUser = await updateGroup.execute({
      id: group.id,
      display_name: 'Group 2',
    });

    expect(updatedUser.display_name).toBe('Group 2');
  });

  it('should not be able to update from non existing id', async () => {
    await expect(
      updateGroup.execute({
        id: 1,
        display_name: 'Group 1',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update group to an existing display_name', async () => {
    const group = await fakeGroupsRepository.create({
      display_name: 'Group 1',
      userList: [],
      id_cliente: 17,
    });

    await fakeGroupsRepository.create({
      display_name: 'Group 2',
      userList: [],
      id_cliente: 17,
    });

    await expect(
      updateGroup.execute({
        id: group.id,
        display_name: 'Group 2',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
