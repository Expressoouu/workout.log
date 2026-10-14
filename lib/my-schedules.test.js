import test from 'node:test';
import assert from 'node:assert/strict';
import { LIBRARY } from './exercise-library.js';
import { CUSTOM, SCHEDULES } from './my-schedules.js';

test('every schedule item is a library or custom exercise', () => {
  const known = new Set([...Object.values(LIBRARY).flat(), ...Object.keys(CUSTOM)].map((n) => n.toLowerCase()));
  for (const s of SCHEDULES) for (const n of s.items) assert.ok(known.has(n.toLowerCase()), `${s.name}: ${n}`);
});

test('custom exercises do not duplicate the library and use real groups', () => {
  const lib = new Set(Object.values(LIBRARY).flat().map((n) => n.toLowerCase()));
  for (const [n, g] of Object.entries(CUSTOM)) {
    assert.ok(!lib.has(n.toLowerCase()), n);
    assert.ok(g in LIBRARY, g);
  }
});
