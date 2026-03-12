import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../../lib/supabase/supabase';

// --- 1. TYPES ---
type Exercise = {
  id: string | number;
  name: string;
  target_muscle_group: string;
};

type WorkoutSet = {
  weight: number;
  reps: number;
};

type ActiveExercise = {
  id: string | number;
  name: string;
  target_muscle_group: string;
  sets: WorkoutSet[];
};

// --- 2. MAIN COMPONENT ---
export default function MainScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeWorkout, setActiveWorkout] = useState<ActiveExercise[]>([]);

  const addExerciseToWorkout = (exerciseFromDb: Exercise) => {
    const newExercise: ActiveExercise = {
      id: exerciseFromDb.id,
      name: exerciseFromDb.name,
      target_muscle_group: exerciseFromDb.target_muscle_group,
      sets: []  
    };

    setActiveWorkout([...activeWorkout, newExercise]);
    setModalVisible(false);
  };

  const fetchExercises = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Σφάλμα Supabase:', error.message);
    } else {
      setExercises(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  // --- 3. UI (ΕΜΦΑΝΙΣΗ) ---
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout History</Text>
      <Text style={styles.subtitle}>Your completed workouts will appear here.</Text>

      {/* Το Floating Action Button (FAB) - ΔΙΟΡΘΩΜΕΝΟ */}
      <Pressable 
        style={styles.fab} 
        onPress={() => {
          setModalVisible(true);
          fetchExercises(); // Τραβάει φρέσκα δεδομένα κάθε φορά που πατάς το +
        }}
      >
        <MaterialCommunityIcons name="plus" size={30} color="white" />
      </Pressable>

      {/* Το "Floater" Modal */}
      <Modal 
        visible={modalVisible} 
        animationType="fade" 
        transparent={true}   
        onRequestClose={() => setModalVisible(false)} 
      >
        <View style={styles.modalOverlay}>
          <View style={styles.floatingBox}>
            
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select an Exercise</Text>
              <Pressable onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <MaterialCommunityIcons name="close" size={24} color="#333" />
              </Pressable>
            </View>

            {loading ? (
              <ActivityIndicator size="large" color="#007AFF" style={{ marginVertical: 40 }} />
            ) : (
              <FlatList
                data={exercises}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <Pressable style={styles.exerciseItem} onPress={() => addExerciseToWorkout(item)}>
                    <Text style={styles.exerciseName}>{item.name}</Text>
                    <Text style={styles.exerciseMuscle}>{item.target_muscle_group}</Text>
                  </Pressable>
                )}
                style={{ maxHeight: 400 }} 
              />
            )}

            <View style={styles.modalFooter}>
              <Pressable style={styles.customExerciseButton}>
                <MaterialCommunityIcons name="pencil-plus" size={20} color="#007AFF" />
                <Text style={styles.customExerciseText}> Create New Exercise</Text>
              </Pressable>
            </View>

          </View>
        </View>
      </Modal>
    </View>
  );
}

// --- 4. STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', paddingTop: 20, paddingHorizontal: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111', marginTop: 20 },
  subtitle: { fontSize: 16, color: '#666', marginTop: 10 },
  
  fab: { 
    position: 'absolute', bottom: 30, right: 30, backgroundColor: '#007AFF', 
    width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', 
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5 
  },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  floatingBox: { width: '100%', backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 10 },
  
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  closeButton: { padding: 5 },
  
  exerciseItem: { paddingVertical: 15, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  exerciseName: { fontSize: 16, fontWeight: '600', color: '#333' },
  exerciseMuscle: { fontSize: 14, color: '#888', marginTop: 4 },
  
  modalFooter: { padding: 15, borderTopWidth: 1, borderTopColor: '#eee', alignItems: 'center', backgroundColor: '#fafafa' },
  customExerciseButton: { flexDirection: 'row', alignItems: 'center', padding: 5 },
  customExerciseText: { color: '#007AFF', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
});