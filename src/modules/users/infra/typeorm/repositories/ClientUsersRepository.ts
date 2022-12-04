import { getRepository, Repository } from 'typeorm';

import IClientUsersRepository from '@modules/users/repositories/IClientUsersRepository';
import ICreateClientUserDTO from '@modules/users/dtos/ICreateClientUserDTO';

import AppError from '@shared/errors/AppError';
import HttpStatusCode from '@shared/enums/HttpStatusCode';
import ClientUsers from '../entities/ClientUsers';

class ClientUsersRepository implements IClientUsersRepository {
  private ormRepository: Repository<ClientUsers>;

  constructor() {
    this.ormRepository = getRepository(ClientUsers);
  }

  public async create({
    idClient: id_cliente,
    idUser: id_usuario,
  }: ICreateClientUserDTO): Promise<ClientUsers> {
    const foundUser = await this.ormRepository.findOne({
      id_cliente,
      id_usuario,
    });

    if (foundUser) {
      throw new AppError(
        'User already linked with this client.',
        HttpStatusCode.BAD_REQUEST,
      );
    }

    const newClientUser = { id_cliente, id_usuario };

    const clientUser = this.ormRepository.create(newClientUser);
    return this.ormRepository.save(clientUser);
  }
}

export default ClientUsersRepository;
