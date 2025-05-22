import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Text } from "react-native-paper";
import { useShallow } from "zustand/react/shallow";
import WorkoutViewer from "../../../components/pages/WorkoutViewer";
import Header from "../../../components/ui/Header";
import { ThemedView } from "../../../components/ui/screen/Screen";
import { handleError } from "../../../lib/errorHandler";
import { useAuthStore } from "../../../store/auth-store";
import { useWorkoutStore } from "../../../store/workout-store";

/**
 * Pàgina de finalització d'un entrenament.
 * Desa l'entrenament actual a l'API, mostra l'estat de la petició i el resum de l'entrenament.
 * @returns {JSX.Element} El component de la pàgina de finalització d'entrenament.
 */
export default function FinishWorkoutPage() {
  const queryClient = useQueryClient();
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );
  const cancelWorkout = useWorkoutStore((state) => state.cancelWorkout);

  // Obté les dades de l'entrenament actual des de l'store
  const workoutStore = useWorkoutStore(
    useShallow((state) => ({
      uuid: state.uuid,
      title: state.title,
      timestamp: state.timestamp,
      description: state.description,
      exercises: state.exercises,
    })),
  );

  // Estat per controlar la càrrega i errors globals
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string | null>("NOT STARTED");

  // Calcula la durada de l'entrenament en segons
  const now = new Date() as unknown as number;
  const duration = (now - workoutStore.timestamp) / 1000;

  // Objecte workout amb la durada calculada
  const workoutData = { ...workoutStore, duration: duration };

  /**
   * Envia les dades de l'entrenament a l'API per desar-lo.
   * Si té èxit, neteja l'store i invalida la cache de la llista d'entrenaments.
   * En cas d'error, mostra el missatge d'error.
   */
  const postData = async () => {
    setIsLoading(true);
    setGlobalError("");
    try {
      await apiClient.post(
        "/user/workouts",
        {
          uuid: workoutStore.uuid,
          name: workoutStore.title,
          description: workoutStore.description,
          instance: {
            timestamp_start: Math.trunc(workoutStore.timestamp),
            duration: Math.trunc(duration),
          },
          entries: workoutStore.exercises.map((exercise) => ({
            rest_countdown_duration: exercise.restCountdownDuration,
            weight_unit: exercise.weightUnit,
            exercise: {
              uuid: exercise.exercise.uuid,
              name: exercise.exercise.name,
              description: exercise.exercise.description,
              body_part: exercise.exercise.bodyPart,
              type: exercise.exercise.type,
            },
            sets: exercise.sets.map((set) => ({
              reps: set.reps,
              weight: set.weight,
              set_type: set.type,
            })),
          })),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      // Neteja l'store d'entrenament i actualitza la llista d'entrenaments
      cancelWorkout();
      queryClient.invalidateQueries({ queryKey: ["user", "/user/workouts"] });
    } catch (error: unknown) {
      setGlobalError(handleError(error));
    }
    setIsLoading(false);
  };

  // Desa l'entrenament automàticament quan es carrega la pàgina
  useEffect(() => {
    postData();
  }, []);

  return (
    <ThemedView className="flex-1">
      <Header title="Finished workout" />

      {/* Mostra l'estat de la petició: carregant, èxit o error */}
      <View className="flex-row px-4 pb-4 gap-4 justify-center">
        {isLoading && (
          <>
            <ActivityIndicator />
            <Text variant="bodyLarge">Workout saved successfully!</Text>
          </>
        )}
        {!isLoading && !globalError && (
          <Text variant="bodyLarge">Workout saved successfully!</Text>
        )}
        {!isLoading && globalError && (
          <Text variant="bodyLarge">{globalError}</Text>
        )}
      </View>

      {/* Mostra el resum de l'entrenament acabat */}
      <WorkoutViewer workout={workoutData} />
    </ThemedView>
  );
}
