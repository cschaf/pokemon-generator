const DB_NAME_INTERNAL = 'pokedexAppDB'; // Renamed to avoid conflict if DB_NAME is also global
const DB_VERSION_INTERNAL = 1; // Renamed
const POKEMON_STORE_NAME_INTERNAL = 'pokemonStore'; // Renamed

function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME_INTERNAL, DB_VERSION_INTERNAL);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(POKEMON_STORE_NAME_INTERNAL)) {
        db.createObjectStore(POKEMON_STORE_NAME_INTERNAL, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

function saveData(db, storeName, data) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(data);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

function loadData(db, storeName, key) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(key);

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

function clearData(db, storeName, key) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(key);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

// Expose functions and constants via a global object
window.indexedDBHelper = {
  DB_NAME: DB_NAME_INTERNAL,
  DB_VERSION: DB_VERSION_INTERNAL,
  POKEMON_STORE_NAME: POKEMON_STORE_NAME_INTERNAL,
  initDB: initDB,
  saveData: saveData,
  loadData: loadData,
  clearData: clearData
};
