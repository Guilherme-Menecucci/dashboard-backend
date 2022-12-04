import { getRepository, Repository, Like, Not } from 'typeorm';

import IGroupsRepository, {
  ISearchOptions,
} from '@modules/groups/repositories/IGroupsRepository';

import ICreateGroupDTO from '@modules/groups/dtos/ICreateGroupDTO';
import IUpdateGroupDTO from '@modules/groups/dtos/IUpdateGroupDTO';

import Group from '../entities/Group';

class GroupsRepository implements IGroupsRepository {
  private ormRepository: Repository<Group>;

  constructor() {
    this.ormRepository = getRepository(Group);
  }

  public async create(data: ICreateGroupDTO): Promise<Group> {
    const conference = this.ormRepository.create(data);
    return this.ormRepository.save(conference);
  }

  public async find({ id_cliente, search }: ISearchOptions): Promise<Group[]> {
    let where: unknown[] = [{ id_cliente }];

    if (search) {
      const like = Like(`%${search}%`);
      where = [{ display_name: like, id_cliente }];
    }

    return this.ormRepository.find({
      where,
      order: {
        display_name: 'ASC',
      },
    });
  }

  public async findById(id: number): Promise<Group | undefined> {
    return this.ormRepository.findOne(id);
  }

  public async findByDisplayName(
    display_name: string,
  ): Promise<Group | undefined> {
    return this.ormRepository.findOne({ where: [{ display_name }] });
  }

  public async update(data: IUpdateGroupDTO): Promise<Group> {
    return this.ormRepository.save(data);
  }

  public async delete(id: number): Promise<boolean> {
    return true;
    // return this.ormRepository.delete(id);
  }
}

export default GroupsRepository;
