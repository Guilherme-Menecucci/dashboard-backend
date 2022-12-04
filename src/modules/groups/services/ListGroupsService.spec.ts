import { instanceToInstance } from 'class-transformer';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import FakeGroupsRepository from '../repositories/fakes/FakeGroupsRepository';
import ListGroupsService from './ListGroupsService';

let fakeGroupsRepository: FakeGroupsRepository;
let fakeCacheProvider: FakeCacheProvider;

let listGroups: ListGroupsService;

describe('ListGroups', () => {
  beforeEach(() => {
    fakeGroupsRepository = new FakeGroupsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listGroups = new ListGroupsService(fakeGroupsRepository, fakeCacheProvider);
  });

  it('should be able to list all conferences', async () => {
    const group1 = await fakeGroupsRepository.create({
      display_name: 'Group 1',
      userList: [],
      id_cliente: 17,
    });

    const group2 = await fakeGroupsRepository.create({
      display_name: 'Group 2',
      userList: [],
      id_cliente: 17,
    });

    const group3 = await fakeGroupsRepository.create({
      display_name: 'Group 3',
      userList: [],
      id_cliente: 17,
    });

    const groups = await listGroups.execute({
      id_cliente: 17,
    });

    expect(groups).toEqual(instanceToInstance([group1, group2, group3]));
  });

  it('should be able to cache the list of all groups', async () => {
    await fakeGroupsRepository.create({
      display_name: 'Group 1',
      userList: [],
      id_cliente: 17,
    });

    await fakeGroupsRepository.create({
      display_name: 'Group 2',
      userList: [],
      id_cliente: 17,
    });

    await fakeGroupsRepository.create({
      display_name: 'Group 3',
      userList: [],
      id_cliente: 17,
    });

    const cacheRecover = jest.spyOn(fakeCacheProvider, 'recover');
    const cacheSave = jest.spyOn(fakeCacheProvider, 'save');

    const conferences = await listGroups.execute({
      id_cliente: 17,
    });
    const conferencesCache = await listGroups.execute({
      id_cliente: 17,
    });

    expect(conferencesCache).toEqual(conferences);
    expect(cacheRecover).toHaveBeenCalledTimes(2);
    expect(cacheSave).toHaveBeenCalledTimes(1);
  });

  it('should not be able to list groups from another client', async () => {
    const group1 = await fakeGroupsRepository.create({
      display_name: 'Group 1',
      userList: [],
      id_cliente: 17,
    });

    const group2 = await fakeGroupsRepository.create({
      display_name: 'Group 2',
      userList: [],
      id_cliente: 17,
    });

    await fakeGroupsRepository.create({
      display_name: 'Group 3',
      userList: [],
      id_cliente: 19,
    });

    const groups = await listGroups.execute({
      id_cliente: 17,
    });

    expect(groups).toEqual(instanceToInstance([group1, group2]));
  });

  it('should be able to list all groups by a search', async () => {
    const group1 = await fakeGroupsRepository.create({
      display_name: 'Group Search',
      userList: [],
      id_cliente: 17,
    });

    await fakeGroupsRepository.create({
      display_name: 'Group 2',
      userList: [],
      id_cliente: 17,
    });

    await fakeGroupsRepository.create({
      display_name: 'Group 3',
      userList: [],
      id_cliente: 17,
    });

    const groups = await listGroups.execute({
      id_cliente: 17,
      search: 'Search',
    });

    expect(groups).toEqual(instanceToInstance([group1]));
  });

  it('should not be able to cache the list of all groups while searching', async () => {
    await fakeGroupsRepository.create({
      display_name: 'Group 1',
      userList: [],
      id_cliente: 17,
    });

    await fakeGroupsRepository.create({
      display_name: 'Group 2',
      userList: [],
      id_cliente: 17,
    });

    await fakeGroupsRepository.create({
      display_name: 'Group 3',
      userList: [],
      id_cliente: 17,
    });

    const cacheRecover = jest.spyOn(fakeCacheProvider, 'recover');
    const cacheSave = jest.spyOn(fakeCacheProvider, 'save');

    const conferences = await listGroups.execute({
      id_cliente: 17,
      search: 'Group',
    });
    const conferencesCache = await listGroups.execute({
      id_cliente: 17,
      search: 'Group',
    });

    expect(conferencesCache).toEqual(conferences);
    expect(cacheRecover).toHaveBeenCalledTimes(2);
    expect(cacheSave).toHaveBeenCalledTimes(0);
  });

  it("should be able to doesn't list any group by a search", async () => {
    await fakeGroupsRepository.create({
      display_name: 'Group Search',
      userList: [],
      id_cliente: 17,
    });

    await fakeGroupsRepository.create({
      display_name: 'Group 2',
      userList: [],
      id_cliente: 17,
    });

    await fakeGroupsRepository.create({
      display_name: 'Group 3',
      userList: [],
      id_cliente: 17,
    });

    const groups = await listGroups.execute({
      id_cliente: 17,
      search: 'non-matching-user',
    });

    expect(groups).toEqual([]);
  });
});
