import Conference from '../infra/typeorm/entities/Conference';

export interface ISearchOptions {
  id_cliente: number;
  search?: string;
}

interface IConferencesRepository {
  /**
   * Create a new conference
   * @param data Conference base/complete data to create
   */
  create(data: any): Promise<Conference>;

  /**
   * Search all available (non-deleted) conferences
   * @param search Text to search by titulo
   */
  find(searchOptions: ISearchOptions): Promise<Conference[]>;

  /**
   * Search a specific (non-deleted) conference
   * @param id Id of desired conference
   */
  findById(id: number): Promise<Conference | undefined>;

  /**
   * Update a specific (non-deleted) conference
   * @param id Id of desired conference
   */
  update(data: Partial<Conference>): Promise<Conference>;

  /**
   * Delete a specific (non-deleted) conference
   * @param id Id of desired conference
   */
  delete(id: number): Promise<boolean>;
}

export default IConferencesRepository;
