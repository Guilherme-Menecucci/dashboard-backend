import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import UpdateUserService from './UpdateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

let updateUser: UpdateUserService;

describe('UpdateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateUser = new UpdateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to update user', async () => {
    const user = await fakeUsersRepository.create({
      display_name: 'John Doe',
      email: 'johndoe@example.com',
      pseudo_login: 'johndoe',
      password: '123456',
    });

    const updatedUser = await updateUser.execute({
      id: user.id,
      display_name: 'John Trê',
      email: 'johntre@example.com',
      pseudo_login: 'johntre',
    });

    expect(updatedUser.display_name).toBe('John Trê');
    expect(updatedUser.email).toBe('johntre@example.com');
  });

  it('should not be able to update from non existing id', async () => {
    await expect(
      updateUser.execute({
        id: -1,
        display_name: 'John Trê',
        email: 'johndoe@example.com',
        pseudo_login: 'johntre',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change to another user email', async () => {
    await fakeUsersRepository.create({
      display_name: 'John Doe',
      email: 'johndoe@example.com',
      pseudo_login: 'johndoe',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      display_name: 'John Trê',
      email: 'johntre@example.com',
      pseudo_login: 'johntre',
      password: '123456',
    });

    await expect(
      updateUser.execute({
        id: user.id,
        display_name: 'John Trê',
        email: 'johndoe@example.com',
        pseudo_login: 'johntre',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change to another user login', async () => {
    await fakeUsersRepository.create({
      display_name: 'John Doe',
      email: 'johndoe@example.com',
      pseudo_login: 'johndoe',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      display_name: 'John Trê',
      email: 'johntre@example.com',
      pseudo_login: 'johntre',
      password: '123456',
    });

    await expect(
      updateUser.execute({
        id: user.id,
        display_name: 'John Trê',
        email: 'johntre@example.com',
        pseudo_login: 'johndoe',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      display_name: 'John Doe',
      email: 'johndoe@example.com',
      pseudo_login: 'johndoe',
      password: '123456',
    });

    const updatedUser = await updateUser.execute({
      id: user.id,
      display_name: 'John Trê',
      email: 'johntre@example.com',
      pseudo_login: 'johntre',
      password: '123123',
    });

    expect(updatedUser.password).toBe('123123');
  });
});
