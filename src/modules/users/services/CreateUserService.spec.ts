import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeClientUsersRepository from '../repositories/fakes/FakeClientUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeClientUsersRepository: FakeClientUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;

let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeClientUsersRepository = new FakeClientUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeClientUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      display_name: 'John Doe',
      pseudo_login: 'johndoe',
      password: '123456',
      email: 'johndoe@example.com',
      idClient: 17,
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create two users with same login', async () => {
    const userData = {
      display_name: 'John Doe',
      pseudo_login: 'johndoe',
      password: '123456',
      email: 'johndoe@example.com',
      idClient: 17,
    };

    await createUser.execute(userData);

    await expect(createUser.execute(userData)).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create two users with same email', async () => {
    await createUser.execute({
      display_name: 'John Doe',
      pseudo_login: 'johndoe',
      password: '123456',
      email: 'johndoe@example.com',
      idClient: 17,
    });

    await expect(
      createUser.execute({
        display_name: 'John Doe',
        pseudo_login: 'johndoe1',
        password: '123456',
        email: 'johndoe@example.com',
        idClient: 17,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
