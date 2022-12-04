import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

let updateProfile: UpdateProfileService;

describe('UpdateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update profile', async () => {
    const user = await fakeUsersRepository.create({
      display_name: 'John Doe',
      email: 'johndoe@example.com',
      pseudo_login: 'johndoe',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
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
      updateProfile.execute({
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
      updateProfile.execute({
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
      updateProfile.execute({
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

    const updatedUser = await updateProfile.execute({
      id: user.id,
      display_name: 'John Trê',
      email: 'johntre@example.com',
      pseudo_login: 'johntre',
      password: '123123',
      old_password: '123456',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('should not be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      display_name: 'John Doe',
      email: 'johndoe@example.com',
      pseudo_login: 'johndoe',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        id: user.id,
        display_name: 'John Trê',
        email: 'johntre@example.com',
        pseudo_login: 'johntre',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      display_name: 'John Doe',
      email: 'johndoe@example.com',
      pseudo_login: 'johndoe',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        id: user.id,
        display_name: 'John Trê',
        email: 'johntre@example.com',
        pseudo_login: 'johntre',
        password: '123123',
        old_password: 'wrong-old-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
