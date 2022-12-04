import { instanceToInstance } from 'class-transformer';
import { injectable, inject } from 'tsyringe';

import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

@injectable()
class GetUserService {
  private userRepository: IUsersRepository;

  constructor(
    @inject('UsersRepository')
    userRepository: IUsersRepository,
  ) {
    this.userRepository = userRepository;
  }

  public async execute(id: number): Promise<User | undefined> {
    const user = await this.userRepository.findById(id);

    return instanceToInstance(user);
  }
}

export default GetUserService;
