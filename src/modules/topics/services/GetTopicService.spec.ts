import FakeTopicsRepository from '@modules/topics/repositories/fakes/FakeTopicsRepository';

import GetTopicService from './GetTopicService';

let fakeTopicsRepository: FakeTopicsRepository;

let getTopic: GetTopicService;

describe('GetTopic', () => {
  beforeEach(() => {
    fakeTopicsRepository = new FakeTopicsRepository();

    getTopic = new GetTopicService(fakeTopicsRepository);
  });

  it('should be able to get a topic by id', async () => {
    const topic = await fakeTopicsRepository.create({
      user_id: 1,
      title: 'Topic 1',
    });

    const foundTopic = await getTopic.execute(topic.id);

    expect(foundTopic).toHaveProperty('id');
  });
});
