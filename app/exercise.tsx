import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, Vibration, View } from 'react-native';
import { colors, globalStyles as styles } from './styles/globalStyle';

type EquipmentType = 'barbell' | 'machine' | 'dumbbell' | 'smith' | 'bodyweight';
type SetRecord = { id: number; weight: string; reps: string; };

export default function ExerciseScreen() {
  const router = useRouter();

  const [exerciseData] = useState({
    name: "Bench Press",
    has_weights: true,
    equipment_type: 'barbell' as EquipmentType
  });

  // --- STATES ---
  const [inSet, setInSet] = useState(true); 
  const [clock, setClock] = useState(180);
  const [weight, setWeight] = useState(exerciseData.equipment_type === 'barbell' ? '20' : '10');
  const [reps, setReps] = useState('');
  const [history, setHistory] = useState<SetRecord[]>([]);

  const numReps = parseInt(reps, 10) || 0;
  const numWeight = parseFloat(weight) || 0;
  
  // Το Finish Set παραμένει όπως το ζήτησες: Γκρι αν είναι 0, Πράσινο αν > 0.
  const canFinishSet = numReps > 0;

  useEffect(() => {
    let interval: any;
    if (!inSet) {
      interval = setInterval(() => {
        setClock(prev => {
          if (prev <= 1) {
            Vibration.vibrate();
            setInSet(true);
            return 180;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [inSet]);

  const handleMainAction = () => {
    if (inSet) {
      const newSet = { id: history.length + 1, weight, reps };
      setHistory([newSet, ...history]);
      setInSet(false);
      setClock(180);
    } else {
      // Κρατάει τις επαναλήψεις ίδιες με πριν (Reps persistence)
      setInSet(true);
    }
  };

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.floatingCard}>
        
        {/* ΤΙΤΛΟΣ ΑΣΚΗΣΗΣ */}
        <Text style={[styles.pageTitle, { marginTop: 0, fontSize: 26, textAlign: 'center' }]}>
          {exerciseData.name}
        </Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>SET {history.length + 1}</Text>
        </View>

        {/* ΡΟΛΟΙ */}
        <View style={{ marginBottom: 20, alignItems: 'center' }}>
          <Text style={[styles.timerText, { color: inSet ? '#ddd' : colors.danger }]}>
            {Math.floor(clock / 60)}:{clock % 60 < 10 ? '0' + (clock % 60) : clock % 60}
          </Text>
          {!inSet && <Text style={{ color: colors.danger, fontWeight: 'bold', textTransform: 'uppercase' }}>Resting...</Text>}
        </View>

        {/* INPUTS */}
        <View style={styles.inputRow}>
          <View style={styles.inputBox}>
            <Text style={styles.inputLabel}>Weight (kg)</Text>
            <View style={styles.stepperContainer}>
              <Pressable style={styles.stepperBtn} onPress={() => setWeight(Math.max(0, numWeight - 2.5).toString())} disabled={!inSet}>
                <Text style={styles.stepperBtnText}>-</Text>
              </Pressable>
              <TextInput 
                style={[styles.input, !inSet && styles.inputLocked]} 
                keyboardType="numeric" value={weight} 
                onChangeText={t => setWeight(t.replace(/[^0-9.]/g, ''))}
                editable={inSet}
              />
              <Pressable style={styles.stepperBtn} onPress={() => setWeight((numWeight + 2.5).toString())} disabled={!inSet}>
                <Text style={styles.stepperBtnText}>+</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.inputBox}>
            <Text style={styles.inputLabel}>Reps</Text>
            <View style={styles.stepperContainer}>
              <Pressable style={styles.stepperBtn} onPress={() => setReps(Math.max(0, numReps - 1).toString())} disabled={!inSet}>
                <Text style={styles.stepperBtnText}>-1</Text>
              </Pressable>
              <TextInput 
                style={[styles.input, !inSet && styles.inputLocked]} 
                keyboardType="numeric" value={reps} placeholder="0"
                onChangeText={t => setReps(t.replace(/[^0-9]/g, ''))}
                editable={inSet}
              />
              <Pressable style={styles.stepperBtn} onPress={() => setReps((numReps + 1).toString())} disabled={!inSet}>
                <Text style={styles.stepperBtnText}>+1</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* ΚΥΡΙΟ ΚΟΥΜΠΙ (FINISH SET / STOP REST) */}
        <Pressable
          style={[
            styles.button, 
            { backgroundColor: inSet ? (canFinishSet ? colors.success : colors.textLight) : colors.danger }
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
          <View style={{ width: '100%', marginTop: 25, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 15 }}>
            <Text style={[styles.inputLabel, { textAlign: 'left' }]}>Session History</Text>
            {history.map((item, index) => (
              <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 }}>
                <Text style={{ color: colors.textMuted, fontWeight: 'bold' }}>Set {history.length - index}</Text>
                <Text style={{ color: colors.text }}>{item.weight}kg x {item.reps}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ΤΟ DONE ΚΟΥΜΠΙ - ΠΕΤΑΕΙ ΣΤΗΝ ΑΡΧΙΚΗ */}
        <View style={{ width: '100%', marginTop: 30 }}>
          <Pressable 
            style={({ pressed }) => [
              styles.button, 
              { backgroundColor: colors.primary, opacity: pressed ? 0.7 : 1 }
            ]} 
            onPress={() => {
              console.log("Workout Done - Heading Home");
              router.replace('/'); // Σε πετάει στην αρχική οθόνη
            }}
          >
            <Text style={styles.buttonText}>Done</Text>
          </Pressable>
        </View>

      </View>
    </ScrollView>
  );
}