import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

//Max waiting time
const SESSION_TIMEOUT_MS = 60 * 60 * 1000;

export type SetData = {
  reps: number;
  weight: number;
  completedAt: number;
};

export type ExerciseData = {
  exerciseId: string;
  name: string;
  sets: SetData;
};

type WorkoutState = {
  activeWorkoutId: string | null;
  lastActivityTimestamp: number | null;
  exercises: Record<string, ExerciseData>;

  addSet: (
    exerciseId: string,
    name: string,
    reps: number,
    weight: number,
  ) => void;
  finishWorkout: () => void;
};
