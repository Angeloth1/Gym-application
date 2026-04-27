import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { randomUUID } from "expo-crypto";
import { Exercise, Workout, WorkoutSet } from "@/types/database"; // Ή "../types/database" ανάλογα πώς το έχεις

const SESSION_TIMEOUT_MS = 60 * 60 * 1000;

export type ActiveSet = Omit<
  WorkoutSet,
  "id" | "workout_id" | "exercise_id" | "created_at"
> & {
  id: string;
  completedAt: number;
};

export type ActiveExercise = {
  exerciseDetails: Exercise;
  sets: ActiveSet[];
};

export type CompletedWorkout = {
  workout: Omit<Workout, "user_id">;
  exercises: ActiveExercise[];
};

type WorkoutState = {
  activeWorkoutId: string | null;
  lastActivityTimestamp: number | null;
  exercises: Record<string, ActiveExercise>;
  history: CompletedWorkout[];
  addSet: (exercise: Exercise, reps: number, weight: number) => void;
  finishWorkout: () => void;
  checkActiveSession: () => void;

  restEndTime: number | null;
  startRest: (durationMs: number) => void;
  clearRest: () => void;
};

export const useWorkoutState = create<WorkoutState>()(
  persist(
    (set, get) => ({
      activeWorkoutId: null,
      lastActivityTimestamp: null,
      exercises: {},
      history: [],

      restEndTime: null,
      startRest: (durationMs) => {
        set({ restEndTime: Date.now() + durationMs });
      },

      clearRest: () => {
        set({ restEndTime: null });
      },

      addSet: (exercise, reps, weight) => {
        get().checkActiveSession();

        const now = Date.now();
        const { exercises, activeWorkoutId } = get();

        const currentId = activeWorkoutId || randomUUID();

        const existingExercise = exercises[exercise.id] || {
          exerciseDetails: exercise,
          sets: [],
        };

        const currentSetNumber = existingExercise.sets.length + 1;

        const newSet: ActiveSet = {
          id: randomUUID(),
          set_number: currentSetNumber,
          reps,
          weight,
          completedAt: now,
        };

        const updatedExercise = {
          ...existingExercise,
          sets: [...existingExercise.sets, newSet],
        };

        set({
          activeWorkoutId: currentId,
          lastActivityTimestamp: now,
          exercises: { ...exercises, [exercise.id]: updatedExercise },
        });
      },

      finishWorkout: () => {
        const { exercises, activeWorkoutId, history } = get();
        const exerciseList = Object.values(exercises);
        if (exerciseList.length === 0) return;

        const muscleCounts: Record<string, number> = {};
        exerciseList.forEach((ex) => {
          const m = ex.exerciseDetails.target_muscle || "Mixed";
          muscleCounts[m] = (muscleCounts[m] || 0) + 1;
        });

        const dominant = Object.keys(muscleCounts).reduce(
          (a, b) => (muscleCounts[a] > muscleCounts[b] ? a : b),
          "Full Body",
        );

        const today = new Date();
        const workoutName = `${dominant} Day - ${today.toLocaleDateString("el-GR")}`;

        const newCompletedWorkout: CompletedWorkout = {
          workout: {
            id: activeWorkoutId!,
            title: workoutName,
            created_at: today.toISOString(),
            ended_at: today.toISOString(),
          },
          exercises: exerciseList,
        };

        set({
          history: [newCompletedWorkout, ...history],
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
    {
      name: "workout-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
