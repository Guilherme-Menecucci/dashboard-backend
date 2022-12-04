import Topic from '@modules/topics/infra/typeorm/entities/Topic';
import ICreateTopicDTO from '@modules/topics/dtos/ICreateTopicDTO';

export interface ISearchOptions {
  search?: string;
}

interface ITopicsRepository {
  /**
   * Create a new topic
   * @param data Topic base/complete data to create
   */
  create(data: ICreateTopicDTO): Promise<Topic>;

  /**
   * Search all available (non-deleted) topics
   * @param search Text to search by title
   */
  find(searchOptions: ISearchOptions): Promise<Topic[]>;

  /**
   * Search a specific (non-deleted) topic
   * @param id Id of desired topic
   */
  findById(id: number): Promise<Topic | undefined>;

  /**
   * Update a specific (non-deleted) topic
   * @param id Id of desired topic
   */
  update(data: Partial<Topic>): Promise<Topic>;

  /**
   * Delete a specific (non-deleted) topic
   * @param id Id of desired topic
   */
  delete(id: number): Promise<boolean>;
}

export default ITopicsRepository;
