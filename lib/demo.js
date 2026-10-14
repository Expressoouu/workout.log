import { addDays } from './dates.js';

// Starting top-set weight (kg) per muscle group, for demo workouts.
const BASE = {
  Chest: 40, Back: 45, Shoulders: 14, Biceps: 12, Triceps: 15, Forearms: 14,
  Quads: 60, 'Hamstrings & Glutes': 50, Calves: 40, Core: 0, 'Olympic & Full Body': 30, Cardio: 0,
};
const HEAVY = /deadlift|squat|leg press|hip thrust|rack pull/i;
const round = (kg) => Math.round(kg / 2.5) * 2.5;

// Small deterministic PRNG so demo data (and its test) is reproducible.
function rng(seed) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

// Builds `weeks` of finished, demo-tagged sessions ending yesterday: templates rotate Mon–Sat, Sunday rest,
// weights rise ~2.5%/week. Skips dates in `takenDates` so real workouts are never overwritten.
export function demoSessions({ templates, exercises, endDate, weeks = 5, takenDates = new Set(), seed = 42 }) {
  if (!templates.length) return [];
  const rand = rng(seed);
  const byId = new Map(exercises.map((e) => [e.id, e]));
  const out = [];
  let rotation = 0;
  const days = weeks * 7;

  for (let d = days; d >= 1; d--) {
    const date = addDays(endDate, -d);
    if (new Date(date + 'T12:00:00').getDay() === 0) continue; // Sunday rest
    const t = templates[rotation++ % templates.length];
    if (takenDates.has(date)) continue;
    const progress = 1 + 0.025 * ((days - d) / 7);

    out.push({
      date,
      name: t.name,
      demo: true,
      finishedAt: `${date}T19:${String(Math.floor(rand() * 60)).padStart(2, '0')}:00`,
      items: t.items.map((it) => {
        const ex = byId.get(it.exerciseId);
        const base = (BASE[ex?.group] ?? 20) * (HEAVY.test(ex?.name ?? '') ? 2 : 1);
        const weight = round(base * progress);
        return {
          exerciseId: it.exerciseId,
          sets: Array.from({ length: it.sets || 3 }, (_, k) => ({
            reps: Math.max(1, (it.reps || 10) - k - (rand() < 0.3 ? 1 : 0)),
            weight,
            done: !(k === (it.sets || 3) - 1 && rand() < 0.1), // occasionally skip the last set
          })),
        };
      }),
    });
  }
  return out;
}
