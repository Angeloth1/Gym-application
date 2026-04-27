import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  Vibration,
  View,
} from "react-native";
import { colors, globalStyles as styles } from "../styles/globalStyle";
import { useWorkoutState } from "../store/workoutState";
import { Exercise } from "../types/database";

type SetRecord = { id: number; weight: string; reps: string };

export default function ExerciseScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const exerciseData: Exercise = {
    id: params.id as string,
    name: (params.name as string) || "Unknown Exercise",
    target_muscle: (params.target_muscle as string) || null,
    equipment_type: (params.equipment_type as string) || "barbell",
    has_weights: params.has_weights === "true",
  } as Exercise;

  // --- STATES ---
  const [inSet, setInSet] = useState(true);
  const [clock, setClock] = useState(0);
  const [weight, setWeight] = useState(
    exerciseData.equipment_type === "barbell" ? "20" : "10",
  );
  const [reps, setReps] = useState("");
  const [history, setHistory] = useState<SetRecord[]>([]);

  // --- ZUSTAND: Ασφαλής εξαγωγή δεδομένων (Zero Infinite Loops) ---
  const addSet = useWorkoutState((state) => state.addSet);
  const restEndTime = useWorkoutState((state) => state.restEndTime);
  const startRest = useWorkoutState((state) => state.startRest);
  const clearRest = useWorkoutState((state) => state.clearRest);

  const numReps = parseInt(reps, 10) || 0;
  const numWeight = parseFloat(weight) || 0;
  const canFinishSet = numReps > 0;

  // --- Ο ΝΕΟΣ ΚΙΝΗΤΗΡΑΣ (TIMESTAMP MATH) ---
  useEffect(() => {
    let interval: any;

    if (restEndTime) {
      setInSet(false);

      interval = setInterval(() => {
        const now = Date.now();
        const remainingMs = restEndTime - now;

        if (remainingMs <= 0) {
          Vibration.vibrate();
          clearRest();
          setInSet(true);
          setClock(0);
        } else {
          setClock(Math.ceil(remainingMs / 1000));
        }
      }, 500);
    } else {
      setInSet(true);
      setClock(180);
    }

    return () => clearInterval(interval);
  }, [restEndTime, clearRest]);

  // --- ACTION HANDLER ---
  const handleMainAction = () => {
    if (inSet) {
      const newSet = { id: history.length + 1, weight, reps };
      setHistory([newSet, ...history]);

      addSet(exerciseData, Number(reps), Number(weight));

      // Ξεκινάμε το απόλυτο ρολόι (3 λεπτά = 180.000 ms)
      startRest(180000);
    } else {
      // Αν πατήσει Stop Rest νωρίτερα, καθαρίζουμε το target
      clearRest();
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 60,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.floatingCard}>
        {/* ΤΙΤΛΟΣ ΑΣΚΗΣΗΣ */}
        <Text
          style={[
            styles.pageTitle,
            { marginTop: 0, fontSize: 26, textAlign: "center" },
          ]}
        >
          {exerciseData.name}
        </Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>SET {history.length + 1}</Text>
        </View>

        {/* ΡΟΛΟΙ */}
        <View style={{ marginBottom: 20, alignItems: "center" }}>
          <Text
            style={[
              styles.timerText,
              { color: inSet ? "#ddd" : colors.danger },
            ]}
          >
            {Math.floor(clock / 60)}:
            {clock % 60 < 10 ? "0" + (clock % 60) : clock % 60}
          </Text>
          {!inSet && (
            <Text
              style={{
                color: colors.danger,
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              Resting...
            </Text>
          )}
        </View>

        {/* INPUTS */}
        <View style={styles.inputRow}>
          <View style={styles.inputBox}>
            <Text style={styles.inputLabel}>Weight (kg)</Text>
            <View style={styles.stepperContainer}>
              <Pressable
                style={styles.stepperBtn}
                onPress={() =>
                  setWeight(Math.max(0, numWeight - 2.5).toString())
                }
                disabled={!inSet}
              >
                <Text style={styles.stepperBtnText}>-</Text>
              </Pressable>
              <TextInput
                style={[styles.input, !inSet && styles.inputLocked]}
                keyboardType="numeric"
                value={weight}
                onChangeText={(t) => setWeight(t.replace(/[^0-9.]/g, ""))}
                editable={inSet}
              />
              <Pressable
                style={styles.stepperBtn}
                onPress={() => setWeight((numWeight + 2.5).toString())}
                disabled={!inSet}
              >
                <Text style={styles.stepperBtnText}>+</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.inputBox}>
            <Text style={styles.inputLabel}>Reps</Text>
            <View style={styles.stepperContainer}>
              <Pressable
                style={styles.stepperBtn}
                onPress={() => setReps(Math.max(0, numReps - 1).toString())}
                disabled={!inSet}
              >
                <Text style={styles.stepperBtnText}>-1</Text>
              </Pressable>
              <TextInput
                style={[styles.input, !inSet && styles.inputLocked]}
                keyboardType="numeric"
                value={reps}
                placeholder="0"
                onChangeText={(t) => setReps(t.replace(/[^0-9]/g, ""))}
                editable={inSet}
              />
              <Pressable
                style={styles.stepperBtn}
                onPress={() => setReps((numReps + 1).toString())}
                disabled={!inSet}
              >
                <Text style={styles.stepperBtnText}>+1</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* ΚΥΡΙΟ ΚΟΥΜΠΙ */}
        <Pressable
          style={[
            styles.button,
            {
              backgroundColor: inSet
                ? canFinishSet
                  ? colors.success
                  : colors.textLight
                : colors.danger,
            },
          ]}
          onPress={handleMainAction}
          disabled={inSet && !canFinishSet}
        >
          <Text style={styles.buttonText}>
            {inSet ? "Finish Set" : "Stop Rest"}
          </Text>
        </Pressable>

        {/* ΙΣΤΟΡΙΚΟ ΣΥΝΕΔΡΙΑΣ */}
        {history.length > 0 && (
          <View
            style={{
              width: "100%",
              marginTop: 25,
              borderTopWidth: 1,
              borderTopColor: colors.border,
              paddingTop: 15,
            }}
          >
            <Text style={[styles.inputLabel, { textAlign: "left" }]}>
              Session History
            </Text>
            {history.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 5,
                }}
              >
                <Text style={{ color: colors.textMuted, fontWeight: "bold" }}>
                  Set {history.length - index}
                </Text>
                <Text style={{ color: colors.text }}>
                  {item.weight}kg x {item.reps}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* ΤΟ DONE ΚΟΥΜΠΙ */}
        <View style={{ width: "100%", marginTop: 30 }}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: colors.primary, opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={() => {
              clearRest();
              router.replace("/");
            }}
          >
            <Text style={styles.buttonText}>Done</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
