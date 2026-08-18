import type { Student } from '../data/studentData';
import type { Teacher } from '../data/teacherData';

const DB_NAME = 'icancam_app_db_v3';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

export const getCMS_IDB = (): Promise<IDBDatabase> => {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB unavailable'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('students')) {
        db.createObjectStore('students', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('teachers')) {
        db.createObjectStore('teachers', { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return dbPromise;
};

export const saveStudentsIDB = async (students: Student[]): Promise<void> => {
  try {
    const db = await getCMS_IDB();
    const tx = db.transaction('students', 'readwrite');
    const store = tx.objectStore('students');
    store.clear();
    for (const s of students) {
      store.put(s);
    }
  } catch (err) {
    console.warn('IDB saveStudents error:', err);
  }
};

export const getStudentsIDB = async (): Promise<Student[]> => {
  try {
    const fetchPromise = new Promise<Student[]>((resolve) => {
      getCMS_IDB()
        .then((db) => {
          if (!db.objectStoreNames.contains('students')) {
            resolve([]);
            return;
          }
          const tx = db.transaction('students', 'readonly');
          const req = tx.objectStore('students').getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => resolve([]);
        })
        .catch(() => resolve([]));
    });
    const timeoutPromise = new Promise<Student[]>((resolve) => setTimeout(() => resolve([]), 500));
    return await Promise.race([fetchPromise, timeoutPromise]);
  } catch {
    return [];
  }
};

export const saveTeachersIDB = async (teachers: Teacher[]): Promise<void> => {
  try {
    const db = await getCMS_IDB();
    const tx = db.transaction('teachers', 'readwrite');
    const store = tx.objectStore('teachers');
    store.clear();
    for (const t of teachers) {
      store.put(t);
    }
  } catch (err) {
    console.warn('IDB saveTeachers error:', err);
  }
};

export const getTeachersIDB = async (): Promise<Teacher[]> => {
  try {
    const fetchPromise = new Promise<Teacher[]>((resolve) => {
      getCMS_IDB()
        .then((db) => {
          if (!db.objectStoreNames.contains('teachers')) {
            resolve([]);
            return;
          }
          const tx = db.transaction('teachers', 'readonly');
          const req = tx.objectStore('teachers').getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => resolve([]);
        })
        .catch(() => resolve([]));
    });
    const timeoutPromise = new Promise<Teacher[]>((resolve) => setTimeout(() => resolve([]), 500));
    return await Promise.race([fetchPromise, timeoutPromise]);
  } catch {
    return [];
  }
};
