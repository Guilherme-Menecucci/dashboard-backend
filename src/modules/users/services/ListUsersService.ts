import { injectable, inject } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import api from '@shared/services/api';
import User from '../infra/typeorm/entities/User';

interface IRequest {
  id_cliente: number;
  search?: string;
}

@injectable()
class ListUsersService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    search,
    id_cliente,
  }: IRequest): Promise<User[] | undefined> {
    let usersList = await this.cacheProvider.recover<User[]>(
      `users-list:${id_cliente}`,
    );

    if (!usersList || search) {
      usersList = await this.userRepository.find({ id_cliente, search });

      const response = await api.get('/users?page_size=1000');
      console.log(response.data.error.errors);

      usersList = instanceToInstance(usersList);

      if (!search) {
        await this.cacheProvider.save(`users-list:${id_cliente}`, usersList);
      }
    }

    return usersList;
  }
}

export default ListUsersService;
