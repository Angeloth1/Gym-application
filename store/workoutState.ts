import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Max waiting time
const SESSION_TIMEOUT_MS = 60 * 60 * 1000;

export type SetData = {
  reps: number;
  weight: number;
  completedAt: number;
};

export type ExerciseData = {
  exerciseId: string;
  name: string;
  target_muscle_group?: string; // Το χρειαζόμαστε για τον αλγόριθμο
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
  history: CompletedWorkout[]; // Το ιστορικό μπήκε στο συμβόλαιο

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
      history: [], // Αρχικοποίηση του ιστορικού ως άδειος πίνακας

      // --- 1. ΠΡΟΣΘΗΚΗ ΣΕΤ ---
      addSet: (exerciseId, name, reps, weight) => {
        const now = Date.now();
        const { activeWorkoutId, lastActivityTimestamp, exercises } = get();
        let currentWorkoutId = activeWorkoutId;
        let currentExercises = { ...exercises };

        // time checker from last activity
        if (
          !currentWorkoutId ||
          (lastActivityTimestamp &&
            now - lastActivityTimestamp > SESSION_TIMEOUT_MS)
        ) {
          currentWorkoutId = `workout_${now}`;
          currentExercises = {};
          console.log("Started a new workout session");
        }

        const existingExercise = currentExercises[exerciseId] || {
          exerciseId,
          name,
          sets: [],
        };

        const updateExercise = {
          ...existingExercise,
          sets: [...existingExercise.sets, { reps, weight, completedAt: now }],
        };

        const nextExercise = {
          ...currentExercises,
          [exerciseId]: updateExercise,
        };

        set({
          activeWorkoutId: currentWorkoutId,
          lastActivityTimestamp: now,
          exercises: nextExercise,
        });
      },

      // --- 2. ΤΕΡΜΑΤΙΣΜΟΣ ΠΡΟΠΟΝΗΣΗΣ (Auto-Naming & Save) ---
      finishWorkout: () => {
        const { exercises, activeWorkoutId, history } = get();
        const exerciseList = Object.values(exercises);

        // Αν δεν έχει κάνει τίποτα, απλά κλείνει
        if (exerciseList.length === 0) return;

        // Auto-Naming Algorithm
        const muscleCounts: Record<string, number> = {};
        exerciseList.forEach((ex) => {
          const muscle = ex.target_muscle_group || "Mixed";
          muscleCounts[muscle] = (muscleCounts[muscle] || 0) + 1; // Το bug διορθώθηκε!
        });

        // Βρίσκει τον μυ με τις περισσότερες ασκήσεις
        const dominantMuscle = Object.keys(muscleCounts).reduce(
          (a, b) => (muscleCounts[a] > muscleCounts[b] ? a : b),
          "Full Body",
        );

        const today = new Date();
        const dateString = today.toLocaleDateString("el-GR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        const workoutName = `${dominantMuscle} Day - ${dateString}`;

        const newCompletedWorkout: CompletedWorkout = {
          id: activeWorkoutId || `workout_${Date.now()}`,
          name: workoutName,
          date: today.toISOString(),
          exercises: exerciseList,
        };

        // Πακετάρισμα, σώσιμο και καθάρισμα
        set({
          history: [newCompletedWorkout, ...history],
          exercises: {}, // Μηδενίζει για την επόμενη φορά
          activeWorkoutId: null,
          lastActivityTimestamp: null,
        });

        console.log("Workout saved to history!", workoutName);
      },
    }),
    { name: "workout-storage", storage: createJSONStorage(() => AsyncStorage) },
  ),
);
