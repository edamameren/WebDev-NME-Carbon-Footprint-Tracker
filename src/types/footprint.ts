export interface HabitLog {
  id: string;
  category: string;
  description: string;
  co2Kg: number;
  date: string;
}

export interface EmissionFactor {
  id: string;
  category: string;
  activity: string;
  unit: string;
  kgCo2ePerUnit: number;
}

export type NewHabitLog = Pick<HabitLog, 'category' | 'description' | 'co2Kg'> & {
  factorId: string;
  quantity: number;
};