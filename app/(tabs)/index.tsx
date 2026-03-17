import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Pressable, Text, View } from 'react-native';
import { supabase } from '../../lib/supabase/supabase';
import { colors, globalStyles as styles } from '../styles/globalStyle'; // <-- UNIVERSAL STYLES

// --- 1. TYPES ---
type Exercise = {
  id: string | number;
  name: string;
  target_muscle_group: string;
  equipment_type?: string;
  has_weights?: boolean;
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
  const router = useRouter();
  
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
    <View style={styles.mainContainer}>
      <Text style={styles.pageTitle}>Workout History</Text>
      <Text style={styles.pageSubtitle}>Your completed workouts will appear here.</Text>

      {/* Το Floating Action Button (FAB) */}
      <Pressable 
        style={styles.fab} 
        onPress={() => {
          setModalVisible(true);
          fetchExercises(); 
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
          <View style={styles.modalBox}>
            
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select an Exercise</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>

            {loading ? (
              <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 40 }} />
            ) : (
              <FlatList
                data={exercises}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <Pressable 
                    style={styles.listItem} 
                    onPress={() => { 
                      setModalVisible(false); 
                      router.push({
                        pathname: '/exercise',
                        params: { 
                          id: item.id.toString(), // Το κάνουμε string για να μην γκρινιάζει το router
                          name: item.name,
                          equipment_type: item.equipment_type || 'barbell',
                          has_weights: item.has_weights === false ? 'false' : 'true'
                        }
                      });
                    }}
                    >
                    <Text style={styles.listItemTitle}>{item.name}</Text>
                    <Text style={styles.listItemSubtitle}>{item.target_muscle_group}</Text>
                  </Pressable>
                )}
                style={{ maxHeight: 400 }} 
              />
            )}

            <View style={styles.modalFooter}>
              <Pressable style={styles.textButton}>
                <MaterialCommunityIcons name="pencil-plus" size={20} color={colors.primary} />
                <Text style={styles.textButtonLabel}> Create New Exercise</Text>
              </Pressable>
            </View>

          </View>
        </View>
      </Modal>
    </View>
  );
}