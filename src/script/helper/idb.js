import idb from 'idb';

var dbPromise;
const openDb = () => {
  if (window.indexedDB) {
    dbPromise = idb.open("premiere", 1, function(upgradeDb) {
      if (!upgradeDb.objectStoreNames.contains("next_match")) {
        const nextMatch = upgradeDb.createObjectStore("next_match", { keyPath: 'id', autoIncrement: true });
        nextMatch.createIndex('id', 'id', { unique: true });
        nextMatch.createIndex('home', 'home', { unique: false });
        nextMatch.createIndex('away', 'away', { unique: false });
      }
      if (!upgradeDb.objectStoreNames.contains("line_up")) {
        const lineUp = upgradeDb.createObjectStore("line_up", { keyPath: 'id', autoIncrement: true });
        lineUp.createIndex('id', 'id', { unique: true });
      }
      if (!upgradeDb.objectStoreNames.contains("scheduled_match")) {
        const scheduledMatch = upgradeDb.createObjectStore("scheduled_match", { keyPath: 'id', autoIncrement: true });
        scheduledMatch.createIndex('id', 'id', { unique: true });
      }
      if (!upgradeDb.objectStoreNames.contains("finished_match")) {
        const finishedMatch = upgradeDb.createObjectStore("finished_match", { keyPath: 'id', autoIncrement: true });
        finishedMatch.createIndex('id', 'id', { unique: true });
      }
      if (!upgradeDb.objectStoreNames.contains("pined_match")) {
        const pinnedMatch = upgradeDb.createObjectStore("pined_match", { keyPath: 'id', autoIncrement: true });
        pinnedMatch.createIndex('id', 'id', { unique: true });
      }
      if (!upgradeDb.objectStoreNames.contains("favorite_clubs")) {
        const favoriteClub = upgradeDb.createObjectStore("favorite_clubs", { keyPath: 'id', autoIncrement: true });
        favoriteClub.createIndex('id', 'id', { unique: true });
      }
      if (!upgradeDb.objectStoreNames.contains("clubs")) {
        const clubs = upgradeDb.createObjectStore("clubs", { keyPath: 'id', autoIncrement: true });
        clubs.createIndex('id', 'id', { unique: true });
        clubs.createIndex('name', 'name', { unique: false });
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

const getData = async (fetchFromServer, saveData, storeName) => {
  if (!fetchFromServer) throw Error('Please provide fetch callbak');
  if (!saveData) throw Error('Please provide save callbak');
  _checkStoreName(storeName);

  if (!window.indexedDB) return await fetchFromServer();

  let localData = await getAll(storeName);
  // if the store is empty
  if (localData.length === 0) {
    const data = await fetchFromServer();
    saveData(data);
    return data;
  } else {
    const updated = await _updatedData(fetchFromServer, saveData);
    if (updated) localData = updated
  }
  return localData;
}

const _updatedData = async (fetchFromServer, saveData) => {
  const modulo2 = new Date().getMinutes() % 2;
  // update every 2 minutes
  if (navigator.onLine && modulo2 === 0) {
    const data = await fetchFromServer();
    saveData(data);
    return data;
  }
}

export {
  openDb,
  clearTable,
  bulkUpsert,
  getAll,
  getByKey,
  deleteById,
  getData
}