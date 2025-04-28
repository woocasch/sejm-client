import { openDB, IDBPDatabase } from 'idb';

interface CacheEntry<T> {
  key: string;
  value: T;
  expiry: number;
}

export class IndexedDBCacheManager<T = unknown> {
  private dbName: string = 'sejmDB';
  private storeName: string;
  private ttl: number;
  private dbPromise: Promise<IDBPDatabase>;

  constructor(storeName: string, ttl: number) {
    this.storeName = storeName;
    this.ttl = ttl;
    this.dbPromise = this.initDB();
  }

  private async initDB(): Promise<IDBPDatabase> {
    return openDB(this.dbName, 1, {
      upgrade: (db) => {
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, {
            keyPath: 'key',
          });
          store.createIndex('expiry', 'expiry', { unique: false });
        }
      },
    });
  }

  async set(key: string, value: T): Promise<void> {
    const db = await this.dbPromise;
    const expiry = Date.now() + this.ttl;
    const entry: CacheEntry<T> = { key, value, expiry };
    await db.put(this.storeName, entry);
  }

  async get(key: string): Promise<T | null> {
    const db = await this.dbPromise;
    const entry = await db.get<string>(this.storeName, key);

    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiry) {
      await db.delete(this.storeName, key);
      return null;
    }

    return entry.value;
  }

  async delete(key: string): Promise<void> {
    const db = await this.dbPromise;
    await db.delete(this.storeName, key);
  }

  async clear(): Promise<void> {
    const db = await this.dbPromise;
    await db.clear(this.storeName);
  }

  async cleanupExpired(): Promise<void> {
    const db = await this.dbPromise;
    const tx = db.transaction(this.storeName, 'readwrite');
    for (let i = 0; i < tx.objectStoreNames.length; i++) {
      const currentStoreName = tx.objectStoreNames.item(i)!;
      const store = tx.objectStore(currentStoreName);
      const index = store.index('expiry');

      const now = Date.now();
      let cursor = await index.openCursor();

      while (cursor) {
        const currentEntry = cursor.value as CacheEntry<T>;
        if (currentEntry.expiry <= now) {
          console.log('deleting', currentEntry);
          await cursor.delete();
        }
        cursor = await cursor.continue();
      }
    }

    await tx.done;
  }
}
