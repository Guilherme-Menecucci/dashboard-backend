import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import HttpStatusCode from '@shared/enums/HttpStatusCode';
import UserStatus from '@modules/users/infra/enums/UserStatus';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IClientUsersRepository from '../repositories/IClientUsersRepository';
import ICreateUserDTO from '../dtos/ICreateUserDTO';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

import User from '../infra/typeorm/entities/User';

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUsersRepository,

    @inject('ClientUsersRepository')
    private clientUserRepository: IClientUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(data: ICreateUserDTO): Promise<User> {
    const {
      email,
      password,
      pseudo_login,
      display_name,
      observacao,
      mobile_phone,
      work_phone,
      home_phone,
      status,
      is_active,
      is_avulso,
    } = data;

    const foundLogin = await this.userRepository.findByLogin(pseudo_login);

    if (foundLogin) {
      throw new AppError(
        'Login Name already exists.',
        HttpStatusCode.BAD_REQUEST,
      );
    }

    const foundMail = await this.userRepository.findByEmail(email);

    if (foundMail) {
      throw new AppError('E-mail already exists.', HttpStatusCode.BAD_REQUEST);
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const newUser: ICreateUserDTO = {
      email,
      password: hashedPassword,
      pseudo_login,
      login_name: pseudo_login.substr(0, 22) + new Date().getTime(),
      display_name,
      observacao,
      mobile_phone,
      work_phone,
      home_phone,
      status: status || UserStatus.ACTIVED,
      is_active: is_active || UserStatus.ACTIVED,
      is_avulso: is_avulso || UserStatus.INACTIVED,
    };

    const user = await this.userRepository.create(newUser);

    await this.clientUserRepository.create({
      idUser: user.id,
      idClient: Number(data.idClient),
    });

    await this.cacheProvider.invalidate('users-list');

    return user;
  }
}

export default CreateUserService;
