
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

export interface UserProfile {
  age: number;
  weight: number;
  height: number;
  gender: string;
  activityLevel: string;
  specialization: string; // e.g., Diabetic, Keto, Athlete
}

export interface GroundingSource {
  web?: {
    uri: string;
    title: string;
  };
}
