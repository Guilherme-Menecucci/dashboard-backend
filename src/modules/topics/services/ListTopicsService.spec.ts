import { instanceToInstance } from 'class-transformer';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeTopicsRepository from '@modules/topics/repositories/fakes/FakeTopicsRepository';

import ListTopicsService from './ListTopicsService';

let fakeTopicsRepository: FakeTopicsRepository;
let fakeCacheProvider: FakeCacheProvider;

let listTopics: ListTopicsService;

const firstUserId = 1;
const secondUserId = 2;

describe('ListTopics', () => {
  beforeEach(() => {
    fakeTopicsRepository = new FakeTopicsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listTopics = new ListTopicsService(fakeTopicsRepository, fakeCacheProvider);
  });

  it('should be able to list all topics from a user', async () => {
    const topic1 = await fakeTopicsRepository.create({
      title: 'Topic 1',
      user_id: firstUserId,
    });

    const topic2 = await fakeTopicsRepository.create({
      title: 'Topic 2',
      user_id: firstUserId,
    });

    await fakeTopicsRepository.create({
      title: 'Topic 3',
      user_id: secondUserId,
    });

    const topics = await listTopics.execute({ user_id: firstUserId });

    expect(topics).toEqual(instanceToInstance([topic1, topic2]));
  });

  it('should be able to cache the list of all topics from a user', async () => {
    await fakeTopicsRepository.create({
      title: 'Topic 1',
      user_id: firstUserId,
    });

    await fakeTopicsRepository.create({
      title: 'Topic 2',
      user_id: firstUserId,
    });

    await fakeTopicsRepository.create({
      title: 'Topic 3',
      user_id: firstUserId,
    });

    const cacheRecover = jest.spyOn(fakeCacheProvider, 'recover');
    const cacheSave = jest.spyOn(fakeCacheProvider, 'save');

    const topics = await listTopics.execute({ user_id: firstUserId });
    const topicsCache = await listTopics.execute({ user_id: firstUserId });

    expect(topicsCache).toEqual(topics);
    expect(cacheRecover).toHaveBeenCalledTimes(2);
    expect(cacheSave).toHaveBeenCalledTimes(1);
  });

  it('should be able to list all topics from a user by a search', async () => {
    const topic1 = await fakeTopicsRepository.create({
      title: 'Topic 1',
      user_id: firstUserId,
    });

    await fakeTopicsRepository.create({
      title: 'Topic 2',
      user_id: secondUserId,
    });

    await fakeTopicsRepository.create({
      title: 'Topic 3',
      user_id: firstUserId,
    });

    await fakeTopicsRepository.create({
      title: 'Topic 4',
      user_id: secondUserId,
    });

    const topics = await listTopics.execute({ user_id: 1, search: '1' });

    expect(topics).toEqual(instanceToInstance([topic1]));
  });

  it('should not be able to cache the topics list while searching', async () => {
    await fakeTopicsRepository.create({
      title: 'Topic 1',
      user_id: firstUserId,
    });

    await fakeTopicsRepository.create({
      title: 'Topic 2',
      user_id: firstUserId,
    });

    await fakeTopicsRepository.create({
      title: 'Topic 3',
      user_id: firstUserId,
    });

    const cacheRecover = jest.spyOn(fakeCacheProvider, 'recover');
    const cacheSave = jest.spyOn(fakeCacheProvider, 'save');

    const topics = await listTopics.execute({ user_id: firstUserId, search: 'Topic' });
    const topicsCache = await listTopics.execute({ user_id: firstUserId, search: 'Topic' });

    expect(topicsCache).toEqual(topics);
    expect(cacheRecover).toHaveBeenCalledTimes(2);
    expect(cacheSave).toHaveBeenCalledTimes(0);
  });

  it("should be able to doesn't list any topics from a user by a non matching search", async () => {
    await fakeTopicsRepository.create({
      title: 'Topic 1',
      user_id: firstUserId,
    });

    await fakeTopicsRepository.create({
      title: 'Topic 2',
      user_id: secondUserId,
    });

    await fakeTopicsRepository.create({
      title: 'Topic 3',
      user_id: firstUserId,
    });

    const topics = await listTopics.execute({
      user_id: firstUserId,
      search: 'non-matching-title',
    });

    expect(topics).toEqual([]);
  });
});
