import { DataStoreOptions } from 'nedb';

interface ICacheConfig {
  driver: 'nedb';

  config: {
    nedb: DataStoreOptions;
  };
}

export default {
  driver: 'nedb',

  config: {
    nedb: {
      inMemoryOnly: true,
    },
  },
} as ICacheConfig;
