import test from 'node:test';
import assert from 'node:assert/strict';
import { demoSessions } from './demo.js';

const exercises = [{ id: 1, name: 'Barbell Bench Press', group: 'Chest' }, { id: 2, name: 'Back Squat', group: 'Quads' }];
const templates = [
  { name: 'A', items: [{ exerciseId: 1, sets: 3, reps: 10, weight: 0 }] },
  { name: 'B', items: [{ exerciseId: 2, sets: 3, reps: 8, weight: 0 }] },
];

test('5 weeks, Sundays off, tagged, finished, and weights rise', () => {
  const s = demoSessions({ templates, exercises, endDate: '2026-10-14' });
  assert.equal(s.length, 30); // 35 days minus 5 Sundays
  assert.ok(s.every((x) => x.demo && x.finishedAt && new Date(x.date + 'T12:00:00').getDay() !== 0));
  assert.equal(new Set(s.map((x) => x.date)).size, s.length);
  assert.ok(s.every((x) => x.date < '2026-10-14'));
  const bench = s.filter((x) => x.name === 'A').map((x) => x.items[0].sets[0].weight);
  assert.ok(bench.at(-1) > bench[0], `${bench[0]} -> ${bench.at(-1)}`);
  const squat = s.find((x) => x.name === 'B').items[0].sets[0].weight;
  assert.ok(squat >= 120, 'heavy lifts start heavier');
});

test('never touches dates that already have a workout', () => {
  const s = demoSessions({ templates, exercises, endDate: '2026-10-14', takenDates: new Set(['2026-10-13']) });
  assert.ok(!s.some((x) => x.date === '2026-10-13'));
});

test('no schedules, no demo data', () => {
  assert.deepEqual(demoSessions({ templates: [], exercises, endDate: '2026-10-14' }), []);
});
