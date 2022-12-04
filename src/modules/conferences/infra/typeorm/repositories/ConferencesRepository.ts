import { getRepository, Repository, Like, Not } from 'typeorm';

import IConferencesRepository, {
  ISearchOptions,
} from '@modules/conferences/repositories/IConferencesRepository';

import ICreateConferenceDTO from '@modules/conferences/dtos/ICreateConferenceDTO';
import IUpdateConferenceDTO from '@modules/conferences/dtos/IUpdateConferenceDTO';

import UserStatus from '@modules/users/infra/enums/UserStatus';
import Conference from '../entities/Conference';

class ConferencesRepository implements IConferencesRepository {
  private ormRepository: Repository<Conference>;

  constructor() {
    this.ormRepository = getRepository(Conference);
  }

  public async create(data: ICreateConferenceDTO): Promise<Conference> {
    const conference = this.ormRepository.create(data);
    return this.ormRepository.save(conference);
  }

  public async find({
    id_cliente,
    search,
  }: ISearchOptions): Promise<Conference[]> {
    let where: unknown[] = [{ id_cliente, status: Not(UserStatus.DELETED) }];

    if (search) {
      const like = Like(`%${search}%`);
      where = [{ titulo: like, id_cliente, status: Not(UserStatus.DELETED) }];
    }

    return this.ormRepository.find({
      where,
      order: {
        status: 'DESC',
        titulo: 'ASC',
      },
    });
  }

  public async findById(id: number): Promise<Conference | undefined> {
    return this.ormRepository.findOne(id);
  }

  public async update(data: IUpdateConferenceDTO): Promise<Conference> {
    return this.ormRepository.save(data);
  }

  public async delete(id: number): Promise<boolean> {
    this.ormRepository.update(id, { status: UserStatus.DELETED });
    const user = await this.ormRepository.findOne(id);

    return user?.status === UserStatus.DELETED;
  }
}

export default ConferencesRepository;
