import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { ActivityIndicator, View } from "react-native";
import { Button, HelperText, Text } from "react-native-paper";
import { useShallow } from "zustand/react/shallow";
import WorkoutViewer from "../../../components/pages/WorkoutViewer";
import Header from "../../../components/ui/Header";
import { ThemedView } from "../../../components/ui/screen/Screen";
import { useAuthStore } from "../../../store/auth-store";
import { useWorkoutStore } from "../../../store/workout-store";

/**
 * Pàgina per visualitzar una plantilla d'entrenament de la comunitat.
 * Mostra la informació de la plantilla i permet iniciar un entrenament a partir d'aquesta.
 * @returns {JSX.Element} El component de la pàgina de visualització de plantilles comunitàries.
 */
export default function ViewCommunityTemplatePage() {
  const { uuid } = useLocalSearchParams();
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  // Consulta la plantilla recomanada per l'entrenador a l'API
  const { data, isLoading, isSuccess, error } = useQuery({
    queryKey: ["user", "trainer", "/user/trainer/recommendation", uuid],
    queryFn: async () =>
      await apiClient.get("/user/trainer/recommendation/:workout_uuid", {
        params: { workout_uuid: uuid.toString() },
        headers: { Authorization: `Bearer ${token}` },
      }),
  });

  /**
   * Construeix l'objecte workout a partir de les dades rebudes de l'API.
   * Utilitza useMemo per evitar càlculs innecessaris.
   */
  const workout = useMemo(
    () =>
      ({
        uuid: data?.uuid,
        title: data?.name,
        description: data?.description,
        timestamp: data?.instance?.timestamp_start || 0,
        duration: data?.instance?.duration || 0,
        exercises: data?.entries.map((entry) => ({
          restCountdownDuration: entry.rest_countdown_duration,
          weightUnit: entry.weight_unit,
          exercise: {
            uuid: entry.exercise.uuid,
            name: entry.exercise.name,
            description: entry.exercise.description,
            userNote: entry.exercise.user_note,
            bodyPart: entry.exercise.body_part,
            type: entry.exercise.type,
          },
          sets: entry.sets.map((set) => ({
            reps: set.reps,
            weight: set.weight,
            type: set.set_type,
          })),
        })),
      }) as workout,
    [data],
  );

  return (
    <ThemedView className="flex-1">
      <Header title="View Community Template" />

      {/* Mostra un indicador de càrrega mentre es carrega la plantilla */}
      {isLoading && (
        <View className="flex-1 justify-center">
          <ActivityIndicator size={"large"} />
        </View>
      )}
      {/* Mostra un missatge d'error si la consulta falla */}
      {error && <Text>{error.message}</Text>}
      {/* Mostra la plantilla i el botó per començar l'entrenament si la consulta té èxit */}
      {isSuccess && (
        <>
          <WorkoutViewer
            workout={workout}
            timestamp={false}
          />

          <View className="p-4">
            <StartWorkoutButton workout={workout} />
          </View>
        </>
      )}
    </ThemedView>
  );
}

/**
 * Botó per iniciar un entrenament a partir de la plantilla visualitzada.
 * Si ja hi ha un entrenament en curs, mostra un missatge informatiu i desactiva el botó.
 * @param workout L'entrenament a iniciar.
 * @returns {JSX.Element} El component del botó per començar l'entrenament.
 */
const StartWorkoutButton = ({ workout }: { workout: workout }) => {
  const router = useRouter();
  const { startWorkout, isOngoingWorkout } = useWorkoutStore(
    useShallow((state) => ({
      startWorkout: state.startWorkout,
      isOngoingWorkout: state.isOngoingWorkout,
    })),
  );

  // Handler per iniciar l'entrenament i navegar a la vista d'entrenament en curs
  const startWorkoutHandler = () => {
    startWorkout(workout);
    router.replace("/workout/ongoing/");
  };

  return (
    <>
      {isOngoingWorkout && (
        <HelperText type="info">A workout is already in progress.</HelperText>
      )}
      <Button
        mode="contained"
        disabled={isOngoingWorkout}
        onPress={startWorkoutHandler}
      >
        Start workout
      </Button>
    </>
  );
};
