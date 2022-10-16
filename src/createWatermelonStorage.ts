import {
  appSchema,
  tableSchema,
  Model,
  Database,
  Q,
} from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { Platform } from 'react-native';
import type { Storage } from 'redux-persist';

const tableName = 'data';

// Schema
const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: tableName,
      columns: [
        {
          name: 'key',
          type: 'string',
          isIndexed: true,
        },
        {
          name: 'value',
          type: 'string',
        },
      ],
    }),
  ],
});

// Model
class Data extends Model {
  static table = tableName;

  @field('key')
  key?: string;

  @field('value')
  value?: string;
}

var database: Database | null = null;

function getDatabase() {
  if (!database) {
    const adapter = new SQLiteAdapter({
      schema,
      jsi: Platform.OS === 'ios',
      onSetUpError: (error) => {
        console.warn('Error setup database: ', error.message);
      },
    });

    database = new Database({
      adapter,
      modelClasses: [Data],
    });
  }

  return database;
}

type Callback = (error: Error | null, result?: any) => void;

async function runWithCallback(callback: Callback, func: () => any) {
  try {
    const result = await func();

    if (callback) {
      callback(null, result);
    }
    return result;
  } catch (err: any) {
    if (callback) {
      callback(err);
    } else {
      throw err;
    }
  }
}

export default function createWatermelonStorage(): Storage {
  return {
    getItem: async (key: string, callback: Callback) => {
      return runWithCallback(callback, async function () {
        const data = getDatabase().get(tableName);
        const foundItems = await data.query(Q.where('key', key)).fetch();

        if (foundItems.length > 0) {
          return (foundItems[0] as Data).value;
        } else {
          throw new Error(`Could not get item with key: '${key}'`);
        }
      });
    },
    setItem: async (key: string, value: string, callback: Callback) => {
      return runWithCallback(callback, async function () {
        await getDatabase().write(async () => {
          const data = getDatabase().get(tableName);
          const foundItems = await data.query(Q.where('key', key)).fetch();

          if (foundItems.length === 0) {
            await data.create((item) => {
              const it = item as Data;

              it.key = key;
              it.value = value;
            });
          } else {
            await foundItems[0]?.update((item) => {
              const it = item as Data;
              it.value = value;
            });
          }
        });
      });
    },
    removeItem: async (key: string, callback: Callback) => {
      return runWithCallback(callback, async function () {
        await getDatabase().write(async () => {
          const data = getDatabase().get(tableName);
          const foundItems = await data.query(Q.where('key', key)).fetch();

          if (foundItems.length > 0) {
            const it = foundItems[0];
            await it?.markAsDeleted();
            await it?.destroyPermanently();
          }
        });
      });
    },
  };
}
