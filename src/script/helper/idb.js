import idb from 'idb';

var dbPromise;
const openDb = () => {
  if (window.indexedDB) {
    dbPromise = idb.open("premiere", 1, function(upgradeDb) {
      if (!upgradeDb.objectStoreNames.contains("pined_match")) {
        const pinnedMatch = upgradeDb.createObjectStore("pined_match", { keyPath: 'id', autoIncrement: true });
        pinnedMatch.createIndex('id', 'id', { unique: true });
      }
      if (!upgradeDb.objectStoreNames.contains("favorite_clubs")) {
        const favoriteClub = upgradeDb.createObjectStore("favorite_clubs", { keyPath: 'id', autoIncrement: true });
        favoriteClub.createIndex('id', 'id', { unique: true });
      }
    });
  }
}

const _checkStoreName = (storeName) => {
  if (!storeName) throw Error('Please provide storeName');
  if (typeof storeName !== 'string') throw Error('storeName must be string');
}

const clearTable = async (storeName) => {
  if (dbPromise) {
    _checkStoreName(storeName);

    const db = await dbPromise;
    const store =  await db.transaction(storeName, 'readwrite').objectStore(storeName);
    await store.clear();
  }
}

const bulkUpsert = async (storeName, datas = [], key = 'id') => {
  if (dbPromise) {
    _checkStoreName(storeName);

    const db = await dbPromise;
    const store =  await db.transaction(storeName, 'readwrite').objectStore(storeName);

    if (datas.length > 0) {
      datas.forEach(async (data) => {
        const exist = await store.get(data[key]);
        if (exist) {
          data.createdAt = exist.createdAt;
          data.updatedAt = new Date();
          await store.put(data);
        } else {
          data.createdAt = new Date();
          data.updatedAt = null;
          await store.add(data);
        }
      })
    }

    return await store.complete;
  } else {
    return []
  }
}

const getAll = async (storeName) => {
  if (dbPromise) {
    _checkStoreName(storeName);

    const db = await dbPromise;
    const store = await db.transaction(storeName, 'readonly').objectStore(storeName);
    return await store.getAll();
  } else {
    return []
  }
}

const getByKey = async (storeName, key) => {
  if (dbPromise) {
    _checkStoreName(storeName);
    if (!key) throw Error('Please provide key');

    const db = await dbPromise;
    const store = await db.transaction(storeName, 'readonly').objectStore(storeName);
    const result = await store.get(key);
    return result;
  } else {
    return null
  }
}

const deleteById = async (storeName, id) => {
  if (dbPromise) {
    _checkStoreName(storeName);
    if (!id) throw Error('Please provide id');

    const db = await dbPromise;
    const store =  await db.transaction(storeName, 'readwrite').objectStore(storeName);
    await store.delete(id);
  } else {
    throw Error('Your database is not connected.');
  }
}

export {
  openDb,
  clearTable,
  bulkUpsert,
  getAll,
  getByKey,
  deleteById
}