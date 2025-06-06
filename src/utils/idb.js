// utils/idb.js
const DB_NAME = 'TaskManagerDB';
const DB_VERSION = 1;
const STORE_NAME = 'tasks';

export async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject('Failed to open IndexedDB');

    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

export async function getAllTasks() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject('Failed to fetch tasks');
    transaction.oncomplete = () => db.close();
  });
}

export async function addTask(task) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(task);

    request.onsuccess = () => resolve(task);
    request.onerror = () => reject('Failed to add task');
    transaction.oncomplete = () => db.close();
  });
}

export async function updateTask(task) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(task);

    request.onsuccess = () => resolve(task);
    request.onerror = () => reject('Failed to update task');
    transaction.oncomplete = () => db.close();
  });
}

export async function deleteTask(taskId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(taskId);

    request.onsuccess = () => resolve();
    request.onerror = () => reject('Failed to delete task');
    transaction.oncomplete = () => db.close();
  });
}