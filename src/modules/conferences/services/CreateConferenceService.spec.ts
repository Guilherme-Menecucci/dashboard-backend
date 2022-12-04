import AppError from '@shared/errors/AppError';

import FakeConferencesRepository from '../repositories/fakes/FakeConferencesRepository';

import CreateConferenceService from './CreateConferenceService';

let fakeConferencesRepository: FakeConferencesRepository;

let createConference: CreateConferenceService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeConferencesRepository = new FakeConferencesRepository();

    createConference = new CreateConferenceService(fakeConferencesRepository);
  });

  it('should be able to create a new conference', async () => {
    const conference = await createConference.execute({
      id_grupo: 1,
      titulo: 'Test Conference',
      id_cliente: 17,
    });

    expect(conference).toHaveProperty('id');
  });

  it('should be able to create conferences with same data', async () => {
    const conference1 = await createConference.execute({
      id_grupo: 1,
      titulo: 'Test Conference',
      id_cliente: 17,
    });

    const conference2 = await createConference.execute({
      id_grupo: 1,
      titulo: 'Test Conference',
      id_cliente: 17,
    });

    expect(conference1.id).not.toBe(conference2.id);
    expect(conference1.titulo).toBe(conference2.titulo);
    expect(conference1.id_grupo).toBe(conference2.id_grupo);
  });

  it('should not be able to create a conference for non existing group', async () => {
    await expect(
      createConference.execute({
        id_grupo: 0,
        titulo: 'Title 1',
        id_cliente: 17,
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createConference.execute({
        id_grupo: -2,
        titulo: 'Title 1',
        id_cliente: 17,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
