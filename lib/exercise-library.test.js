import test from 'node:test';
import assert from 'node:assert/strict';
import { LIBRARY } from './exercise-library.js';

test('library has 200 unique exercises', () => {
  const names = Object.values(LIBRARY).flat().map((n) => n.toLowerCase());
  assert.equal(names.length, 200);
  assert.equal(new Set(names).size, 200);
});
