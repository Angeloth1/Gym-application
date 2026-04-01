export type Profile = {
  id: string;
  name: string;
  sex: "m" | "f" | "other" | null;
  age: number | null;
  avatar_url: string | null;
  created_at: string;
};

export type EquipmentType =
  | "barbell"
  | "dumbell"
  | "machine"
  | "cable"
  | "bodyweight"
  | "none"
  | "other";

export type Exercise = {
  id: string;
  name: string;
  nameNonEng: string | null;
  target_muscle: string;
  equipment_type: EquipmentType;
  has_weights: boolean;
  user_id: string | null;
  created_at: string;
};

export type Workout = {
  id: string;
  user_id: string;
  title: string | null;
  created_at: string;
  ended_at: string | null;
};

export type WorkoutSet = {
  id: string;
  workout_id: string;
  exercise_id: string;
  set_number: number;
  reps: number;
  weight: number;
  created_at: string;
};
