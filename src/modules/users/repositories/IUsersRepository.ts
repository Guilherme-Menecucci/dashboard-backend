import User from '../infra/typeorm/entities/User';
import ICreateUserDTO from '../dtos/ICreateUserDTO';

export interface ISearchOptions {
  id_cliente: number;
  search?: string;
}

interface IUsersRepository {
  /**
   * Create a new user
   * @param data User base/complete data to create
   */
  create(data: ICreateUserDTO): Promise<User>;

  /**
   * Search all available (non-deleted) users
   * @param search Text to search by pseudo_login or display_name
   */
  find(searchOptions: ISearchOptions): Promise<User[]>;

  /**
   * Search a specific (non-deleted) user
   * @param id Id of desired user
   */
  findById(id: number): Promise<User | undefined>;

  /**
   * Search a (non-deleted) user by a collection of id
   * @param ids Ids of desired users
   */
  findByIds(ids: number[]): Promise<User[]>;

  /**
   * Search an user by login
   * @param pseudoLogin Vconf login of an user
   */
  findByLogin(pseudoLogin: string): Promise<User | undefined>;

  /**
   * Search an user by E-mail
   * @param pseudoLogin Vconf login of an user
   */
  findByEmail(email: string): Promise<User | undefined>;

  /**
   * Update a specific (non-deleted) user
   * @param id Id of desired user
   */
  update(data: Partial<User>): Promise<User>;

  /**
   * Delete a specific (non-deleted) user
   * @param id Id of desired user
   */
  delete(id: number): Promise<boolean>;
}

export default IUsersRepository;
