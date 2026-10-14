// Only sets marked done count toward any stat.
const doneSets = (item) => item.sets.filter((s) => s.done);
const setVolume = (s) => (Number(s.reps) || 0) * (Number(s.weight) || 0);

export const volume = (session) =>
  session.items.reduce((sum, it) => sum + doneSets(it).reduce((a, s) => a + setVolume(s), 0), 0);

export const doneCount = (session) => session.items.reduce((n, it) => n + doneSets(it).length, 0);

export function exerciseSeries(sessions, exerciseId) {
  return sessions
    .map((ses) => {
      const sets = ses.items.filter((it) => it.exerciseId === exerciseId).flatMap(doneSets);
      if (!sets.length) return null;
      return {
        date: ses.date,
        maxWeight: Math.max(...sets.map((s) => Number(s.weight) || 0)),
        volume: sets.reduce((a, s) => a + setVolume(s), 0),
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.date.localeCompare(b.date));
}

// Monday of the ISO week, as YYYY-MM-DD.
export function weekStart(date) {
  const d = new Date(date + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d.toISOString().slice(0, 10);
}

export function weeklyTotals(sessions) {
  const weeks = {};
  for (const s of sessions) {
    const w = weekStart(s.date);
    weeks[w] = (weeks[w] || 0) + volume(s);
  }
  return Object.entries(weeks)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([week, vol]) => ({ week, volume: vol }));
}

// The most recent sessions (before `beforeDate`) where this exercise had done sets, newest first.
export function lastLifts(sessions, exerciseId, beforeDate, limit = 3) {
  return sessions
    .filter((s) => s.date < beforeDate)
    .map((s) => ({
      date: s.date,
      sets: s.items.filter((it) => it.exerciseId === exerciseId).flatMap(doneSets).map(({ reps, weight }) => ({ reps, weight })),
    }))
    .filter((s) => s.sets.length)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}
