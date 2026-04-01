import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  Text,
  View,
  ScrollView,
} from "react-native";
import { useShallow } from "zustand/react/shallow";
import { supabase } from "../../lib/supabase/supabase";
import { colors, globalStyles as styles } from "../../styles/globalStyle";
import { useWorkoutState, CompletedWorkout } from "../../store/workoutState";

export default function MainScreen() {
  const router = useRouter();

  // --- STATES ---
  const [modalVisible, setModalVisible] = useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [selectedWorkout, setSelectedWorkout] =
    useState<CompletedWorkout | null>(null);
  const [activeExpanded, setActiveExpanded] = useState(true);
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // --- ZUSTAND ---
  const history = useWorkoutState((state) => state.history);
  const checkActiveSession = useWorkoutState(
    (state) => state.checkActiveSession,
  );
  const activeExercises = useWorkoutState(
    useShallow((state) => Object.values(state.exercises)),
  );

  const totalSets = activeExercises.reduce(
    (sum, ex) => sum + ex.sets.length,
    0,
  );

  useEffect(() => {
    checkActiveSession();
    const interval = setInterval(checkActiveSession, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchExercises = async () => {
    setLoading(true);
    const { data } = await supabase.from("exercises").select("*").order("name");
    setExercises(data || []);
    setLoading(false);
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.pageTitle}>Workout Tracker</Text>

      {/* --- 1. ACTIVE SESSION --- */}
      {activeExercises.length > 0 && (
        <View style={{ marginBottom: 25 }}>
          <Pressable
            onPress={() => setActiveExpanded(!activeExpanded)}
            style={[
              styles.historyCard,
              {
                borderColor: colors.primary,
                borderWidth: 2,
                backgroundColor: "#f0f7ff",
                marginBottom: 5,
              },
            ]}
          >
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingRight: 10,
                }}
              >
                <Text
                  style={[styles.historyCardTitle, { color: colors.primary }]}
                >
                  ACTIVE SESSION
                </Text>
                <Text style={{ color: colors.primary, fontWeight: "bold" }}>
                  {totalSets} sets done
                </Text>
              </View>
              <Text style={styles.historyCardSubtitle}>
                {activeExercises.length} Exercises in progress
              </Text>
            </View>
            <MaterialCommunityIcons
              name={activeExpanded ? "chevron-up" : "chevron-down"}
              size={28}
              color={colors.primary}
            />
          </Pressable>

          {activeExpanded && (
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 12,
                paddingHorizontal: 10,
                borderLeftWidth: 3,
                borderLeftColor: colors.primary,
              }}
            >
              {activeExercises.map((ex) => (
                <Pressable
                  key={ex.exerciseDetails.id}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 15,
                    borderBottomWidth: 1,
                    borderBottomColor: "#eee",
                  }}
                  onPress={() =>
                    router.push({
                      pathname: "/exercise",
                      params: {
                        id: ex.exerciseDetails.id,
                        name: ex.exerciseDetails.name,
                        target_muscle: ex.exerciseDetails.target_muscle,
                      },
                    })
                  }
                >
                  <View>
                    <Text
                      style={{
                        fontWeight: "600",
                        color: colors.text,
                        fontSize: 15,
                      }}
                    >
                      {ex.exerciseDetails.name}
                    </Text>
                    <Text style={{ color: colors.textMuted, fontSize: 13 }}>
                      {ex.sets.length} sets so far
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name="play-circle"
                    size={24}
                    color={colors.primary}
                  />
                </Pressable>
              ))}
            </View>
          )}
        </View>
      )}

      {/* --- 2. PAST WORKOUTS --- */}
      <Text
        style={[styles.inputLabel, { textAlign: "left", marginBottom: 15 }]}
      >
        Past Workouts
      </Text>

      <FlatList
        data={history}
        keyExtractor={(item) => item.workout.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            style={styles.historyCard}
            onPress={() => {
              setSelectedWorkout(item);
              setHistoryModalVisible(true);
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.historyCardTitle}>{item.workout.title}</Text>
              <Text style={styles.historyCardSubtitle}>
                {item.exercises.length} Exercises •{" "}
                {new Date(item.workout.created_at).toLocaleDateString("el-GR")}
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={colors.textMuted}
            />
          </Pressable>
        )}
      />

      {/* FAB */}
      <Pressable
        style={styles.fab}
        onPress={() => {
          setModalVisible(true);
          fetchExercises();
        }}
      >
        <MaterialCommunityIcons name="plus" size={30} color="white" />
      </Pressable>

      {/* --- 3. MODAL: ΛΕΠΤΟΜΕΡΕΙΕΣ ΙΣΤΟΡΙΚΟΥ --- */}
      <Modal visible={historyModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { maxHeight: "85%" }]}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>
                  {selectedWorkout?.workout.title}
                </Text>
                <Text style={{ color: colors.textMuted }}>
                  {selectedWorkout
                    ? new Date(
                        selectedWorkout.workout.created_at,
                      ).toLocaleDateString()
                    : ""}
                </Text>
              </View>
              <Pressable onPress={() => setHistoryModalVisible(false)}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={colors.text}
                />
              </Pressable>
            </View>

            <ScrollView style={{ padding: 20 }}>
              {selectedWorkout?.exercises.map((ex, idx) => (
                <View
                  key={idx}
                  style={{
                    marginBottom: 25,
                    borderBottomWidth: 1,
                    borderBottomColor: "#f0f0f0",
                    paddingBottom: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      color: colors.primary,
                      marginBottom: 8,
                    }}
                  >
                    {ex.exerciseDetails.name}
                  </Text>
                  {ex.sets.map((set, sIdx) => (
                    <View
                      key={sIdx}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingVertical: 5,
                      }}
                    >
                      <Text style={{ color: colors.text, fontSize: 14 }}>
                        Set {set.set_number}
                      </Text>
                      <Text style={{ fontWeight: "600", fontSize: 14 }}>
                        {set.weight}kg x {set.reps} reps
                      </Text>
                    </View>
                  ))}
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* --- 4. MODAL: ΕΠΙΛΟΓΗ ΝΕΑΣ ΑΣΚΗΣΗΣ --- */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose Exercise</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={colors.text}
                />
              </Pressable>
            </View>
            <FlatList
              data={exercises}
              style={{ maxHeight: 450 }}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.listItem}
                  onPress={() => {
                    setModalVisible(false);
                    router.push({
                      pathname: "/exercise",
                      params: { ...item, id: item.id.toString() },
                    });
                  }}
                >
                  <Text style={styles.listItemTitle}>{item.name}</Text>
                  <Text style={styles.listItemSubtitle}>
                    {item.target_muscle}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
