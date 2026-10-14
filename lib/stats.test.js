import test from 'node:test';
import assert from 'node:assert/strict';
import { volume, doneCount, exerciseSeries, weekStart, weeklyTotals, lastLifts } from './stats.js';

const s1 = {
  date: '2026-10-13',
  items: [{ exerciseId: 1, sets: [{ reps: 10, weight: 50, done: true }, { reps: 10, weight: 60, done: false }] }],
};
const s2 = {
  date: '2026-10-12',
  items: [
    { exerciseId: 1, sets: [{ reps: 5, weight: 70, done: true }] },
    { exerciseId: 2, sets: [{ reps: 8, weight: '20', done: true }] },
  ],
};

test('volume counts only done sets', () => {
  assert.equal(volume(s1), 500);
  assert.equal(doneCount(s1), 1);
  assert.equal(volume(s2), 350 + 160);
});

test('exerciseSeries sorted by date, skips sessions without the exercise', () => {
  assert.deepEqual(exerciseSeries([s1, s2], 1), [
    { date: '2026-10-12', maxWeight: 70, volume: 350 },
    { date: '2026-10-13', maxWeight: 50, volume: 500 },
  ]);
  assert.deepEqual(exerciseSeries([s1], 2), []);
});

test('weekStart is Monday; Sunday belongs to previous week', () => {
  assert.equal(weekStart('2026-10-14'), '2026-10-12');
  assert.equal(weekStart('2026-10-12'), '2026-10-12');
  assert.equal(weekStart('2026-10-11'), '2026-10-05');
});

test('weeklyTotals groups by week', () => {
  assert.deepEqual(weeklyTotals([s1, s2]), [{ week: '2026-10-12', volume: 1010 }]);
});

test('lastLifts: newest first, only done sets, only before the given day', () => {
  const ses = (date, sets) => ({ date, items: [{ exerciseId: 1, sets }, { exerciseId: 2, sets: [{ reps: 1, weight: 1, done: true }] }] });
  const sessions = [
    ses('2026-10-01', [{ reps: 10, weight: 50, done: true }]),
    ses('2026-10-05', [{ reps: 8, weight: 55, done: true }, { reps: 8, weight: 55, done: false }]),
    ses('2026-10-03', [{ reps: 10, weight: 52.5, done: false }]), // nothing done: skipped
    ses('2026-10-09', [{ reps: 6, weight: 60, done: true }]),
    ses('2026-10-14', [{ reps: 5, weight: 70, done: true }]), // the day being viewed: excluded
  ];
  assert.deepEqual(lastLifts(sessions, 1, '2026-10-14', 2), [
    { date: '2026-10-09', sets: [{ reps: 6, weight: 60 }] },
    { date: '2026-10-05', sets: [{ reps: 8, weight: 55 }] },
  ]);
  assert.deepEqual(lastLifts(sessions, 3, '2026-10-14'), []);
});
