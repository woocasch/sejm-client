import { openDB, IDBPDatabase } from 'idb';

interface CacheEntry<T> {
  key: string;
  value: T;
  expiry: number;
}

export interface ICacheManager {
  TermsStoreName: string;
  MembersStoreName: string;
  set<T>(storeName: string, key: string, value: T): Promise<void>;
  get<T>(storeName: string, key: string): Promise<T | null>;
  delete(storeName: string, key: string): Promise<void>;
  clear(storeName: string): Promise<void>;
  cleanupExpired(): Promise<void>;
}

export class CacheManager implements ICacheManager {
  private dbName: string = 'sejmDB';
  private ttl: number;
  private dbPromise: Promise<IDBPDatabase>;

  public readonly TermsStoreName = 'terms';
  public readonly MembersStoreName = 'members';

  constructor(ttl: number) {
    this.ttl = ttl;
    this.dbPromise = this.initDB();
  }

  private static createStore(db: IDBPDatabase, storeName: string) {
    if (!db.objectStoreNames.contains(storeName)) {
      const store = db.createObjectStore(storeName, {
        keyPath: 'key',
      });
      store.createIndex('expiry', 'expiry', { unique: false });
    }
  }

  private async initDB(): Promise<IDBPDatabase> {
    return openDB(this.dbName, 1, {
      upgrade: (db) => {
        CacheManager.createStore(db, this.TermsStoreName);
        CacheManager.createStore(db, this.MembersStoreName);
      },
    });
  }

  async set<T>(storeName: string, key: string, value: T): Promise<void> {
    const db = await this.dbPromise;
    const expiry = Date.now() + this.ttl;
    const entry: CacheEntry<T> = { key, value, expiry };
    await db.put(storeName, entry);
  }

  async get<T>(storeName: string, key: string): Promise<T | null> {
    const db = await this.dbPromise;
    const entry = await db.get<string>(storeName, key);

    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiry) {
      await db.delete(storeName, key);
      return null;
    }

    return entry.value;
  }

  async delete(storeName: string, key: string): Promise<void> {
    const db = await this.dbPromise;
    await db.delete(storeName, key);
  }

  async clear(storeName: string): Promise<void> {
    const db = await this.dbPromise;
    await db.clear(storeName);
  }

  async cleanupExpired(): Promise<void> {
    const db = await this.dbPromise;
    for (let i = 0; i < db.objectStoreNames.length; i++) {
      const currentStoreName: string = db.objectStoreNames.item(i)!;
      const tx = db.transaction(currentStoreName, 'readwrite');
      const store = tx.objectStore(currentStoreName);
      const index = store.index('expiry');

      const now = Date.now();
      let cursor = await index.openCursor();

      while (cursor) {
        const currentEntry = cursor.value as CacheEntry<any>;
        if (currentEntry.expiry <= now) {
          console.log('deleting', currentEntry);
          await cursor.delete();
        }
        cursor = await cursor.continue();
      }

      await tx.done;
    }
  }
}

export function CacheManagerFactory(): ICacheManager {
  return new CacheManager(15 * 60 * 1000);
}
