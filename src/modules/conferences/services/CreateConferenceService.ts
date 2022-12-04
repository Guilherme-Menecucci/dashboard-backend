import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import { v4 } from 'uuid';
import IConferencesRepository from '../repositories/IConferencesRepository';
import ICreateConferenceDTO from '../dtos/ICreateConferenceDTO';

import Conference from '../infra/typeorm/entities/Conference';
import ConferenceStatus from '../infra/enums/ConferenceStatus';

@injectable()
class CreateConferenceService {
  constructor(
    @inject('ConferencesRepository')
    private conferenceRepository: IConferencesRepository,
  ) {}

  public async execute(data: ICreateConferenceDTO): Promise<Conference> {
    const { id_cliente, salvarPadrao, id_grupo, titulo } = data;

    if (id_grupo !== null && id_grupo <= 0) {
      throw new AppError('Group not found');
    }

    const newConference: Partial<Conference> = {
      id_grupo,
      titulo,
      id_cliente,
      salvarPadrao,
      status: ConferenceStatus.ACTIVED,
      token: v4(),
    };

    const conference = await this.conferenceRepository.create(newConference);

    return conference;
  }
}

export default CreateConferenceService;
