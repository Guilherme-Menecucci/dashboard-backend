import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import CreateSessionService from './CreateSessionService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

let createSession: CreateSessionService;

describe('CreateSession', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createSession = new CreateSessionService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate', async () => {
    await fakeUsersRepository.create({
      display_name: 'John Doe',
      pseudo_login: 'johndoe',
      password: '123456',
      email: 'johndoe@example.com',
      idClient: 17,
    });

    const response = await createSession.execute({
      pseudoLogin: 'johndoe',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
  });

  it('should not be able to authenticate with non existing user', async () => {
    await expect(
      createSession.execute({
        pseudoLogin: 'johndoe',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await fakeUsersRepository.create({
      display_name: 'John Doe',
      pseudo_login: 'johndoe',
      password: '123456',
      email: 'johndoe@example.com',
      idClient: 17,
    });

    await expect(
      createSession.execute({
        pseudoLogin: 'johndoe',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with user without client', async () => {
    await fakeUsersRepository.create({
      display_name: 'John Doe',
      pseudo_login: 'johndoe',
      password: '123456',
      email: 'johndoe@example.com',
    });

    await expect(
      createSession.execute({
        pseudoLogin: 'johndoe',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
