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
  sets: SetData[];
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

export const useWorkoutState = create<WorkoutState>()(
  persist(
    (set, get) => ({
      activeWorkoutId: null,
      lastActivityTimestamp: null,
      exercises: {},

      addSet: (exerciseId, name, reps, weight) => {
        const now = Date.now();
        const { activeWorkoutId, lastActivityTimestamp, exercises } = get();
        let currentWorkoutId = activeWorkoutId;
        let currentExercises = { ...exercises };

        //time checker from last activity
        if (
          !currentWorkoutId ||
          (lastActivityTimestamp &&
            now - lastActivityTimestamp > SESSION_TIMEOUT_MS)
        ) {
          currentWorkoutId = `workout_${now}`;
          currentExercises = {};
          console.log("started a new workout seassion");
        }

        const exerciseRecord = currentExercises[exerciseId] || {
          exerciseId,
          name,
          sets: [],
        };

        // add new set
        exerciseRecord.sets.push({ reps, weight, completedAt: now });
        currentExercises[exerciseId] = exerciseRecord;

        set({
          activeWorkoutId: currentWorkoutId,
          lastActivityTimestamp: now,
          exercises: currentExercises,
        });
      },
      finishWorkout: () => {
        console.log("Workout finished. Sending to db...", get().exercises);
        set({
          activeWorkoutId: null,
          lastActivityTimestamp: null,
          exercises: {},
        });
      },
    }),
    { name: "workout-storage", storage: createJSONStorage(() => AsyncStorage) },
  ),
);
