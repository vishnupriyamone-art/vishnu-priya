
export interface DietPlan {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks: string;
  calories: number;
}

export interface HealthMetric {
  date: string;
  steps: number;
  caloriesBurned: number;
  waterIntake: number;
}

export interface DailyLogEntry {
  id: string;
  timestamp: number;
  food: string;
  water: number;
  exercise: string;
  aiFeedback: string;
}

export interface UserProfile {
  age: number;
  weight: number;
  height: number;
  gender: string;
  activityLevel: string;
  specialization: string; // e.g., Diabetic, Keto, Athlete
  stepGoal: number;
}

export interface GroundingSource {
  web?: {
    uri?: string;
    title?: string;
  };
}
