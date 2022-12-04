import IClientUsersRepository from '@modules/users/repositories/IClientUsersRepository';
import ICreateClientUserDTO from '@modules/users/dtos/ICreateClientUserDTO';

import AppError from '@shared/errors/AppError';
import HttpStatusCode from '@shared/enums/HttpStatusCode';
import ClientUsers from '@modules/users/infra/typeorm/entities/ClientUsers';

class FakeClientUsersRepository implements IClientUsersRepository {
  private clienteUsuarios: ClientUsers[] = [];

  public async create(
    dataClientUser: ICreateClientUserDTO,
  ): Promise<ClientUsers> {
    const foundUser = await this.clienteUsuarios.find(
      clienteUsuario =>
        clienteUsuario.id_usuario === dataClientUser.idUser &&
        clienteUsuario.id_cliente === dataClientUser.idClient,
    );

    if (foundUser) {
      throw new AppError(
        'User already linked with this client.',
        HttpStatusCode.BAD_REQUEST,
      );
    }

    const clientUser = new ClientUsers();
    this.clienteUsuarios.push(clientUser);

    return clientUser;
  }
}

export default FakeClientUsersRepository;
