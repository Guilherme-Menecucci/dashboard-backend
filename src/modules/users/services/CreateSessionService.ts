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
  pseudoLogin: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

@injectable()
class CreateSessionService {
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

  public async execute({
    pseudoLogin: pseudo_login,
    password,
  }: IRequest): Promise<IResponse> {
    const user = await this.userRepository.findByLogin(pseudo_login);

    if (!user) {
      throw new AppError(
        'Incorrect login/passsword combination.',
        HttpStatusCode.UNAUTHORIZED,
      );
    }

    // const passwordMatched = await compare(password, user.password);
    const passwordMatched = await this.hashProvider.compareHash(
      password,
      String(user.password),
    );

    if (passwordMatched) {
      throw new AppError(
        'Incorrect login/passsword combination.',
        HttpStatusCode.UNAUTHORIZED,
      );
    }

    if (!user.clientList || user.clientList.length === 0) {
      throw new AppError(
        'Incorrect login/passsword combination.',
        HttpStatusCode.UNAUTHORIZED,
      );
    }

    const { secret, expiresIn } = authConfig.jwt;

    const returnUser = instanceToInstance(user);

    const token = sign(
      {
        client: user.clientList[0].id_cliente,
      },
      secret,
      {
        subject: String(returnUser.id),
        expiresIn,
      },
    );

    return { user: returnUser, token };
  }
}

export default CreateSessionService;
