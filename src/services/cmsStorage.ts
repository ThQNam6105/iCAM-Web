import type { Student } from '../data/studentData';
import type { Teacher } from '../data/teacherData';
import type { ParentTestimonial } from '../data/parentData';

const DB_NAME = 'icancam_app_db_v3';
const DB_VERSION = 2;

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
      if (!db.objectStoreNames.contains('parents')) {
        db.createObjectStore('parents', { keyPath: 'id' });
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

export const saveParentsIDB = async (parents: ParentTestimonial[]): Promise<void> => {
  try {
    const db = await getCMS_IDB();
    const tx = db.transaction('parents', 'readwrite');
    const store = tx.objectStore('parents');
    store.clear();
    for (const p of parents) {
      store.put(p);
    }
  } catch (err) {
    console.warn('IDB saveParents error:', err);
  }
};

export const getParentsIDB = async (): Promise<ParentTestimonial[]> => {
  try {
    const fetchPromise = new Promise<ParentTestimonial[]>((resolve) => {
      getCMS_IDB()
        .then((db) => {
          if (!db.objectStoreNames.contains('parents')) {
            resolve([]);
            return;
          }
          const tx = db.transaction('parents', 'readonly');
          const req = tx.objectStore('parents').getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => resolve([]);
        })
        .catch(() => resolve([]));
    });
    const timeoutPromise = new Promise<ParentTestimonial[]>((resolve) => setTimeout(() => resolve([]), 500));
    return await Promise.race([fetchPromise, timeoutPromise]);
  } catch {
    return [];
  }
};

export const compressBase64Image = (dataUrl: string, maxWidth = 350, maxHeight = 350, quality = 0.75): Promise<string> => {
  return new Promise((resolve) => {
    if (!dataUrl || !dataUrl.startsWith('data:image/') || dataUrl.length < 20000) {
      resolve(dataUrl);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      const compressed = canvas.toDataURL('image/jpeg', quality);
      resolve(compressed);
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
};
