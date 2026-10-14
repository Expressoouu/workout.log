'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as db from './db.js';

export { today, addDays } from './dates.js';

// All app data in React state. Updates to existing records apply to state immediately (so inputs stay
// responsive) and are written to IndexedDB in the background; new records reload to pick up their id.
export function useData() {
  const [data, setData] = useState(null);
  // Latest data, updated synchronously, so back-to-back edits (two quick taps) build on each other
  // instead of both starting from the last rendered state.
  const latest = useRef(null);
  const commit = useCallback((d) => { latest.current = d; setData(d); }, []);

  const reload = useCallback(async () => {
    const [exercises, templates, sessions] = await Promise.all(['exercises', 'templates', 'sessions'].map(db.all));
    exercises.sort((a, b) => a.name.localeCompare(b.name));
    commit({ exercises, templates, sessions });
  }, [commit]);

  useEffect(() => { reload(); }, [reload]);

  const save = useCallback(async (store, obj) => {
    if (obj.id != null) {
      const d = latest.current;
      commit({ ...d, [store]: d[store].map((x) => (x.id === obj.id ? obj : x)) });
    }
    await db.put(store, obj);
    if (obj.id == null) await reload();
  }, [commit, reload]);

  // Edit an existing record in place: `fn` mutates a fresh copy of its latest version.
  const update = useCallback((store, id, fn) => {
    const next = structuredClone(latest.current[store].find((x) => x.id === id));
    fn(next);
    return save(store, next);
  }, [save]);

  const remove = useCallback(async (store, id) => {
    await db.del(store, id);
    await reload();
  }, [reload]);

  return { data, reload, save, update, remove };
}
