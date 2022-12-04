import { v4 } from 'uuid';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UserToken from '@modules/users/infra/typeorm/entities/UserToken';
import { Repository, getRepository } from 'typeorm';

class UserTokensRepository implements IUserTokensRepository {
  private ormRepository: Repository<UserToken>;

  constructor() {
    this.ormRepository = getRepository(UserToken);
  }

  public async generate(user_id: number): Promise<UserToken> {
    const userToken = this.ormRepository.create({
      token: v4(),
      user_id,
    });

    return this.ormRepository.save(userToken);
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    return this.ormRepository.findOne({
      where: {
        token,
      },
    });
  }
}

export default UserTokensRepository;
