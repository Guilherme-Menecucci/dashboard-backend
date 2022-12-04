import AppError from '@shared/errors/AppError';

import FakeTopicsRepository from '@modules/topics/repositories/fakes/FakeTopicsRepository';
import UpdateTopicService from './UpdateTopicService';

let fakeTopicsRepository: FakeTopicsRepository;

let updateTopic: UpdateTopicService;

const firstUserId = 1;
const secondUserId = 2;

describe('UpdateUser', () => {
  beforeEach(() => {
    fakeTopicsRepository = new FakeTopicsRepository();

    updateTopic = new UpdateTopicService(fakeTopicsRepository);
  });

  it('should be able to update topic', async () => {
    const topic = await fakeTopicsRepository.create({
      user_id: firstUserId,
      title: 'Topic 1',
    });

    const updatedTopic = await updateTopic.execute({
      id: topic.id,
      title: 'Topic 1 - Updated',
    });

    expect(updatedTopic.title).toBe('Topic 1 - Updated');
  });

  it('should be able to update topic to an existing title', async () => {
    const topic = await fakeTopicsRepository.create({
      user_id: firstUserId,
      title: 'Topic 1',
    });

    const topic2 = await fakeTopicsRepository.create({
      user_id: secondUserId,
      title: 'Topic 2',
    });

    const updatedTopic = await updateTopic.execute({
      id: topic.id,
      title: topic2.title,
    });

    expect(updatedTopic.title).toBe(topic2.title);
  });

  it('should not be able to update from non existing id', async () => {
    await expect(
      updateTopic.execute({
        id: -1,
        title: 'Non Existing Topic',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
