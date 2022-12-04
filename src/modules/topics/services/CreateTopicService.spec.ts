import FakeTopicsRepository from '@modules/topics/repositories/fakes/FakeTopicsRepository';

import CreateTopicService from './CreateTopicService';

let fakeTopicsRepository: FakeTopicsRepository;

let createTopic: CreateTopicService;

describe('CreateTopic', () => {
  beforeEach(() => {
    fakeTopicsRepository = new FakeTopicsRepository();

    createTopic = new CreateTopicService(fakeTopicsRepository);
  });

  it('should be able to create a new topic', async () => {
    const topic = await createTopic.execute({
      title: 'Topic 1',
      user_id: 1,
    });

    expect(topic).toHaveProperty('id');
  });

  it('should be able to create two topics with same title', async () => {
    const topicData = {
      title: 'Topic 1',
      user_id: 1,
    };

    await createTopic.execute(topicData);

    await expect(createTopic.execute(topicData)).resolves.toHaveProperty('id', 2);
  });
});
