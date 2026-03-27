import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 1 ώρα σε milliseconds
const SESSION_TIMEOUT_MS = 60 * 60 * 1000;

export type SetData = { reps: number; weight: number; completedAt: number };

export type ExerciseData = {
  exerciseId: string;
  name: string;
  target_muscle_group?: string;
  sets: SetData[];
};

export type CompletedWorkout = {
  id: string;
  name: string;
  date: string;
  exercises: ExerciseData[];
};

type WorkoutState = {
  activeWorkoutId: string | null;
  lastActivityTimestamp: number | null;
  exercises: Record<string, ExerciseData>;
  history: CompletedWorkout[];
  addSet: (
    exerciseId: string,
    name: string,
    reps: number,
    weight: number,
    muscle?: string,
  ) => void;
  finishWorkout: () => void;
  checkActiveSession: () => void;
};

export const useWorkoutState = create<WorkoutState>()(
  persist(
    (set, get) => ({
      activeWorkoutId: null,
      lastActivityTimestamp: null,
      exercises: {},
      history: [],

      addSet: (exerciseId, name, reps, weight, muscle) => {
        // Πριν προσθέσουμε, ελέγχουμε αν το παλιό session έληξε
        get().checkActiveSession();

        const now = Date.now();
        const { exercises, activeWorkoutId } = get();
        const currentId = activeWorkoutId || `workout_${now}`;

        // Αν η άσκηση υπάρχει ήδη, την παίρνουμε, αλλιώς φτιάχνουμε νέα
        const existingExercise = exercises[exerciseId] || {
          exerciseId,
          name,
          target_muscle_group: muscle,
          sets: [],
        };

        const updatedExercise = {
          ...existingExercise,
          sets: [...existingExercise.sets, { reps, weight, completedAt: now }],
        };

        set({
          activeWorkoutId: currentId,
          lastActivityTimestamp: now,
          exercises: { ...exercises, [exerciseId]: updatedExercise },
        });
      },

      finishWorkout: () => {
        const { exercises, activeWorkoutId, history } = get();
        const exerciseList = Object.values(exercises);
        if (exerciseList.length === 0) return;

        // Auto-Naming βασισμένο στους μυς
        const muscleCounts: Record<string, number> = {};
        exerciseList.forEach((ex) => {
          const m = ex.target_muscle_group || "Mixed";
          muscleCounts[m] = (muscleCounts[m] || 0) + 1;
        });

        const dominant = Object.keys(muscleCounts).reduce(
          (a, b) => (muscleCounts[a] > muscleCounts[b] ? a : b),
          "Full Body",
        );

        const today = new Date();
        const workoutName = `${dominant} Day - ${today.toLocaleDateString("el-GR")}`;

        const newWorkout: CompletedWorkout = {
          id: activeWorkoutId || `workout_${Date.now()}`,
          name: workoutName,
          date: today.toISOString(),
          exercises: exerciseList,
        };

        set({
          history: [newWorkout, ...history],
          exercises: {},
          activeWorkoutId: null,
          lastActivityTimestamp: null,
        });
      },

      checkActiveSession: () => {
        const { lastActivityTimestamp, exercises, finishWorkout } = get();
        if (!lastActivityTimestamp || Object.keys(exercises).length === 0)
          return;

        if (Date.now() - lastActivityTimestamp > SESSION_TIMEOUT_MS) {
          console.log("Session expired. Auto-saving...");
          finishWorkout();
        }
      },
    }),
    { name: "workout-storage", storage: createJSONStorage(() => AsyncStorage) },
  ),
);
