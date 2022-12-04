import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import HttpStatusCode from '@shared/enums/HttpStatusCode';
import { instanceToInstance } from 'class-transformer';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  id: number;
  id_cliente: number;
}

interface IResponse {
  user: User;
  token: string;
}

@injectable()
class CreateSessionClientService {
  private userRepository: IUsersRepository;

  private hashProvider: IHashProvider;

  constructor(
    @inject('UsersRepository')
    userRepository: IUsersRepository,
    @inject('HashProvider')
    hashProvider: IHashProvider,
  ) {
    this.userRepository = userRepository;
    this.hashProvider = hashProvider;
  }

  public async execute({ id, id_cliente }: IRequest): Promise<IResponse> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new AppError('Client not found.');
    }

    if (!user.clientList?.find(client => client.id_cliente === id_cliente)) {
      throw new AppError('Client not found.');
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign(
      {
        client: id_cliente,
      },
      secret,
      {
        subject: String(id),
        expiresIn,
      },
    );

    return { user: instanceToInstance(user), token };
  }
}

export default CreateSessionClientService;
