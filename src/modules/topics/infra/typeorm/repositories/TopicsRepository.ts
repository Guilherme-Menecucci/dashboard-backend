import {
  getRepository,
  Repository,
  Like,
  Not,
  Raw,
  QueryBuilder,
  SelectQueryBuilder,
} from 'typeorm';

import ITopicsRepository, {
  ISearchOptions,
} from '@modules/topics/repositories/ITopicsRepository';
import ICreateTopicDTO from '@modules/topics/dtos/ICreateTopicDTO';

import AppError from '@shared/errors/AppError';
import HttpStatusCode from '@shared/enums/HttpStatusCode';
import UserStatus from '@modules/users/infra/enums/UserStatus';
import IUpdateUserDTO from '@modules/users/dtos/IUpdateUserDTO';
import Topic from '@modules/topics/infra/typeorm/entities/Topic';

class TopicsRepository implements ITopicsRepository {
  private ormRepository: Repository<Topic>;

  constructor() {
    this.ormRepository = getRepository(Topic);
  }

  public async create(data: ICreateTopicDTO): Promise<Topic> {
    const topic = this.ormRepository.create(data);
    return this.ormRepository.save(topic);
  }

  // public async find(data?: Partial<Usuarios>): Promise<Usuarios[] | undefined> {
  //   return this.ormRepository.find(data);
  // }

  public async find({ id_cliente, search }: ISearchOptions): Promise<Topic[]> {
    let where: unknown[] = [{ status: Not(UserStatus.DELETED) }];

    if (search) {
      const like = Like(`%${search}%`);
      where = [
        { pseudo_login: like, status: Not(UserStatus.DELETED) },
        { display_name: like, status: Not(UserStatus.DELETED) },
      ];
    }

    // return this.ormRepository
    //   .createQueryBuilder('Users')
    //   .leftJoin('Users.clientList', 'clientList')
    //   .where(where)
    //   .andWhere('clientList.id_cliente = :id_cliente', { id_cliente })
    //   .getMany();

    return this.ormRepository.find({
      join: {
        alias: 'Users',
        leftJoin: { clientList: 'Users.clientList' },
      },
      where: (qb: SelectQueryBuilder<Topic>) => {
        qb.where(where).andWhere('clientList.id_cliente = :id_cliente', {
          id_cliente,
        });
      },
      order: {
        status: 'DESC',
        display_name: 'ASC',
      },
    });
  }

  public async findById(id: number): Promise<Topic | undefined> {
    return this.ormRepository.findOne(id);
  }

  public async findByIds(ids: number[]): Promise<Topic[]> {
    const foundList = await this.ormRepository.find({ where: [{ id: ids }] });

    return foundList;
  }

  public async findByLogin(pseudo_login: string): Promise<Topic | undefined> {
    return this.ormRepository.findOne({
      where: [{ pseudo_login, status: Not(UserStatus.DELETED) }],
      relations: ['clientList'],
    });
  }

  public async findByName(search: string): Promise<Topic[] | undefined> {
    if (search) {
      throw new AppError(
        'Search field not defined.',
        HttpStatusCode.BAD_REQUEST,
      );
    }

    const like = Like(`%${search}%`);

    return this.ormRepository.find({
      where: [
        { pseudo_login: like, status: Not(UserStatus.DELETED) },
        { display_name: like, status: Not(UserStatus.DELETED) },
      ],
      order: {
        status: 'DESC',
        display_name: 'ASC',
      },
    });
  }

  public async findByEmail(email: string): Promise<Topic | undefined> {
    return this.ormRepository.findOne({
      where: [{ email, status: Not(UserStatus.DELETED) }],
      relations: ['clientList'],
    });
  }

  public async update(data: IUpdateUserDTO): Promise<Topic> {
    return this.ormRepository.save(data);
  }

  public async delete(id: number): Promise<boolean> {
    this.ormRepository.update(id, { status: UserStatus.DELETED });
    const user = await this.ormRepository.findOne(id);

    return user?.status === UserStatus.DELETED;
  }
}

export default TopicsRepository;
