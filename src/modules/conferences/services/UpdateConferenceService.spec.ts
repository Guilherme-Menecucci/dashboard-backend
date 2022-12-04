import AppError from '@shared/errors/AppError';

import FakeConferencesRepository from '../repositories/fakes/FakeConferencesRepository';

import UpdateConferenceService from './UpdateConferenceService';

let fakeConferencesRepository: FakeConferencesRepository;

let updateConference: UpdateConferenceService;

describe('UpdateUser', () => {
  beforeEach(() => {
    fakeConferencesRepository = new FakeConferencesRepository();

    updateConference = new UpdateConferenceService(fakeConferencesRepository);
  });

  it('should be able to update conference data', async () => {
    const conference = await fakeConferencesRepository.create({
      id_grupo: 1,
      titulo: 'Test 1',
      id_cliente: 17,
    });

    const updatedConference = await updateConference.execute({
      id: conference.id,
      id_grupo: -1,
      titulo: 'Title 1',
    });

    expect(updatedConference.titulo).toBe('Title 1');
    expect(updatedConference.id_grupo).toBe(-1);
  });

  it('should not be able to update from non existing id', async () => {
    await expect(
      updateConference.execute({
        id: 1,
        id_grupo: -1,
        titulo: 'Title 1',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update for non existing group', async () => {
    const conference = await fakeConferencesRepository.create({
      id_grupo: 1,
      titulo: 'Test 1',
      id_cliente: 17,
    });

    await expect(
      updateConference.execute({
        id: conference.id,
        id_grupo: 0,
        titulo: 'Title 1',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      updateConference.execute({
        id: conference.id,
        id_grupo: -2,
        titulo: 'Title 1',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
