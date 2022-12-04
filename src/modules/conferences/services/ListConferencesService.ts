import { injectable, inject } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import IConferencesRepository from '@modules/conferences/repositories/IConferencesRepository';
import Conference from '../infra/typeorm/entities/Conference';

interface IRequest {
  id_cliente: number;
  search?: string;
}

@injectable()
class ListConferencesService {
  constructor(
    @inject('ConferencesRepository')
    private conferenceRepository: IConferencesRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    id_cliente,
    search,
  }: IRequest): Promise<Conference[] | undefined> {
    let conferencesList = await this.cacheProvider.recover<Conference[]>(
      `conferences-list:${id_cliente}`,
    );

    if (!conferencesList || search) {
      conferencesList = await this.conferenceRepository.find({
        id_cliente,
        search,
      });

      conferencesList = instanceToInstance(conferencesList);

      if (!search) {
        await this.cacheProvider.save(
          `conferences-list:${id_cliente}`,
          conferencesList,
        );
      }
    }

    return conferencesList;
  }
}

export default ListConferencesService;
