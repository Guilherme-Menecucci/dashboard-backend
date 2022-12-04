import Group from '../infra/typeorm/entities/Group';
import ICreateGroupDTO from '../dtos/ICreateGroupDTO';

export interface ISearchOptions {
  id_cliente: number;
  search?: string;
}

interface IGroupsRepository {
  /**
   * Create a new group
   * @param data Group base/complete data to create
   */
  create(data: ICreateGroupDTO): Promise<Group>;

  /**
   * Search all available (non-deleted) groups
   * @param search Text to search by titulo
   */
  find(searchOptions: ISearchOptions): Promise<Group[]>;

  /**
   * Search a group
   * @param id Id of desired group
   */
  findById(id: number): Promise<Group | undefined>;

  /**
   * Search a group
   * @param displayName Display Name of desired group
   */
  findByDisplayName(displayName: string): Promise<Group | undefined>;

  /**
   * Update a group
   * @param id Id of desired group
   */
  update(data: Partial<Group>): Promise<Group>;

  /**
   * Delete a group
   * @param id Id of desired group
   */
  delete(id: number): Promise<boolean>;
}

export default IGroupsRepository;
