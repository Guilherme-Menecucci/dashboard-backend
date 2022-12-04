import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import CreateSessionClientService from './CreateSessionClientService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

let createSessionClient: CreateSessionClientService;

describe('CreateSession', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createSessionClient = new CreateSessionClientService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to change client', async () => {
    const user = await fakeUsersRepository.create({
      display_name: 'John Doe',
      pseudo_login: 'johndoe',
      password: '123456',
      email: 'johndoe@example.com',
      idClient: 17,
    });

    await fakeUsersRepository.update({
      id: user.id,
      clientList: [
        { id_cliente: 17, id_usuario: user.id },
        { id_cliente: 19, id_usuario: user.id },
      ],
    });

    const response = await createSessionClient.execute({
      id: user.id,
      id_cliente: 19,
    });

    expect(response).toHaveProperty('token');
  });

  it('should not be able to change to a client that does not have', async () => {
    const user = await fakeUsersRepository.create({
      display_name: 'John Doe',
      pseudo_login: 'johndoe',
      password: '123456',
      email: 'johndoe@example.com',
      idClient: 17,
    });

    await expect(
      createSessionClient.execute({
        id: user.id,
        id_cliente: 19,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change without user id', async () => {
    await expect(
      createSessionClient.execute({
        id: 0,
        id_cliente: 19,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change with user without client', async () => {
    const user = await fakeUsersRepository.create({
      display_name: 'John Doe',
      pseudo_login: 'johndoe',
      password: '123456',
      email: 'johndoe@example.com',
    });

    await expect(
      createSessionClient.execute({
        id: user.id,
        id_cliente: 19,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
