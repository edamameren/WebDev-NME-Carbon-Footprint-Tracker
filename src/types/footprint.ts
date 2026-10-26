export interface HabitLog {
    id: string;
    category: string;
    description: string;
    co2Kg: number;
    date: string;
  }

export type NewHabitLog = Pick<HabitLog, 'category' | 'description' | 'co2Kg'>;
