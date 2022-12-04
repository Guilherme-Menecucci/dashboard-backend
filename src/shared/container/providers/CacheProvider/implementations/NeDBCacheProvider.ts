import Datastore from 'nedb-promises';

import cacheConfig from '@config/cache';

import ICacheProvider from '../models/ICacheProvider';

export default class NeDBCacheProvider implements ICacheProvider {
  private client: Datastore;

  constructor() {
    this.client = Datastore.create(cacheConfig.config.nedb);
  }

  public async save(key: string, value: unknown): Promise<void> {
    const newDoc = { _id: key, value };

    await this.client.insert(newDoc);
  }

  public async recover<T>(key: string): Promise<T | undefined> {
    const data = await this.client.findOne<{ value: T }>({ _id: key });

    if (!data) {
      return undefined;
    }

    return data.value;
  }

  public async invalidate(key: string): Promise<void> {
    await this.client.remove({ _id: key }, {});
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    await this.client.remove({ _id: `/^${prefix}:.*/` }, { multi: true });
  }
}
