export const LOCAL_IMAGE_SCHEME = 'local-image://';

const DB_NAME = 'nexora-local-images';
const STORE_NAME = 'images';
const DB_VERSION = 1;

export interface LocalImageRecord {
  id: string;
  fileName: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  blob: Blob;
  createdAt: string;
}

export const isLocalImageRef = (value?: string) => Boolean(value?.startsWith(LOCAL_IMAGE_SCHEME));

export const createLocalImageRef = (id: string) => `${LOCAL_IMAGE_SCHEME}${id}`;

export const getLocalImageId = (value: string) => value.replace(LOCAL_IMAGE_SCHEME, '');

const canUseIndexedDb = () => typeof window !== 'undefined' && 'indexedDB' in window;

function openDb(): Promise<IDBDatabase> {
  if (!canUseIndexedDb()) return Promise.reject(new Error('indexeddb-unavailable'));

  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('indexeddb-open-failed'));
  });
}

async function withStore<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode);
    const store = tx.objectStore(STORE_NAME);
    const request = run(store);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('indexeddb-request-failed'));
    tx.oncomplete = () => db.close();
    tx.onerror = () => {
      db.close();
      reject(tx.error ?? new Error('indexeddb-transaction-failed'));
    };
  });
}

export async function storeLocalImage(file: File, meta: { width?: number; height?: number } = {}) {
  const id = `img_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  const record: LocalImageRecord = {
    id,
    fileName: file.name || `${id}.png`,
    mimeType: file.type || 'application/octet-stream',
    size: file.size,
    width: meta.width,
    height: meta.height,
    blob: file,
    createdAt: new Date().toISOString(),
  };

  await withStore('readwrite', (store) => store.put(record));

  return {
    id,
    ref: createLocalImageRef(id),
    record,
  };
}

export async function storeLocalImageBlob(
  blob: Blob,
  fileName: string,
  meta: { width?: number; height?: number; mimeType?: string } = {},
) {
  const id = `img_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  const record: LocalImageRecord = {
    id,
    fileName: fileName || `${id}.png`,
    mimeType: meta.mimeType || blob.type || 'application/octet-stream',
    size: blob.size,
    width: meta.width,
    height: meta.height,
    blob,
    createdAt: new Date().toISOString(),
  };

  await withStore('readwrite', (store) => store.put(record));

  return {
    id,
    ref: createLocalImageRef(id),
    record,
  };
}

export async function getLocalImage(idOrRef: string): Promise<LocalImageRecord | null> {
  const id = isLocalImageRef(idOrRef) ? getLocalImageId(idOrRef) : idOrRef;
  const record = await withStore<LocalImageRecord | undefined>('readonly', (store) => store.get(id));
  return record ?? null;
}

export async function resolveLocalImageUrl(value: string): Promise<string> {
  if (!isLocalImageRef(value)) return value;
  const record = await getLocalImage(value);
  if (!record) return '';
  return URL.createObjectURL(record.blob);
}

export const revokeResolvedLocalImageUrl = (value: string) => {
  if (value.startsWith('blob:')) URL.revokeObjectURL(value);
};
