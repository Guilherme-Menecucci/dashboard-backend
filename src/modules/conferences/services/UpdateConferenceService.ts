import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUpdateConferenceDTO from '../dtos/IUpdateConferenceDTO';

import IConferencesRepository from '../repositories/IConferencesRepository';

import Conference from '../infra/typeorm/entities/Conference';

@injectable()
class UpdateConferenceService {
  constructor(
    @inject('ConferencesRepository')
    private conferenceRepository: IConferencesRepository,
  ) {}

  public async execute(data: IUpdateConferenceDTO): Promise<Conference> {
    const { id, id_grupo, titulo } = data;

    if (id_grupo !== -1 && id_grupo <= 0) {
      throw new AppError('Group not found');
    }

    const conference = await this.conferenceRepository.findById(id);

    if (!conference) {
      throw new AppError('Conference not found');
    }

    conference.id_grupo = id_grupo;
    conference.titulo = titulo;

    return this.conferenceRepository.update(conference);
  }
}

export default UpdateConferenceService;
