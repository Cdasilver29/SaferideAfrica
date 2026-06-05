/**
 * Split a total into three installments.
 * The first installment absorbs any remainder so the three values
 * sum exactly to `total`.
 *
 * Example: 13_000 → [4_334, 4_333, 4_333]  (sum = 13_000 ✓)
 */
export function splitIntoThree(total: number): [number, number, number] {
  const base      = Math.floor(total / 3);
  const remainder = total - base * 3;
  return [base + remainder, base, base];
}

/** ISO date strings for today, today+10d, today+20d */
export function installmentDueDates(): [string, string, string] {
  const pad   = (n: number) => String(n).padStart(2, '0');
  const iso   = (d: Date)   => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const today = new Date();
  const d10   = new Date(today); d10.setDate(today.getDate() + 10);
  const d20   = new Date(today); d20.setDate(today.getDate() + 20);
  return [iso(today), iso(d10), iso(d20)];
}
