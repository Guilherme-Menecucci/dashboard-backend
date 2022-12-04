import ClientUsers from '../infra/typeorm/entities/ClientUsers';
import ICreateClientUserDTO from '../dtos/ICreateClientUserDTO';

export interface ISearch {
  search?: string;
}

interface IUsersRepository {
  /**
   * Create a new relationship of client-user
   * @param data User base/complete data to create
   */
  create(data: ICreateClientUserDTO): Promise<ClientUsers>;
}

export default IUsersRepository;
