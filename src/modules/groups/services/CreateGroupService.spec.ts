import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeGroupsRepository from '../repositories/fakes/FakeGroupsRepository';

import CreateGroupService from './CreateGroupService';

let fakeUsersRepository: FakeUsersRepository;
let fakeGroupsRepository: FakeGroupsRepository;

let createGroup: CreateGroupService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeGroupsRepository = new FakeGroupsRepository();

    createGroup = new CreateGroupService(
      fakeGroupsRepository,
      fakeUsersRepository,
    );
  });

  it('should be able to create a new group', async () => {
    const user1 = await fakeUsersRepository.create({
      display_name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123',
      pseudo_login: 'johndoe',
    });

    const group = await createGroup.execute({
      display_name: 'Test 1',
      users: [user1.id],
      id_cliente: 17,
    });

    expect(group).toHaveProperty('id');
    expect(group.userList).toStrictEqual([user1]);
  });

  it('should not be able to create two groups with same display_name', async () => {
    const groupData = {
      display_name: 'Group 1',
      users: [],
      id_cliente: 17,
    };

    await createGroup.execute(groupData);

    await expect(createGroup.execute(groupData)).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
