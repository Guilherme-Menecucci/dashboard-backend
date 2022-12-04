import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import { instanceToInstance } from 'class-transformer';
import IUpdateUserDTO from '../dtos/IUpdateUserDTO';

import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

import User from '../infra/typeorm/entities/User';

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute(data: IUpdateUserDTO): Promise<User> {
    const {
      id,
      display_name,
      pseudo_login,
      email,
      password,
      old_password,
    } = data;

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

    if (password && !old_password) {
      throw new AppError(
        'You need to inform the old password to set a new password.',
      );
    }

    if (password && old_password) {
      const comparePassword = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (comparePassword) {
        throw new AppError('Old password doent match.');
      }
      user.password = await this.hashProvider.generateHash(password);
    }

    return this.userRepository.update(user);
  }
}

export default UpdateProfileService;
