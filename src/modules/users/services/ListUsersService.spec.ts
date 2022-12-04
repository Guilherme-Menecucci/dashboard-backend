import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { instanceToInstance } from 'class-transformer';
import User from '../infra/typeorm/entities/User';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import ListUsersService from './ListUsersService';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;

let listUsers: ListUsersService;

describe('LisetUsers', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listUsers = new ListUsersService(fakeUsersRepository, fakeCacheProvider);
  });

  it('should be able to list all users from a client', async () => {
    const user1 = await fakeUsersRepository.create({
      display_name: 'John Doe',
      pseudo_login: 'johndoe',
      password: '123456',
      email: 'johndoe@example.com',
      idClient: 17,
    });

    const user2 = await fakeUsersRepository.create({
      display_name: 'John Trê',
      pseudo_login: 'johntre',
      password: '123456',
      email: 'johntre@example.com',
      idClient: 17,
    });

    await fakeUsersRepository.create({
      display_name: 'John Qua',
      pseudo_login: 'johnqua',
      password: '123456',
      email: 'johnqua@example.com',
      idClient: 19,
    });

    const users = await listUsers.execute({ id_cliente: 17 });

    expect(users).toEqual(instanceToInstance([user1, user2]));
  });

  it('should be able to cache the list of all users from a client', async () => {
    await fakeUsersRepository.create({
      display_name: 'John Doe',
      pseudo_login: 'johndoe',
      password: '123456',
      email: 'johndoe@example.com',
      idClient: 17,
    });

    await fakeUsersRepository.create({
      display_name: 'John Trê',
      pseudo_login: 'johntre',
      password: '123456',
      email: 'johntre@example.com',
      idClient: 17,
    });

    await fakeUsersRepository.create({
      display_name: 'John Qua',
      pseudo_login: 'johnqua',
      password: '123456',
      email: 'johnqua@example.com',
      idClient: 19,
    });

    const cacheRecover = jest.spyOn(fakeCacheProvider, 'recover');
    const cacheSave = jest.spyOn(fakeCacheProvider, 'save');

    const users = await listUsers.execute({ id_cliente: 17 });
    const usersCache = await listUsers.execute({ id_cliente: 17 });

    expect(usersCache).toEqual(users);
    expect(cacheRecover).toHaveBeenCalledTimes(2);
    expect(cacheSave).toHaveBeenCalledTimes(1);
  });

  it('should be able to list all users from a client by a search', async () => {
    const user1 = await fakeUsersRepository.create({
      display_name: 'John Doe',
      pseudo_login: 'johndoe',
      password: '123456',
      email: 'johndoe@example.com',
      idClient: 17,
    });

    await fakeUsersRepository.create({
      display_name: 'John Doe',
      pseudo_login: 'johndoe1',
      password: '123456',
      email: 'johndoe1@example.com',
      idClient: 19,
    });

    await fakeUsersRepository.create({
      display_name: 'John Trê',
      pseudo_login: 'johntre',
      password: '123456',
      email: 'johntre@example.com',
      idClient: 17,
    });

    await fakeUsersRepository.create({
      display_name: 'John Qua',
      pseudo_login: 'johnqua',
      password: '123456',
      email: 'johnqua@example.com',
      idClient: 19,
    });

    const users = await listUsers.execute({ id_cliente: 17, search: 'Doe' });

    expect(users).toEqual(instanceToInstance([user1]));
  });

  it('should not be able to cache the list users while searching', async () => {
    await fakeUsersRepository.create({
      display_name: 'John Doe',
      pseudo_login: 'johndoe',
      password: '123456',
      email: 'johndoe@example.com',
      idClient: 17,
    });

    await fakeUsersRepository.create({
      display_name: 'John Doe',
      pseudo_login: 'johndoe1',
      password: '123456',
      email: 'johndoe1@example.com',
      idClient: 19,
    });

    const cacheRecover = jest.spyOn(fakeCacheProvider, 'recover');
    const cacheSave = jest.spyOn(fakeCacheProvider, 'save');

    const users = await listUsers.execute({ id_cliente: 17, search: 'Doe' });
    const usersCache = await listUsers.execute({
      id_cliente: 17,
      search: 'Doe',
    });

    expect(usersCache).toEqual(users);
    expect(cacheRecover).toHaveBeenCalledTimes(2);
    expect(cacheSave).toHaveBeenCalledTimes(0);
  });

  it("should be able to doesn't list any users from a client by a search", async () => {
    await fakeUsersRepository.create({
      display_name: 'John Doe',
      pseudo_login: 'johndoe',
      password: '123456',
      email: 'johndoe@example.com',
      idClient: 17,
    });

    await fakeUsersRepository.create({
      display_name: 'John Doe',
      pseudo_login: 'non-matching-user',
      password: '123456',
      email: 'non-matching-user@example.com',
      idClient: 19,
    });

    await fakeUsersRepository.create({
      display_name: 'John Trê',
      pseudo_login: 'johntre',
      password: '123456',
      email: 'johntre@example.com',
      idClient: 17,
    });

    const users = await listUsers.execute({
      id_cliente: 17,
      search: 'non-matching-user',
    });

    expect(users).toEqual([]);
  });
});
