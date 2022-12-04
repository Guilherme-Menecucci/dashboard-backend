import { instanceToInstance } from 'class-transformer';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import FakeConferencesRepository from '../repositories/fakes/FakeConferencesRepository';
import ListConferencesService from './ListConferencesService';

let fakeConferencesRepository: FakeConferencesRepository;
let fakeCacheProvider: FakeCacheProvider;

let listConferences: ListConferencesService;

describe('LisetUsers', () => {
  beforeEach(() => {
    fakeConferencesRepository = new FakeConferencesRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listConferences = new ListConferencesService(
      fakeConferencesRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list all conferences', async () => {
    const conference1 = await fakeConferencesRepository.create({
      id_grupo: 1,
      titulo: 'Test 1',
      id_cliente: 17,
    });

    const conference2 = await fakeConferencesRepository.create({
      id_grupo: 2,
      titulo: 'Test 2',
      id_cliente: 17,
    });

    const conference3 = await fakeConferencesRepository.create({
      id_grupo: 3,
      titulo: 'Test 3',
      id_cliente: 17,
    });

    const conferences = await listConferences.execute({ id_cliente: 17 });

    expect(conferences).toEqual(
      instanceToInstance([conference1, conference2, conference3]),
    );
  });

  it('should be able to cache the list of all conferences', async () => {
    await fakeConferencesRepository.create({
      id_grupo: 1,
      titulo: 'Test 1',
      id_cliente: 17,
    });

    await fakeConferencesRepository.create({
      id_grupo: 2,
      titulo: 'Test 2',
      id_cliente: 17,
    });

    await fakeConferencesRepository.create({
      id_grupo: 3,
      titulo: 'Test 3',
      id_cliente: 17,
    });

    const cacheRecover = jest.spyOn(fakeCacheProvider, 'recover');
    const cacheSave = jest.spyOn(fakeCacheProvider, 'save');

    const conferences = await listConferences.execute({
      id_cliente: 17,
    });
    const conferencesCache = await listConferences.execute({
      id_cliente: 17,
    });

    expect(conferencesCache).toEqual(conferences);
    expect(cacheRecover).toHaveBeenCalledTimes(2);
    expect(cacheSave).toHaveBeenCalledTimes(1);
  });

  it('should not be able to list any conferences from another client', async () => {
    await fakeConferencesRepository.create({
      id_grupo: 1,
      titulo: 'Title 1',
      id_cliente: 17,
    });

    await fakeConferencesRepository.create({
      id_grupo: 2,
      titulo: 'Test 2',
      id_cliente: 17,
    });

    await fakeConferencesRepository.create({
      id_grupo: 3,
      titulo: 'Test 3',
      id_cliente: 17,
    });

    const conferences = await listConferences.execute({
      id_cliente: 19,
      search: 'Test',
    });

    expect(conferences).toEqual([]);
  });

  it('should be able to list all conferences by a search', async () => {
    const conference1 = await fakeConferencesRepository.create({
      id_grupo: 1,
      titulo: 'Title 1',
      id_cliente: 17,
    });

    await fakeConferencesRepository.create({
      id_grupo: 2,
      titulo: 'Test 2',
      id_cliente: 17,
    });

    await fakeConferencesRepository.create({
      id_grupo: 3,
      titulo: 'Test 3',
      id_cliente: 17,
    });

    const users = await listConferences.execute({
      id_cliente: 17,
      search: 'Title',
    });

    expect(users).toEqual(instanceToInstance([conference1]));
  });

  it('should not be able to cache the list of conferences while searching', async () => {
    await fakeConferencesRepository.create({
      id_grupo: 1,
      titulo: 'Test 1',
      id_cliente: 17,
    });

    const cacheRecover = jest.spyOn(fakeCacheProvider, 'recover');
    const cacheSave = jest.spyOn(fakeCacheProvider, 'save');

    const conferences = await listConferences.execute({
      id_cliente: 17,
      search: 'Test',
    });
    const conferencesCache = await listConferences.execute({
      id_cliente: 17,
      search: 'Test',
    });

    expect(conferencesCache).toEqual(conferences);
    expect(cacheRecover).toHaveBeenCalledTimes(2);
    expect(cacheSave).toHaveBeenCalledTimes(0);
  });

  it("should be able to doesn't list any conferences by a search", async () => {
    await fakeConferencesRepository.create({
      id_grupo: 1,
      titulo: 'Title 1',
      id_cliente: 17,
    });

    await fakeConferencesRepository.create({
      id_grupo: 2,
      titulo: 'Test 2',
      id_cliente: 17,
    });

    await fakeConferencesRepository.create({
      id_grupo: 3,
      titulo: 'Test 3',
      id_cliente: 17,
    });

    const conferences = await listConferences.execute({
      id_cliente: 17,
      search: 'non-matching-conference',
    });

    expect(conferences).toEqual([]);
  });
});
