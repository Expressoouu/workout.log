export const today = () => new Date().toLocaleDateString('sv'); // local YYYY-MM-DD

export function addDays(date, n) {
  const d = new Date(date + 'T12:00:00');
  d.setDate(d.getDate() + n);
  return d.toLocaleDateString('sv');
}
