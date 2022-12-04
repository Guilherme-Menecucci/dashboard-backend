import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUpdateUserDTO from '../dtos/IUpdateUserDTO';

import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

import User from '../infra/typeorm/entities/User';

@injectable()
class UpdateUserService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute(data: IUpdateUserDTO): Promise<User> {
    const { id, display_name, pseudo_login, email, password } = data;

    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new AppError('User not found.');
    }

    const userWithUpdatedEmail = await this.userRepository.findByEmail(email);

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== id) {
      throw new AppError('E-mail already in use.');
    }

    const userWithUpdatedLogin = await this.userRepository.findByLogin(
      pseudo_login,
    );

    if (userWithUpdatedLogin && userWithUpdatedLogin.id !== id) {
      throw new AppError('Login already in use.');
    }

    user.email = email;
    user.display_name = display_name;
    user.pseudo_login = pseudo_login;

    if (password) {
      user.password = await this.hashProvider.generateHash(password);
    }

    return this.userRepository.update(user);
  }
}

export default UpdateUserService;
