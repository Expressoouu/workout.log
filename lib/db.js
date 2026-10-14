import { LIBRARY } from './exercise-library.js';
import { CUSTOM, SCHEDULES } from './my-schedules.js';

const STORES = ['exercises', 'templates', 'sessions'];

// Adds library exercises the user doesn't already have (matched by name, ignoring case);
// existing matches just get their muscle group so they sort into the right section.
function seedLibrary(os, then) {
  os.getAll().onsuccess = (e) => {
    const have = new Map(e.target.result.map((x) => [x.name.toLowerCase(), x]));
    for (const [group, names] of Object.entries(LIBRARY)) {
      for (const name of names) {
        const existing = have.get(name.toLowerCase());
        os.put(existing ? { ...existing, group } : { name, group });
      }
    }
    then();
  };
}

// Adds the user's schedules (skipping names that already exist), creating any missing exercises first.
// Requests in one transaction run in order, so this sees everything seedLibrary wrote.
function seedSchedules(t) {
  const ex = t.objectStore('exercises');
  const tpl = t.objectStore('templates');
  ex.getAll().onsuccess = (e) => {
    const ids = new Map(e.target.result.map((x) => [x.name.toLowerCase(), x.id]));
    const missing = [...new Set(SCHEDULES.flatMap((s) => s.items))].filter((n) => !ids.has(n.toLowerCase()));
    const writeTemplates = () => {
      tpl.getAll().onsuccess = (e2) => {
        const have = new Set(e2.target.result.map((x) => x.name));
        for (const s of SCHEDULES) {
          if (have.has(s.name)) continue;
          tpl.put({
            name: s.name,
            items: s.items.map((n) => ({ exerciseId: ids.get(n.toLowerCase()), sets: 3, reps: 10, weight: 0 })),
          });
        }
      };
    };
    let pending = missing.length;
    if (!pending) return writeTemplates();
    for (const name of missing) {
      ex.put({ name, group: CUSTOM[name] ?? 'Custom' }).onsuccess = (e3) => {
        ids.set(name.toLowerCase(), e3.target.result);
        if (--pending === 0) writeTemplates();
      };
    }
  };
}

// Opened on first use: the module is also loaded during the static build, where IndexedDB doesn't exist.
let dbp;
const open = () => (dbp ??= new Promise((resolve, reject) => {
  const req = indexedDB.open('workouts', 3);
  req.onupgradeneeded = (e) => {
    if (e.oldVersion < 1) {
      for (const s of STORES) {
        const os = req.result.createObjectStore(s, { keyPath: 'id', autoIncrement: true });
        if (s === 'sessions') os.createIndex('date', 'date');
      }
    }
    const t = req.transaction;
    const v3 = () => { if (e.oldVersion < 3) seedSchedules(t); };
    if (e.oldVersion < 2) seedLibrary(t.objectStore('exercises'), v3);
    else v3();
  };
  req.onsuccess = () => {
    // Let a newer version of the app (e.g. in another tab after a deploy) upgrade the database instead of
    // waiting on this connection forever; this tab reloads to pick up the new version.
    req.result.onversionchange = () => { req.result.close(); location.reload(); };
    resolve(req.result);
  };
  req.onerror = () => reject(req.error);
}));

async function tx(store, mode, fn) {
  const db = await open();
  return new Promise((resolve, reject) => {
    const t = db.transaction(store, mode);
    const req = fn(t.objectStore(store));
    t.oncomplete = () => resolve(req?.result);
    t.onerror = () => reject(t.error);
  });
}

export const all = (store) => tx(store, 'readonly', (s) => s.getAll());
export const put = (store, obj) => tx(store, 'readwrite', (s) => s.put(obj));
export const del = (store, id) => tx(store, 'readwrite', (s) => s.delete(id));

export async function exportAll() {
  const out = {};
  for (const s of STORES) out[s] = await all(s);
  return out;
}

// Replaces all data with the backup's contents.
export async function importAll(data) {
  if (!STORES.every((s) => Array.isArray(data[s]))) throw new Error('Not a valid backup file');
  const db = await open();
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORES, 'readwrite');
    for (const s of STORES) {
      const os = t.objectStore(s);
      os.clear();
      data[s].forEach((o) => os.put(o));
    }
    t.oncomplete = resolve;
    t.onerror = () => reject(t.error);
  });
}
