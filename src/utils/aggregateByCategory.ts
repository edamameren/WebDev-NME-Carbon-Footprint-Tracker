import type { HabitLog } from '../types/footprint';

export interface CategoryTotal {
  category: string;
  totalKg: number;
}

export function aggregateCo2ByCategory(logs: HabitLog[]): CategoryTotal[] {
  const totals = new Map<string, number>();

  for (const log of logs) {
    const current = totals.get(log.category) ?? 0;
    totals.set(log.category, current + log.co2Kg);
  }

  return Array.from(totals.entries())
    .map(([category, totalKg]) => ({ category, totalKg }))
    .sort((a, b) => b.totalKg - a.totalKg);
}
