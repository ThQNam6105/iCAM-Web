import { supabase } from '../supabaseClient';
import type { MediaItem, MediaUsage, MediaFolder, MediaFilter, EntityType } from '../../types/media';
import { getAllNewsPosts } from '../newsService';
import { getAllTeachers } from '../teacherService';
import { getAllStudents } from '../studentService';
import { getAllParents } from '../parentService';
import { getAllCareers } from '../careersService';
import { getAllCourses } from '../courseService';

// Helper to extract clean base image name for accurate URL matching (strips Vite build hashes, query params, etc.)
export const extractBaseImageName = (urlOrPath?: string): string => {
  if (!urlOrPath) return '';
  const clean = urlOrPath.split('?')[0].split('#')[0];
  const filename = clean.substring(clean.lastIndexOf('/') + 1);
  // Remove Vite build hashes (e.g. teacher_khoa-B5GIR_KI.png -> teacher_khoa.png)
  return filename.replace(/-[A-Za-z0-9_-]{8,}\./, '.').toLowerCase();
};

export const isImageMatch = (mediaItem: MediaItem, entityImageUrl?: string): boolean => {
  if (!entityImageUrl) return false;
  if (mediaItem.public_url === entityImageUrl || mediaItem.id === entityImageUrl) return true;

  const itemBase = extractBaseImageName(mediaItem.public_url) || extractBaseImageName(mediaItem.original_filename);
  const entityBase = extractBaseImageName(entityImageUrl);

  if (itemBase && entityBase && itemBase === entityBase) return true;
  return false;
};

export const getAllDynamicUsagesForMedia = (mediaItem: MediaItem): MediaUsage[] => {
  const dynamicUsages: MediaUsage[] = [];
  const registeredIds = new Set<string>();

  // 1. Scan News Posts
  try {
    const posts = getAllNewsPosts() || [];
    for (const post of posts) {
      let matched = isImageMatch(mediaItem, post.image) || isImageMatch(mediaItem, post.imageEn);

      // Also check content HTML for <img src="...">
      if (!matched && post.content) {
        const matches = post.content.match(/<img[^>]+src=["']([^"']+)["']/g);
        if (matches) {
          for (const m of matches) {
            const srcMatch = m.match(/src=["']([^"']+)["']/);
            if (srcMatch && isImageMatch(mediaItem, srcMatch[1])) {
              matched = true;
              break;
            }
          }
        }
      }

      if (matched) {
        const uId = `dyn_news_${post.id}`;
        if (!registeredIds.has(uId)) {
          registeredIds.add(uId);
          dynamicUsages.push({
            id: uId,
            media_id: mediaItem.id,
            entity_type: 'news',
            entity_id: String(post.id),
            entity_title: `[TIN TỨC] ${post.title}`,
            created_at: post.createdAt || new Date().toISOString(),
            updated_at: post.updatedAt || new Date().toISOString(),
          });
        }
      }
    }
  } catch {
    // Ignore
  }

  // 2. Scan Teachers
  try {
    const teachers = getAllTeachers() || [];
    for (const t of teachers) {
      if (isImageMatch(mediaItem, t.image)) {
        const uId = `dyn_teacher_${t.id}`;
        if (!registeredIds.has(uId)) {
          registeredIds.add(uId);
          dynamicUsages.push({
            id: uId,
            media_id: mediaItem.id,
            entity_type: 'teachers',
            entity_id: String(t.id),
            entity_title: `[GIÁO VIÊN] ${t.name}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
      }
    }
  } catch {
    // Ignore
  }

  // 3. Scan Students
  try {
    const students = getAllStudents() || [];
    for (const s of students) {
      if (isImageMatch(mediaItem, s.image)) {
        const uId = `dyn_student_${s.id}`;
        if (!registeredIds.has(uId)) {
          registeredIds.add(uId);
          dynamicUsages.push({
            id: uId,
            media_id: mediaItem.id,
            entity_type: 'homepage',
            entity_id: String(s.id),
            entity_title: `[HỌC VIÊN] ${s.name}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
      }
    }
  } catch {
    // Ignore
  }

  // 4. Scan Parents
  try {
    const parents = getAllParents() || [];
    for (const p of parents) {
      if (isImageMatch(mediaItem, p.image)) {
        const uId = `dyn_parent_${p.id}`;
        if (!registeredIds.has(uId)) {
          registeredIds.add(uId);
          dynamicUsages.push({
            id: uId,
            media_id: mediaItem.id,
            entity_type: 'homepage',
            entity_id: String(p.id),
            entity_title: `[PHỤ HUYNH] ${p.childName || p.id}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
      }
    }
  } catch {
    // Ignore
  }

  // 5. Scan Careers
  try {
    const careers = getAllCareers() || [];
    for (const c of careers) {
      if (isImageMatch(mediaItem, (c as any).image)) {
        const uId = `dyn_career_${c.id}`;
        if (!registeredIds.has(uId)) {
          registeredIds.add(uId);
          dynamicUsages.push({
            id: uId,
            media_id: mediaItem.id,
            entity_type: 'careers',
            entity_id: String(c.id),
            entity_title: `[TUYỂN DỤNG] ${c.title}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
      }
    }
  } catch {
    // Ignore
  }

  // 6. Scan Courses
  try {
    const courses = getAllCourses() || [];
    for (const c of courses) {
      if (isImageMatch(mediaItem, c.thumbnailUrl)) {
        const uId = `dyn_course_${c.id}`;
        if (!registeredIds.has(uId)) {
          registeredIds.add(uId);
          dynamicUsages.push({
            id: uId,
            media_id: mediaItem.id,
            entity_type: 'courses',
            entity_id: String(c.id),
            entity_title: `[KHÓA HỌC] ${c.titleVi}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
      }
    }
  } catch {
    // Ignore
  }

  // 7. Scan Homepage Static Sections (Key Achievements, Banners, Hero)
  const homepageStaticAssets: { filename: string; title: string; type: EntityType }[] = [
    { filename: 'achievement_teacher.png', title: '[TRANG CHỦ] Key Achievements - Đội ngũ giảng viên', type: 'homepage' },
    { filename: 'achievement_smartboard.png', title: '[TRANG CHỦ] Key Achievements - Công nghệ Smartboard', type: 'homepage' },
    { filename: 'achievement_school.png', title: '[TRANG CHỦ] Key Achievements - Cơ sở vật chất trung tâm', type: 'homepage' },
    { filename: 'banner-bg.jpg', title: '[TRANG CHỦ] Banner chính (Desktop)', type: 'homepage' },
    { filename: 'banner-bg-mobile.jpg', title: '[TRANG CHỦ] Banner chính (Mobile)', type: 'homepage' },
    { filename: 'en_banner-bg.jpg', title: '[TRANG CHỦ] Banner Tiếng Anh (Desktop)', type: 'homepage' },
    { filename: 'en_banner-bg-mobile.jpg', title: '[TRANG CHỦ] Banner Tiếng Anh (Mobile)', type: 'homepage' },
    { filename: 'hero.png', title: '[TRANG CHỦ] Hình ảnh Hero', type: 'homepage' },
    { filename: 'ican.png', title: '[TRANG CHỦ] Logo iCANCAM', type: 'homepage' },
    { filename: 'footer-logo.jpg', title: '[TRANG CHỦ] Logo chân trang', type: 'homepage' },
  ];

  for (const staticAsset of homepageStaticAssets) {
    if (isImageMatch(mediaItem, staticAsset.filename)) {
      const uId = `dyn_homepage_${staticAsset.filename}`;
      if (!registeredIds.has(uId)) {
        registeredIds.add(uId);
        dynamicUsages.push({
          id: uId,
          media_id: mediaItem.id,
          entity_type: staticAsset.type,
          entity_id: `static_${staticAsset.filename}`,
          entity_title: staticAsset.title,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    }
  }

  return dynamicUsages;
};

// Import asset images directly to guarantee clean resolution in Dev & Production builds
import bannerBg from '../../assets/banner-bg.jpg';
import bannerBgMobile from '../../assets/banner-bg-mobile.jpg';
import enBannerBg from '../../assets/en_banner-bg.jpg';
import enBannerBgMobile from '../../assets/en_banner-bg-mobile.jpg';

import footerLogo from '../../assets/footer-logo.jpg';
import heroImg from '../../assets/hero.png';
import icanLogo from '../../assets/ican.png';
import reactSvg from '../../assets/react.svg';
import viteSvg from '../../assets/vite.svg';

import newsArena from '../../assets/news_arena.png';
import newsLimit from '../../assets/news_limit.png';
import newsParenting from '../../assets/news_parenting.png';

import parent1 from '../../assets/parent_1.png';
import parent2 from '../../assets/parent_2.png';
import parent3 from '../../assets/parent_3.png';
import parent4 from '../../assets/parent_4.png';

import studentAn from '../../assets/student_an.png';
import studentHologram from '../../assets/student_hologram.png';
import studentHuy from '../../assets/student_huy.png';
import studentNam from '../../assets/student_nam.png';
import studentThu from '../../assets/student_thu.png';
import studentVy from '../../assets/student_vy.png';

import teacherDavid from '../../assets/teacher_david.png';
import teacherEmma from '../../assets/teacher_emma.png';
import teacherJames from '../../assets/teacher_james.png';
import teacherKhoa from '../../assets/teacher_khoa.png';
import teacherLoan from '../../assets/teacher_loan.png';
import teacherLucas from '../../assets/teacher_lucas.png';
import teacherNhat from '../../assets/teacher_nhat.png';
import teacherOliver from '../../assets/teacher_oliver.png';
import teacherPhuc from '../../assets/teacher_phuc.png';
import teacherSarah from '../../assets/teacher_sarah.png';
import teacherTho from '../../assets/teacher_tho.png';

import achievementSchool from '../../assets/achievement_school.png';
import achievementSmartboard from '../../assets/achievement_smartboard.png';
import achievementTeacher from '../../assets/achievement_teacher.png';

const PUBLIC_BUCKET = 'cms-public-media';
const PRIVATE_BUCKET = 'cms-private-media';
const LOCAL_STORAGE_KEY = 'ican_cms_media_items_v3';
const LOCAL_USAGE_KEY = 'ican_cms_media_usages_v3';
const LOCAL_FOLDER_KEY = 'ican_cms_media_folders_v3';
const LOCAL_DELETED_KEY = 'ican_cms_media_deleted_ids_v3';
const LOCAL_DELETED_FOLDERS_KEY = 'ican_cms_media_deleted_folders_v3';

const getDeletedFolderIds = (): Set<string> => {
  try {
    const raw = localStorage.getItem(LOCAL_DELETED_FOLDERS_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch {
    // Ignore
  }
  return new Set();
};

const saveDeletedFolderIds = (set: Set<string>) => {
  try {
    localStorage.setItem(LOCAL_DELETED_FOLDERS_KEY, JSON.stringify(Array.from(set)));
  } catch {
    // Ignore
  }
};

// In-Memory & IndexedDB Storage
const inMemoryItemsMap = new Map<string, MediaItem>();
let memoryDeletedIds = new Set<string>();

const getDeletedIds = (): Set<string> => {
  try {
    const raw = localStorage.getItem(LOCAL_DELETED_KEY);
    if (raw) {
      const arr: string[] = JSON.parse(raw);
      memoryDeletedIds = new Set(arr);
      return memoryDeletedIds;
    }
  } catch {
    // Ignore
  }
  return memoryDeletedIds;
};

const saveDeletedIds = (set: Set<string>) => {
  memoryDeletedIds = set;
  try {
    localStorage.setItem(LOCAL_DELETED_KEY, JSON.stringify(Array.from(set)));
  } catch {
    // Ignore
  }
};

// IndexedDB Helper for Large Uploaded Images (No 5MB LocalStorage Quota Limit)
const DB_NAME = 'ican_cms_media_idb_v3';
const DB_VERSION = 1;
let dbPromise: Promise<IDBDatabase> | null = null;

const getIDB = (): Promise<IDBDatabase> => {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB unavailable'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('media_items')) {
        db.createObjectStore('media_items', { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return dbPromise;
};

const saveItemToIDB = async (item: MediaItem) => {
  try {
    const db = await getIDB();
    const tx = db.transaction('media_items', 'readwrite');
    tx.objectStore('media_items').put(item);
  } catch {
    // Ignore
  }
};

const deleteItemFromIDB = async (id: string) => {
  try {
    const db = await getIDB();
    const tx = db.transaction('media_items', 'readwrite');
    tx.objectStore('media_items').delete(id);
  } catch {
    // Ignore
  }
};

const getItemsFromIDB = async (): Promise<MediaItem[]> => {
  try {
    const db = await getIDB();
    return new Promise((resolve) => {
      const tx = db.transaction('media_items', 'readonly');
      const req = tx.objectStore('media_items').getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
};

// Persistence fallback & Cache Auto-Sync
const getStoredItems = (): MediaItem[] => {
  const deletedSet = getDeletedIds();
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed: MediaItem[] = JSON.parse(raw);
      const merged = parsed.filter((m) => !deletedSet.has(m.id));

      for (const defItem of DEFAULT_INITIAL_MEDIA) {
        if (deletedSet.has(defItem.id)) continue;
        const idx = merged.findIndex((m) => m.id === defItem.id || m.original_filename === defItem.original_filename);
        if (idx === -1) {
          merged.push(defItem);
        }
      }

      // Also merge in-memory items
      for (const item of inMemoryItemsMap.values()) {
        if (!deletedSet.has(item.id) && !merged.some((m) => m.id === item.id)) {
          merged.unshift(item);
        }
      }

      return merged;
    }
  } catch {
    // Ignore
  }

  // Populate memory map from initial
  const initialFiltered = DEFAULT_INITIAL_MEDIA.filter((defItem) => !deletedSet.has(defItem.id));
  for (const item of inMemoryItemsMap.values()) {
    if (!deletedSet.has(item.id) && !initialFiltered.some((m) => m.id === item.id)) {
      initialFiltered.unshift(item);
    }
  }
  return initialFiltered;
};

const saveStoredItems = (items: MediaItem[]) => {
  try {
    const deletedSet = getDeletedIds();
    const cleanItems = items.filter((i) => !deletedSet.has(i.id));
    for (const item of cleanItems) {
      inMemoryItemsMap.set(item.id, item);
      saveItemToIDB(item);
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cleanItems));
  } catch {
    // Catch QuotaExceededError when Base64 URL is large, inMemory & IndexedDB will keep the item safe
  }
};

const getStoredUsages = (): MediaUsage[] => {
  try {
    const raw = localStorage.getItem(LOCAL_USAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore
  }
  return DEFAULT_INITIAL_USAGES;
};

const saveStoredUsages = (usages: MediaUsage[]) => {
  try {
    localStorage.setItem(LOCAL_USAGE_KEY, JSON.stringify(usages));
  } catch {
    // Ignore
  }
};

const getStoredFolders = (): MediaFolder[] => {
  const deletedSet = getDeletedFolderIds();
  try {
    const raw = localStorage.getItem(LOCAL_FOLDER_KEY);
    if (raw) {
      const parsed: MediaFolder[] = JSON.parse(raw);
      const filtered = parsed.filter((f) => !deletedSet.has(f.id));
      const missing = DEFAULT_INITIAL_FOLDERS.filter((df) => !deletedSet.has(df.id) && !filtered.some((pf) => pf.id === df.id));
      if (missing.length > 0) {
        const merged = [...filtered, ...missing];
        saveStoredFolders(merged);
        return merged;
      }
      return filtered;
    }
  } catch {
    // Ignore
  }
  return DEFAULT_INITIAL_FOLDERS.filter((df) => !deletedSet.has(df.id));
};

const saveStoredFolders = (folders: MediaFolder[]) => {
  try {
    localStorage.setItem(LOCAL_FOLDER_KEY, JSON.stringify(folders));
  } catch {
    // Ignore
  }
};

export class MediaRepository {
  /**
   * Fetch all folders with item count
   */
  async getFolders(): Promise<MediaFolder[]> {
    const deletedSet = getDeletedFolderIds();
    const localFolders = getStoredFolders();
    let folders = [...localFolders];
    try {
      const { data, error } = await supabase.from('media_folders').select('*').order('created_at', { ascending: true });
      if (!error && data && data.length > 0) {
        const supabaseFolders = (data as MediaFolder[]).filter((f) => !deletedSet.has(f.id));
        const folderMap = new Map<string, MediaFolder>();
        for (const f of supabaseFolders) {
          folderMap.set(f.id, f);
        }
        for (const f of localFolders) {
          if (!folderMap.has(f.id)) {
            folderMap.set(f.id, f);
          }
        }
        folders = Array.from(folderMap.values());
        saveStoredFolders(folders);
      } else {
        const validInitial = DEFAULT_INITIAL_FOLDERS.filter((f) => !deletedSet.has(f.id));
        if (validInitial.length > 0) {
          await supabase.from('media_folders').upsert(validInitial);
        }
      }
    } catch {
      // Fallback
    }

    const items = getStoredItems();
    return folders.filter((f) => !deletedSet.has(f.id)).map((f) => {
      const count = items.filter((i) => i.folder_id === f.id && i.status !== 'archived').length;
      return { ...f, item_count: count };
    });
  }

  /**
   * Create a new media folder
   */
  async createFolder(name: string, color = '#F58220', parentId?: string | null): Promise<MediaFolder> {
    const folders = getStoredFolders();
    const now = new Date().toISOString();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newFolder: MediaFolder = {
      id: `folder_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      name,
      slug,
      color,
      parent_id: parentId || null,
      created_at: now,
      updated_at: now,
      item_count: 0,
    };

    const deletedSet = getDeletedFolderIds();
    if (deletedSet.has(newFolder.id)) {
      deletedSet.delete(newFolder.id);
      saveDeletedFolderIds(deletedSet);
    }

    folders.push(newFolder);
    saveStoredFolders(folders);

    try {
      await supabase.from('media_folders').insert(newFolder);
    } catch {
      // Ignore
    }

    return newFolder;
  }

  /**
   * Rename an existing media folder
   */
  async renameFolder(id: string, newName: string, newColor?: string): Promise<MediaFolder> {
    const folders = getStoredFolders();
    const folder = folders.find((f) => f.id === id);
    if (!folder) {
      throw new Error(`Folder with ID ${id} not found.`);
    }

    folder.name = newName;
    folder.slug = newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (newColor) folder.color = newColor;
    folder.updated_at = new Date().toISOString();

    saveStoredFolders(folders);

    try {
      await supabase.from('media_folders').update(folder).eq('id', id);
    } catch {
      // Ignore
    }

    return folder;
  }

  /**
   * Delete a media folder (unassigns contained items back to root)
   */
  async deleteFolder(id: string): Promise<void> {
    const deletedSet = getDeletedFolderIds();
    deletedSet.add(id);
    saveDeletedFolderIds(deletedSet);

    const folders = getStoredFolders();
    const filteredFolders = folders.filter((f) => f.id !== id);
    saveStoredFolders(filteredFolders);

    // Unassign folder_id from items in this folder
    const items = getStoredItems();
    let updated = false;
    items.forEach((item) => {
      if (item.folder_id === id) {
        item.folder_id = null;
        updated = true;
      }
    });
    if (updated) saveStoredItems(items);

    try {
      await supabase.from('media_folders').delete().eq('id', id);
      await supabase.from('media_items').update({ folder_id: null }).eq('folder_id', id);
    } catch {
      // Ignore
    }
  }

  /**
   * Move one or multiple media assets to a specified folder
   */
  async moveItemsToFolder(itemIds: string[], folderId: string | null): Promise<void> {
    const items = getStoredItems();
    const now = new Date().toISOString();
    items.forEach((item) => {
      if (itemIds.includes(item.id)) {
        item.folder_id = folderId;
        item.updated_at = now;
      }
    });
    saveStoredItems(items);

    try {
      await supabase.from('media_items').update({ folder_id: folderId }).in('id', itemIds);
    } catch {
      // Ignore
    }
  }

  /**
   * Search for an existing asset by SHA-256 content hash (Deduplication)
   */
  async findByContentHash(hash: string): Promise<MediaItem | null> {
    try {
      const { data, error } = await supabase
        .from('media_items')
        .select('*')
        .eq('content_hash', hash)
        .neq('status', 'archived')
        .maybeSingle();

      if (!error && data) {
        return data as MediaItem;
      }
    } catch {
      // Supabase table not created yet or offline
    }

    const items = getStoredItems();
    return items.find((item) => item.content_hash === hash && item.status !== 'archived') || null;
  }

  /**
   * Upload physical file to Supabase Storage
   */
  async uploadFileToStorage(
    file: Blob | File,
    filename: string,
    isPrivate = false
  ): Promise<{ storagePath: string; publicUrl: string }> {
    const bucket = isPrivate ? PRIVATE_BUCKET : PUBLIC_BUCKET;
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const safeName = filename.toLowerCase().replace(/[^a-z0-9._-]/g, '_');
    const storagePath = `uploads/${year}/${month}/${Date.now()}_${safeName}`;

    try {
      const { error } = await supabase.storage.from(bucket).upload(storagePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

      if (!error) {
        const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(storagePath);
        return {
          storagePath,
          publicUrl: publicUrlData.publicUrl,
        };
      }
    } catch {
      // Fallback
    }

    // Fallback URL generation: Convert file to persistent Base64 Data URL so it never expires
    const base64Url = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(URL.createObjectURL(file instanceof File ? file : new File([file], filename)));
      reader.readAsDataURL(file);
    });

    return {
      storagePath,
      publicUrl: base64Url,
    };
  }

  /**
   * Save media asset metadata record to DB and LocalStorage
   */
  async saveMediaRecord(item: MediaItem): Promise<MediaItem> {
    const deletedSet = getDeletedIds();
    if (deletedSet.has(item.id)) {
      deletedSet.delete(item.id);
      saveDeletedIds(deletedSet);
    }
    inMemoryItemsMap.set(item.id, item);
    saveItemToIDB(item);

    try {
      const { data, error } = await supabase.from('media_items').upsert(item).select().single();

      if (!error && data) {
        return data as MediaItem;
      }
    } catch {
      // Fallback
    }

    const items = getStoredItems();
    const idx = items.findIndex((i) => i.id === item.id);
    if (idx >= 0) {
      items[idx] = { ...item, updated_at: new Date().toISOString() };
    } else {
      items.unshift(item);
    }
    saveStoredItems(items);
    return item;
  }

  /**
   * Update media metadata by ID
   */
  async updateMediaMetadata(id: string, updates: Partial<MediaItem>): Promise<MediaItem> {
    const items = getStoredItems();
    const item = items.find((i) => i.id === id);
    if (!item) throw new Error(`MediaItem with ID ${id} not found.`);
    Object.assign(item, updates, { updated_at: new Date().toISOString() });
    saveStoredItems(items);

    try {
      await supabase.from('media_items').update(updates).eq('id', id);
    } catch {
      // Fallback
    }
    return item;
  }

  /**
   * Fetch media assets with filtering, debounced search, tags, folders, and pagination
   */
  async getMediaItems(filter: MediaFilter = {}): Promise<{ items: MediaItem[]; total: number }> {
    const localItems = getStoredItems();
    const idbItems = await getItemsFromIDB();
    let items = [...localItems];
    for (const item of idbItems) {
      if (!items.some((i) => i.id === item.id)) {
        items.unshift(item);
      }
    }

    try {
      const { data, error } = await supabase.from('media_items').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        const supabaseItems = data as MediaItem[];
        const itemMap = new Map<string, MediaItem>();

        for (const item of supabaseItems) {
          itemMap.set(item.id, item);
        }

        for (const item of localItems) {
          if (!itemMap.has(item.id)) {
            itemMap.set(item.id, item);
          } else {
            const existing = itemMap.get(item.id)!;
            if (new Date(item.updated_at).getTime() >= new Date(existing.updated_at).getTime()) {
              itemMap.set(item.id, item);
            }
          }
        }
        items = Array.from(itemMap.values());
        saveStoredItems(items);
      } else {
        // Sync default initial media items to Supabase
        await supabase.from('media_items').upsert(DEFAULT_INITIAL_MEDIA);
      }
    } catch {
      // Fallback to local cache
    }

    const usages = getStoredUsages();

    // Attach current 100% accurate real-time usage count across all CMS modules
    items = items.map((item) => {
      const dynamicUsages = getAllDynamicUsagesForMedia(item);
      const manualUsages = usages.filter((u) => u.media_id === item.id);
      const combinedCount = new Set([
        ...dynamicUsages.map((u) => `${u.entity_type}_${u.entity_id}`),
        ...manualUsages.map((u) => `${u.entity_type}_${u.entity_id}`),
      ]).size;

      return { ...item, usage_count: combinedCount };
    });

    // Apply Filter & Search
    if (filter.searchQuery) {
      const q = filter.searchQuery.toLowerCase().trim();
      items = items.filter(
        (i) =>
          i.original_filename.toLowerCase().includes(q) ||
          i.default_alt_vi?.toLowerCase().includes(q) ||
          i.default_alt_en?.toLowerCase().includes(q) ||
          i.default_caption?.toLowerCase().includes(q) ||
          i.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (filter.fileType && filter.fileType !== 'all') {
      if (filter.fileType === 'image') {
        items = items.filter((i) => i.mime_type.startsWith('image/') && !i.mime_type.includes('svg') && !i.mime_type.includes('gif'));
      } else if (filter.fileType === 'svg') {
        items = items.filter((i) => i.mime_type.includes('svg'));
      } else if (filter.fileType === 'gif') {
        items = items.filter((i) => i.mime_type.includes('gif'));
      } else if (filter.fileType === 'pdf' || filter.fileType === 'doc') {
        items = items.filter((i) =>
          i.mime_type.includes('pdf') ||
          i.mime_type.includes('word') ||
          i.mime_type.includes('document') ||
          i.mime_type.includes('excel') ||
          i.mime_type.includes('powerpoint') ||
          i.original_filename.endsWith('.doc') ||
          i.original_filename.endsWith('.docx') ||
          i.original_filename.endsWith('.xls') ||
          i.original_filename.endsWith('.xlsx') ||
          i.original_filename.endsWith('.pdf')
        );
      }
    }

    if (filter.categoryTag && filter.categoryTag !== 'all') {
      items = items.filter((i) => i.tags?.includes(filter.categoryTag!));
    }

    if (filter.folderId && filter.folderId !== 'all') {
      if (filter.folderId === 'root') {
        items = items.filter((i) => !i.folder_id);
      } else {
        items = items.filter((i) => i.folder_id === filter.folderId);
      }
    }

    if (filter.usageStatus && filter.usageStatus !== 'all') {
      if (filter.usageStatus === 'used') {
        items = items.filter((i) => (i.usage_count || 0) > 0);
      } else if (filter.usageStatus === 'unused') {
        items = items.filter((i) => (i.usage_count || 0) === 0);
      } else if (filter.usageStatus === 'archived') {
        items = items.filter((i) => i.status === 'archived');
      }
    }

    // Sort items
    if (filter.sortBy) {
      switch (filter.sortBy) {
        case 'newest':
          items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          break;
        case 'oldest':
          items.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
          break;
        case 'name-asc':
          items.sort((a, b) => a.original_filename.localeCompare(b.original_filename));
          break;
        case 'name-desc':
          items.sort((a, b) => b.original_filename.localeCompare(a.original_filename));
          break;
        case 'size-desc':
          items.sort((a, b) => b.file_size - a.file_size);
          break;
        case 'size-asc':
          items.sort((a, b) => a.file_size - b.file_size);
          break;
      }
    }

    const deletedSet = getDeletedIds();
    items = items.filter((i) => !deletedSet.has(i.id));

    const total = items.length;
    const page = filter.page || 1;
    const pageSize = filter.limit || (filter as { pageSize?: number }).pageSize || 100;
    const startIndex = (page - 1) * pageSize;
    const paginatedItems = items.slice(startIndex, startIndex + pageSize);

    return { items: paginatedItems, total };
  }

  /**
   * Delete media asset record permanently
   */
  async deleteMediaItem(id: string): Promise<void> {
    const deletedSet = getDeletedIds();
    deletedSet.add(id);
    saveDeletedIds(deletedSet);

    inMemoryItemsMap.delete(id);
    deleteItemFromIDB(id);

    const items = getStoredItems();
    const filtered = items.filter((i) => i.id !== id);
    saveStoredItems(filtered);

    const usages = getStoredUsages();
    const filteredUsages = usages.filter((u) => u.media_id !== id);
    saveStoredUsages(filteredUsages);

    try {
      await supabase.from('media_items').delete().eq('id', id);
      await supabase.from('media_usages').delete().eq('media_id', id);
    } catch {
      // Ignore
    }
  }

  /**
   * Hard Delete with Usage Protection (supports force delete)
   */
  async hardDeleteMediaItem(id: string, force: boolean = true): Promise<{ success: boolean; error?: string }> {
    const usages = await this.getMediaUsages(id);
    if (usages.length > 0 && !force) {
      return {
        success: false,
        error: `Tệp này đang được sử dụng ở ${usages.length} vị trí! Không thể xóa vĩnh viễn cho đến khi gỡ liên kết.`,
      };
    }
    await this.deleteMediaItem(id);
    return { success: true };
  }

  /**
   * Move item to archive status
   */
  async archiveMediaItem(id: string): Promise<void> {
    const items = getStoredItems();
    const item = items.find((i) => i.id === id);
    if (item) {
      item.status = 'archived';
      item.updated_at = new Date().toISOString();
      saveStoredItems(items);
    }

    try {
      await supabase.from('media_items').update({ status: 'archived' }).eq('id', id);
    } catch {
      // Ignore
    }
  }

  /**
   * Get usages history for a specific media item (combining dynamic & manual usages)
   */
  async getMediaUsages(mediaId: string): Promise<MediaUsage[]> {
    const items = getStoredItems();
    const targetItem = items.find((i) => i.id === mediaId);

    const manualUsages = getStoredUsages().filter((u) => u.media_id === mediaId);
    let dynamicUsages: MediaUsage[] = [];

    if (targetItem) {
      dynamicUsages = getAllDynamicUsagesForMedia(targetItem);
    }

    const usageMap = new Map<string, MediaUsage>();
    for (const u of dynamicUsages) {
      usageMap.set(`${u.entity_type}_${u.entity_id}`, u);
    }
    for (const u of manualUsages) {
      if (!usageMap.has(`${u.entity_type}_${u.entity_id}`)) {
        usageMap.set(`${u.entity_type}_${u.entity_id}`, u);
      }
    }

    return Array.from(usageMap.values());
  }

  /**
   * Register usage in a module
   */
  async registerUsage(
    mediaId: string,
    entityType: EntityType,
    entityId: string,
    entityTitle: string,
    altVi?: string,
    altEn?: string,
    caption?: string,
    focalX?: number,
    focalY?: number
  ): Promise<MediaUsage> {
    const usages = getStoredUsages();
    const newUsage: MediaUsage = {
      id: `usage_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      media_id: mediaId,
      entity_type: entityType,
      entity_id: entityId,
      entity_title: entityTitle,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    usages.push(newUsage);
    saveStoredUsages(usages);

    if (altVi || altEn || caption || focalX !== undefined || focalY !== undefined) {
      await this.updateMediaMetadata(mediaId, {
        ...(altVi && { default_alt_vi: altVi }),
        ...(altEn && { default_alt_en: altEn }),
        ...(caption && { default_caption: caption }),
        ...(focalX !== undefined && { focal_x: focalX }),
        ...(focalY !== undefined && { focal_y: focalY }),
      });
    }

    try {
      await supabase.from('media_usages').insert(newUsage);
    } catch {
      // Ignore
    }

    return newUsage;
  }

  /**
   * Unregister usage
   */
  async unregisterUsage(mediaId: string, entityType: EntityType, entityId: string): Promise<void> {
    const usages = getStoredUsages();
    const filtered = usages.filter((u) => !(u.media_id === mediaId && u.entity_type === entityType && u.entity_id === entityId));
    saveStoredUsages(filtered);

    try {
      await supabase.from('media_usages').delete().eq('media_id', mediaId).eq('entity_type', entityType).eq('entity_id', entityId);
    } catch {
      // Ignore
    }
  }

  /**
   * Unregister all usages for a deleted entity
   */
  async unregisterUsageByEntity(entityType: string, entityId: string): Promise<void> {
    const usages = getStoredUsages();
    const cleanEntityId = String(entityId).replace('post_', '').replace('default_', '');
    const filtered = usages.filter((u) => {
      if (String(u.entity_type).toLowerCase() !== String(entityType).toLowerCase()) return true;
      const cleanUId = String(u.entity_id).replace('post_', '').replace('default_', '');
      return String(u.entity_id) !== String(entityId) && cleanUId !== cleanEntityId;
    });
    saveStoredUsages(filtered);

    try {
      await supabase.from('media_usages').delete().eq('entity_type', entityType).eq('entity_id', entityId);
    } catch {
      // Ignore
    }
  }
}

export const mediaRepository = new MediaRepository();

// Standardized System Media Folders
const DEFAULT_INITIAL_FOLDERS: MediaFolder[] = [
  {
    id: 'folder_homepage',
    name: 'Banner Trang Chủ',
    slug: 'banner-trang-chu',
    color: '#10b981',
    created_at: '2026-08-01T10:00:00Z',
    updated_at: '2026-08-01T10:00:00Z',
  },
  {
    id: 'folder_branding',
    name: 'Logo & Nhãn Hiệu',
    slug: 'logo-nhan-hieu',
    color: '#8b5cf6',
    created_at: '2026-08-01T10:00:00Z',
    updated_at: '2026-08-01T10:00:00Z',
  },
  {
    id: 'folder_teachers',
    name: 'Đội Ngũ Giáo Viên',
    slug: 'doi-ngu-giao-vien',
    color: '#3b82f6',
    created_at: '2026-08-01T10:00:00Z',
    updated_at: '2026-08-01T10:00:00Z',
  },
  {
    id: 'folder_students',
    name: 'Học Viên & Lớp Học',
    slug: 'hoc-vien-lop-hoc',
    color: '#ec4899',
    created_at: '2026-08-01T10:00:00Z',
    updated_at: '2026-08-01T10:00:00Z',
  },
  {
    id: 'folder_parents',
    name: 'Phụ Huynh & Đánh Giá',
    slug: 'phu-huynh-danh-gia',
    color: '#f59e0b',
    created_at: '2026-08-01T10:00:00Z',
    updated_at: '2026-08-01T10:00:00Z',
  },
  {
    id: 'folder_achievements',
    name: 'Thành Tích & Trường Học',
    slug: 'thanh-tich-truong-hoc',
    color: '#06b6d4',
    created_at: '2026-08-01T10:00:00Z',
    updated_at: '2026-08-01T10:00:00Z',
  },
  {
    id: 'folder_news',
    name: 'Bài Viết & Tin Tức',
    slug: 'bai-viet-tin-tuc',
    color: '#F58220',
    created_at: '2026-08-01T10:00:00Z',
    updated_at: '2026-08-01T10:00:00Z',
  },
];

// Pre-populated default catalog mapping all 36 assets in src/assets
const DEFAULT_INITIAL_MEDIA: MediaItem[] = [
  // 1. Banner Trang Chủ
  {
    id: 'asset_banner_bg',
    original_filename: 'banner-bg.jpg',
    storage_path: 'assets/banner-bg.jpg',
    public_url: bannerBg,
    mime_type: 'image/jpeg',
    file_size: 1939991,
    width: 1920,
    height: 1080,
    content_hash: 'hash_banner_bg_001',
    status: 'active',
    default_alt_vi: 'Banner chính trang chủ iCANCAM',
    default_alt_en: 'Main homepage banner iCANCAM',
    default_caption: 'Không gian học tập chuẩn quốc tế tại Hóc Môn & Quận 12',
    focal_x: 0.5,
    focal_y: 0.5,
    tags: ['banner', 'homepage', 'desktop'],
    folder_id: 'folder_homepage',
    created_at: '2026-08-01T10:00:00Z',
    updated_at: '2026-08-01T10:00:00Z',
    usage_count: 2,
  },
  {
    id: 'asset_banner_bg_mobile',
    original_filename: 'banner-bg-mobile.jpg',
    storage_path: 'assets/banner-bg-mobile.jpg',
    public_url: bannerBgMobile,
    mime_type: 'image/jpeg',
    file_size: 145204,
    width: 768,
    height: 1024,
    content_hash: 'hash_banner_bg_mobile_002',
    status: 'active',
    default_alt_vi: 'Banner mobile trang chủ iCANCAM',
    default_alt_en: 'Mobile homepage banner iCANCAM',
    default_caption: 'Banner tối ưu cho giao diện di động',
    folder_id: 'folder_homepage',
    created_at: '2026-08-01T10:00:00Z',
    updated_at: '2026-08-01T10:00:00Z',
    usage_count: 1,
  },
  {
    id: 'asset_en_banner_bg',
    original_filename: 'en_banner-bg.jpg',
    storage_path: 'assets/en_banner-bg.jpg',
    public_url: enBannerBg,
    mime_type: 'image/jpeg',
    file_size: 1998048,
    width: 1920,
    height: 1080,
    content_hash: 'hash_en_banner_bg_003',
    status: 'active',
    default_alt_vi: 'Banner tiếng Anh trang chủ PC',
    default_alt_en: 'English homepage banner PC',
    folder_id: 'folder_homepage',
    created_at: '2026-08-01T10:00:00Z',
    updated_at: '2026-08-01T10:00:00Z',
    usage_count: 1,
  },
  {
    id: 'asset_en_banner_bg_mobile',
    original_filename: 'en_banner-bg-mobile.jpg',
    storage_path: 'assets/en_banner-bg-mobile.jpg',
    public_url: enBannerBgMobile,
    mime_type: 'image/jpeg',
    file_size: 1901302,
    width: 768,
    height: 1024,
    content_hash: 'hash_en_banner_bg_mobile_004',
    status: 'active',
    default_alt_vi: 'Banner tiếng Anh trang chủ Mobile',
    default_alt_en: 'English homepage banner Mobile',
    folder_id: 'folder_homepage',
    created_at: '2026-08-01T10:00:00Z',
    updated_at: '2026-08-01T10:00:00Z',
    usage_count: 1,
  },

  // 2. Logo & Nhãn Hiệu
  {
    id: 'asset_favicon_ico',
    original_filename: 'favicon.ico',
    storage_path: 'public/favicon.ico',
    public_url: '/favicon.ico',
    mime_type: 'image/x-icon',
    file_size: 4286,
    width: 64,
    height: 64,
    content_hash: 'hash_favicon_ico_000',
    status: 'active',
    default_alt_vi: 'Biểu tượng Favicon iCANCAM (.ico)',
    default_alt_en: 'Official iCANCAM Favicon icon (.ico)',
    folder_id: 'folder_branding',
    created_at: '2026-08-01T10:00:00Z',
    updated_at: '2026-08-01T10:00:00Z',
    usage_count: 1,
  },
  {
    id: 'asset_ican_logo',
    original_filename: 'ican.png',
    storage_path: 'assets/ican.png',
    public_url: icanLogo,
    mime_type: 'image/png',
    file_size: 116142,
    width: 500,
    height: 200,
    content_hash: 'hash_ican_logo_005',
    status: 'active',
    default_alt_vi: 'Logo iCANCAM chính thức',
    default_alt_en: 'Official iCANCAM logo',
    folder_id: 'folder_branding',
    created_at: '2026-08-01T10:00:00Z',
    updated_at: '2026-08-01T10:00:00Z',
    usage_count: 3,
  },
  {
    id: 'asset_footer_logo',
    original_filename: 'footer-logo.jpg',
    storage_path: 'assets/footer-logo.jpg',
    public_url: footerLogo,
    mime_type: 'image/jpeg',
    file_size: 100327,
    width: 400,
    height: 150,
    content_hash: 'hash_footer_logo_006',
    status: 'active',
    default_alt_vi: 'Logo footer iCANCAM',
    default_alt_en: 'iCANCAM footer logo',
    folder_id: 'folder_branding',
    created_at: '2026-08-01T10:00:00Z',
    updated_at: '2026-08-01T10:00:00Z',
    usage_count: 2,
  },
  {
    id: 'asset_hero_img',
    original_filename: 'hero.png',
    storage_path: 'assets/hero.png',
    public_url: heroImg,
    mime_type: 'image/png',
    file_size: 13057,
    width: 300,
    height: 300,
    content_hash: 'hash_hero_img_007',
    status: 'active',
    default_alt_vi: 'Biểu tượng Hero iCANCAM',
    default_alt_en: 'iCANCAM hero icon',
    folder_id: 'folder_branding',
    created_at: '2026-08-01T10:00:00Z',
    updated_at: '2026-08-01T10:00:00Z',
    usage_count: 1,
  },
  {
    id: 'asset_react_svg',
    original_filename: 'react.svg',
    storage_path: 'assets/react.svg',
    public_url: reactSvg,
    mime_type: 'image/svg+xml',
    file_size: 4126,
    width: 100,
    height: 100,
    content_hash: 'hash_react_svg_008',
    status: 'active',
    default_alt_vi: 'Biểu tượng React',
    default_alt_en: 'React SVG icon',
    folder_id: 'folder_branding',
    created_at: '2026-08-01T10:00:00Z',
    updated_at: '2026-08-01T10:00:00Z',
    usage_count: 1,
  },
  {
    id: 'asset_vite_svg',
    original_filename: 'vite.svg',
    storage_path: 'assets/vite.svg',
    public_url: viteSvg,
    mime_type: 'image/svg+xml',
    file_size: 8709,
    width: 100,
    height: 100,
    content_hash: 'hash_vite_svg_009',
    status: 'active',
    default_alt_vi: 'Biểu tượng Vite',
    default_alt_en: 'Vite SVG icon',
    folder_id: 'folder_branding',
    created_at: '2026-08-01T10:00:00Z',
    updated_at: '2026-08-01T10:00:00Z',
    usage_count: 1,
  },

  // 3. Đội Ngũ Giáo Viên
  {
    id: 'asset_teacher_david',
    original_filename: 'teacher_david.png',
    storage_path: 'assets/teacher_david.png',
    public_url: teacherDavid,
    mime_type: 'image/png',
    file_size: 628115,
    width: 800,
    height: 800,
    content_hash: 'hash_teacher_david_010',
    status: 'active',
    default_alt_vi: 'Thầy David - Chuyên gia Luyện thi IELTS',
    default_alt_en: 'Mr. David - IELTS Specialist',
    folder_id: 'folder_teachers',
    created_at: '2026-08-02T10:00:00Z',
    updated_at: '2026-08-02T10:00:00Z',
    usage_count: 1,
  },
  {
    id: 'asset_teacher_emma',
    original_filename: 'teacher_emma.png',
    storage_path: 'assets/teacher_emma.png',
    public_url: teacherEmma,
    mime_type: 'image/png',
    file_size: 603631,
    width: 800,
    height: 800,
    content_hash: 'hash_teacher_emma_011',
    status: 'active',
    default_alt_vi: 'Cô Emma - Giảng viên Anh văn Trẻ em',
    default_alt_en: 'Ms. Emma - Young Learners Instructor',
    folder_id: 'folder_teachers',
    created_at: '2026-08-02T10:00:00Z',
    updated_at: '2026-08-02T10:00:00Z',
    usage_count: 1,
  },
  {
    id: 'asset_teacher_james',
    original_filename: 'teacher_james.png',
    storage_path: 'assets/teacher_james.png',
    public_url: teacherJames,
    mime_type: 'image/png',
    file_size: 603825,
    width: 800,
    height: 800,
    content_hash: 'hash_teacher_james_012',
    status: 'active',
    default_alt_vi: 'Thầy James - Giảng viên Tiếng Anh Giao Tiếp',
    default_alt_en: 'Mr. James - Communication English Teacher',
    folder_id: 'folder_teachers',
    created_at: '2026-08-02T10:00:00Z',
    updated_at: '2026-08-02T10:00:00Z',
    usage_count: 1,
  },
  {
    id: 'asset_teacher_khoa',
    original_filename: 'teacher_khoa.png',
    storage_path: 'assets/teacher_khoa.png',
    public_url: teacherKhoa,
    mime_type: 'image/png',
    file_size: 544351,
    width: 800,
    height: 800,
    content_hash: 'hash_teacher_khoa_013',
    status: 'active',
    default_alt_vi: 'Thầy Đăng Khoa - Cố vấn Đào tạo iCANCAM',
    default_alt_en: 'Mr. Dang Khoa - Academic Advisor',
    folder_id: 'folder_teachers',
    created_at: '2026-08-02T10:00:00Z',
    updated_at: '2026-08-02T10:00:00Z',
    usage_count: 1,
  },
  {
    id: 'asset_teacher_loan',
    original_filename: 'teacher_loan.png',
    storage_path: 'assets/teacher_loan.png',
    public_url: teacherLoan,
    mime_type: 'image/png',
    file_size: 589598,
    width: 800,
    height: 800,
    content_hash: 'hash_teacher_loan_014',
    status: 'active',
    default_alt_vi: 'Cô Phương Loan - Giảng viên Tiếng Anh Tiểu học',
    default_alt_en: 'Ms. Phuong Loan - Primary School Teacher',
    folder_id: 'folder_teachers',
    created_at: '2026-08-02T10:00:00Z',
    updated_at: '2026-08-02T10:00:00Z',
    usage_count: 1,
  },
  {
    id: 'asset_teacher_lucas',
    original_filename: 'teacher_lucas.png',
    storage_path: 'assets/teacher_lucas.png',
    public_url: teacherLucas,
    mime_type: 'image/png',
    file_size: 745326,
    width: 800,
    height: 800,
    content_hash: 'hash_teacher_lucas_015',
    status: 'active',
    default_alt_vi: 'Thầy Lucas - Giảng viên Phát âm chuẩn bản ngữ',
    default_alt_en: 'Mr. Lucas - Native Pronunciation Teacher',
    folder_id: 'folder_teachers',
    created_at: '2026-08-02T10:00:00Z',
    updated_at: '2026-08-02T10:00:00Z',
    usage_count: 1,
  },
  {
    id: 'asset_teacher_nhat',
    original_filename: 'teacher_nhat.png',
    storage_path: 'assets/teacher_nhat.png',
    public_url: teacherNhat,
    mime_type: 'image/png',
    file_size: 538942,
    width: 800,
    height: 800,
    content_hash: 'hash_teacher_nhat_016',
    status: 'active',
    default_alt_vi: 'Thầy Minh Nhật - Cố vấn Học thuật',
    default_alt_en: 'Mr. Minh Nhat - Academic Counselor',
    folder_id: 'folder_teachers',
    created_at: '2026-08-02T10:00:00Z',
    updated_at: '2026-08-02T10:00:00Z',
    usage_count: 1,
  },
  {
    id: 'asset_teacher_oliver',
    original_filename: 'teacher_oliver.png',
    storage_path: 'assets/teacher_oliver.png',
    public_url: teacherOliver,
    mime_type: 'image/png',
    file_size: 551723,
    width: 800,
    height: 800,
    content_hash: 'hash_teacher_oliver_017',
    status: 'active',
    default_alt_vi: 'Thầy Oliver - Giảng viên IELTS Advanced',
    default_alt_en: 'Mr. Oliver - IELTS Advanced Instructor',
    folder_id: 'folder_teachers',
    created_at: '2026-08-02T10:00:00Z',
    updated_at: '2026-08-02T10:00:00Z',
    usage_count: 1,
  },
  {
    id: 'asset_teacher_phuc',
    original_filename: 'teacher_phuc.png',
    storage_path: 'assets/teacher_phuc.png',
    public_url: teacherPhuc,
    mime_type: 'image/png',
    file_size: 711353,
    width: 800,
    height: 800,
    content_hash: 'hash_teacher_phuc_018',
    status: 'active',
    default_alt_vi: 'Thầy Hoàng Phúc - Giảng viên Luyện thi THPT',
    default_alt_en: 'Mr. Hoang Phuc - High School Exam Teacher',
    folder_id: 'folder_teachers',
    created_at: '2026-08-02T10:00:00Z',
    updated_at: '2026-08-02T10:00:00Z',
    usage_count: 1,
  },
  {
    id: 'asset_teacher_sarah',
    original_filename: 'teacher_sarah.png',
    storage_path: 'assets/teacher_sarah.png',
    public_url: teacherSarah,
    mime_type: 'image/png',
    file_size: 598302,
    width: 800,
    height: 800,
    content_hash: 'hash_teacher_sarah_019',
    status: 'active',
    default_alt_vi: 'Cô Sarah - Trưởng khoa Anh văn Trẻ em',
    default_alt_en: 'Ms. Sarah - Head of Young Learners',
    folder_id: 'folder_teachers',
    created_at: '2026-08-02T10:00:00Z',
    updated_at: '2026-08-02T10:00:00Z',
    usage_count: 2,
  },
  {
    id: 'asset_teacher_tho',
    original_filename: 'teacher_tho.png',
    storage_path: 'assets/teacher_tho.png',
    public_url: teacherTho,
    mime_type: 'image/png',
    file_size: 667502,
    width: 800,
    height: 800,
    content_hash: 'hash_teacher_tho_020',
    status: 'active',
    default_alt_vi: 'Cô Kim Thơ - Giảng viên Tiếng Anh Mầm Non',
    default_alt_en: 'Ms. Kim Tho - Kindergarten Teacher',
    folder_id: 'folder_teachers',
    created_at: '2026-08-02T10:00:00Z',
    updated_at: '2026-08-02T10:00:00Z',
    usage_count: 1,
  },

  // 4. Học Viên & Lớp Học
  {
    id: 'asset_student_an',
    original_filename: 'student_an.png',
    storage_path: 'assets/student_an.png',
    public_url: studentAn,
    mime_type: 'image/png',
    file_size: 708151,
    width: 800,
    height: 800,
    content_hash: 'hash_student_an_021',
    status: 'active',
    default_alt_vi: 'Học viên Minh An - Đạt 8.0 IELTS',
    default_alt_en: 'Student Minh An - 8.0 IELTS Score',
    folder_id: 'folder_students',
    created_at: '2026-08-03T10:00:00Z',
    updated_at: '2026-08-03T10:00:00Z',
    usage_count: 1,
  },
  {
    id: 'asset_student_hologram',
    original_filename: 'student_hologram.png',
    storage_path: 'assets/student_hologram.png',
    public_url: studentHologram,
    mime_type: 'image/png',
    file_size: 693084,
    width: 800,
    height: 800,
    content_hash: 'hash_student_hologram_022',
    status: 'active',
    default_alt_vi: 'Mô hình Học viên Hologram 3D',
    default_alt_en: 'Hologram 3D Student model',
    folder_id: 'folder_students',
    created_at: '2026-08-03T10:00:00Z',
    updated_at: '2026-08-03T10:00:00Z',
    usage_count: 1,
  },
  {
    id: 'asset_student_huy',
    original_filename: 'student_huy.png',
    storage_path: 'assets/student_huy.png',
    public_url: studentHuy,
    mime_type: 'image/png',
    file_size: 670071,
    width: 800,
    height: 800,
    content_hash: 'hash_student_huy_023',
    status: 'active',
    default_alt_vi: 'Học viên Gia Huy - Thủ khoa Cambridge Flyers',
    default_alt_en: 'Student Gia Huy - Cambridge Flyers Valedictorian',
    folder_id: 'folder_students',
    created_at: '2026-08-03T10:00:00Z',
    updated_at: '2026-08-03T10:00:00Z',
    usage_count: 1,
  },
  {
    id: 'asset_student_nam',
    original_filename: 'student_nam.png',
    storage_path: 'assets/student_nam.png',
    public_url: studentNam,
    mime_type: 'image/png',
    file_size: 578076,
    width: 800,
    height: 800,
    content_hash: 'hash_student_nam_024',
    status: 'active',
    default_alt_vi: 'Học viên Nhật Nam - Học sinh xuất sắc',
    default_alt_en: 'Student Nhat Nam - Outstanding Student',
    folder_id: 'folder_students',
    created_at: '2026-08-03T10:00:00Z',
    updated_at: '2026-08-03T10:00:00Z',
    usage_count: 1,
  },
  {
    id: 'asset_student_thu',
    original_filename: 'student_thu.png',
    storage_path: 'assets/student_thu.png',
    public_url: studentThu,
    mime_type: 'image/png',
    file_size: 664206,
    width: 800,
    height: 800,
    content_hash: 'hash_student_thu_025',
    status: 'active',
    default_alt_vi: 'Học viên Minh Thư - Giải Nhất Tiếng Anh Huyện',
    default_alt_en: 'Student Minh Thu - 1st Prize District Competition',
    folder_id: 'folder_students',
    created_at: '2026-08-03T10:00:00Z',
    updated_at: '2026-08-03T10:00:00Z',
    usage_count: 1,
  },
  {
    id: 'asset_student_vy',
    original_filename: 'student_vy.png',
    storage_path: 'assets/student_vy.png',
    public_url: studentVy,
    mime_type: 'image/png',
    file_size: 627185,
    width: 800,
    height: 800,
    content_hash: 'hash_student_vy_026',
    status: 'active',
    default_alt_vi: 'Học viên Khánh Vy - Đạt 15/15 Khiên Movers',
    default_alt_en: 'Student Khanh Vy - 15 Shields Movers',
    folder_id: 'folder_students',
    created_at: '2026-08-03T10:00:00Z',
    updated_at: '2026-08-03T10:00:00Z',
    usage_count: 1,
  },

  // 5. Phụ Huynh & Đánh Giá
  {
    id: 'asset_parent_1',
    original_filename: 'parent_1.png',
    storage_path: 'assets/parent_1.png',
    public_url: parent1,
    mime_type: 'image/png',
    file_size: 775108,
    width: 800,
    height: 800,
    content_hash: 'hash_parent_1_027',
    status: 'active',
    default_alt_vi: 'Phụ huynh Chị Thu Trang - Cảm nhận chất lượng đào tạo',
    default_alt_en: 'Parent Thu Trang testimonial',
    folder_id: 'folder_parents',
    created_at: '2026-08-04T10:00:00Z',
    updated_at: '2026-08-04T10:00:00Z',
    usage_count: 1,
  },
  {
    id: 'asset_parent_2',
    original_filename: 'parent_2.png',
    storage_path: 'assets/parent_2.png',
    public_url: parent2,
    mime_type: 'image/png',
    file_size: 788185,
    width: 800,
    height: 800,
    content_hash: 'hash_parent_2_028',
    status: 'active',
    default_alt_vi: 'Phụ huynh Anh Đức Trí - Đánh giá khóa học iCANCAM',
    default_alt_en: 'Parent Duc Tri testimonial',
    folder_id: 'folder_parents',
    created_at: '2026-08-04T10:00:00Z',
    updated_at: '2026-08-04T10:00:00Z',
    usage_count: 1,
  },
  {
    id: 'asset_parent_3',
    original_filename: 'parent_3.png',
    storage_path: 'assets/parent_3.png',
    public_url: parent3,
    mime_type: 'image/png',
    file_size: 779162,
    width: 800,
    height: 800,
    content_hash: 'hash_parent_3_029',
    status: 'active',
    default_alt_vi: 'Phụ huynh Chị Hải Yến - Phản hồi về phương pháp 4Ls',
    default_alt_en: 'Parent Hai Yen testimonial',
    folder_id: 'folder_parents',
    created_at: '2026-08-04T10:00:00Z',
    updated_at: '2026-08-04T10:00:00Z',
    usage_count: 1,
  },
  {
    id: 'asset_parent_4',
    original_filename: 'parent_4.png',
    storage_path: 'assets/parent_4.png',
    public_url: parent4,
    mime_type: 'image/png',
    file_size: 768143,
    width: 800,
    height: 800,
    content_hash: 'hash_parent_4_030',
    status: 'active',
    default_alt_vi: 'Phụ huynh Anh Quốc Việt - Đồng hành cùng con',
    default_alt_en: 'Parent Quoc Viet testimonial',
    folder_id: 'folder_parents',
    created_at: '2026-08-04T10:00:00Z',
    updated_at: '2026-08-04T10:00:00Z',
    usage_count: 1,
  },

  // 6. Thành Tích & Trường Học
  {
    id: 'asset_achievement_school',
    original_filename: 'achievement_school.png',
    storage_path: 'assets/achievement_school.png',
    public_url: achievementSchool,
    mime_type: 'image/png',
    file_size: 1040825,
    width: 1200,
    height: 800,
    content_hash: 'hash_achievement_school_031',
    status: 'active',
    default_alt_vi: 'Khuôn viên trung tâm ngoại ngữ iCANCAM',
    default_alt_en: 'iCANCAM Language Center campus',
    folder_id: 'folder_achievements',
    created_at: '2026-08-05T10:00:00Z',
    updated_at: '2026-08-05T10:00:00Z',
    usage_count: 1,
  },
  {
    id: 'asset_achievement_smartboard',
    original_filename: 'achievement_smartboard.png',
    storage_path: 'assets/achievement_smartboard.png',
    public_url: achievementSmartboard,
    mime_type: 'image/png',
    file_size: 830717,
    width: 1200,
    height: 800,
    content_hash: 'hash_achievement_smartboard_032',
    status: 'active',
    default_alt_vi: 'Bảng tương tác thông minh Smartboard',
    default_alt_en: 'Interactive Smartboard technology',
    folder_id: 'folder_achievements',
    created_at: '2026-08-05T10:00:00Z',
    updated_at: '2026-08-05T10:00:00Z',
    usage_count: 1,
  },
  {
    id: 'asset_achievement_teacher',
    original_filename: 'achievement_teacher.png',
    storage_path: 'assets/achievement_teacher.png',
    public_url: achievementTeacher,
    mime_type: 'image/png',
    file_size: 735754,
    width: 1200,
    height: 800,
    content_hash: 'hash_achievement_teacher_033',
    status: 'active',
    default_alt_vi: 'Đội ngũ giảng viên xuất sắc nhận bằng khen',
    default_alt_en: 'Outstanding teaching staff awards',
    folder_id: 'folder_achievements',
    created_at: '2026-08-05T10:00:00Z',
    updated_at: '2026-08-05T10:00:00Z',
    usage_count: 1,
  },

  // 7. Bài Viết Tin Tức
  {
    id: 'asset_news_arena',
    original_filename: 'news_arena.png',
    storage_path: 'assets/news_arena.png',
    public_url: newsArena,
    mime_type: 'image/png',
    file_size: 940736,
    width: 1200,
    height: 675,
    content_hash: 'hash_news_arena_034',
    status: 'active',
    default_alt_vi: 'Cuộc thi Rung Chuông Vàng Tiếng Anh 2026',
    default_alt_en: 'English Arena Competition 2026',
    folder_id: 'folder_news',
    created_at: '2026-08-05T10:00:00Z',
    updated_at: '2026-08-05T10:00:00Z',
    usage_count: 1,
  },
  {
    id: 'asset_news_limit',
    original_filename: 'news_limit.png',
    storage_path: 'assets/news_limit.png',
    public_url: newsLimit,
    mime_type: 'image/png',
    file_size: 765196,
    width: 1200,
    height: 675,
    content_hash: 'hash_news_limit_035',
    status: 'active',
    default_alt_vi: 'Bí quyết bứt phá giới hạn điểm số Tiếng Anh',
    default_alt_en: 'Unlocking English score limits',
    folder_id: 'folder_news',
    created_at: '2026-08-05T10:00:00Z',
    updated_at: '2026-08-05T10:00:00Z',
    usage_count: 1,
  },
  {
    id: 'asset_news_parenting',
    original_filename: 'news_parenting.png',
    storage_path: 'assets/news_parenting.png',
    public_url: newsParenting,
    mime_type: 'image/png',
    file_size: 711067,
    width: 1200,
    height: 675,
    content_hash: 'hash_news_parenting_036',
    status: 'active',
    default_alt_vi: 'Phương pháp đồng hành cùng con học ngoại ngữ',
    default_alt_en: 'Parenting guide for English learning',
    folder_id: 'folder_news',
    created_at: '2026-08-05T10:00:00Z',
    updated_at: '2026-08-05T10:00:00Z',
    usage_count: 1,
  },
];

const DEFAULT_INITIAL_USAGES: MediaUsage[] = [
  {
    id: 'usage_1',
    media_id: 'asset_banner_bg',
    entity_type: 'homepage',
    entity_id: 'home_hero',
    entity_title: 'Trang Chủ - Banner Chính',
    created_at: '2026-08-01T10:00:00Z',
    updated_at: '2026-08-01T10:00:00Z',
  },
  {
    id: 'usage_2',
    media_id: 'asset_ican_logo',
    entity_type: 'homepage',
    entity_id: 'header_logo',
    entity_title: 'Header - Logo Thương Hiệu',
    created_at: '2026-08-01T10:00:00Z',
    updated_at: '2026-08-01T10:00:00Z',
  },
  {
    id: 'usage_3',
    media_id: 'asset_teacher_sarah',
    entity_type: 'teachers',
    entity_id: 'teacher_sarah',
    entity_title: 'Đội Ngũ Giáo Viên - Cô Sarah',
    created_at: '2026-08-02T11:00:00Z',
    updated_at: '2026-08-02T11:00:00Z',
  },
  {
    id: 'usage_4',
    media_id: 'asset_news_arena',
    entity_type: 'news',
    entity_id: 'post_arena',
    entity_title: 'Tin Tức: Rung Chuông Vàng 2026',
    created_at: '2026-08-05T09:30:00Z',
    updated_at: '2026-08-05T09:30:00Z',
  },
];
