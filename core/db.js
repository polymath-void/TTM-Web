'use strict';

const DB_NAME = 'TTM_DB';
const DB_VERSION = 1;
const STORE_NAME = 'history';

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveHistory(entry) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    store.add(entry);

    const request = store.getAll();
    request.onsuccess = () => {
      const all = request.result;
      if (all.length > 10) {
        all.sort((a, b) => a.timestamp - b.timestamp);
        const toDelete = all.slice(0, all.length - 10);
        for (const item of toDelete) {
          store.delete(item.id);
        }
      }
    };

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function loadHistory() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const data = request.result.sort((a, b) => b.timestamp - a.timestamp);
      resolve(data);
    };
    request.onerror = () => reject(request.error);
  });
}
