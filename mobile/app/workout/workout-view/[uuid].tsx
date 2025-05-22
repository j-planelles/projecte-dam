import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Button, HelperText } from "react-native-paper";
import { useShallow } from "zustand/react/shallow";
import WorkoutViewer from "../../../components/pages/WorkoutViewer";
import Header from "../../../components/ui/Header";
import { ThemedView } from "../../../components/ui/screen/Screen";
import { handleError } from "../../../lib/errorHandler";
import { useAuthStore } from "../../../store/auth-store";

/**
 * Component de pàgina per visualitzar els detalls d'un entrenament específic.
 * Obté l'UUID de l'entrenament dels paràmetres locals de la ruta,
 * cerca les dades de l'entrenament i les mostra.
 * També ofereix l'opció de desar l'entrenament com a plantilla.
 * @returns {JSX.Element} El component de la pàgina de visualització d'entrenament.
 */
export default function ViewWorkoutPage() {
  const { uuid } = useLocalSearchParams();
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  // Consulta per obtenir les dades de l'entrenament específic
  const { data, isLoading, isSuccess, error } = useQuery({
    queryKey: ["user", "/user/workouts", uuid],
    queryFn: async () =>
      await apiClient.get("/user/workouts/:workout_uuid", {
        params: { workout_uuid: uuid.toString() },
        headers: { Authorization: `Bearer ${token}` },
      }),
    enabled: !!uuid, // La consulta només s'executa si l'UUID està present
  });

  // Memoritza i transforma les dades de l'entrenament al format esperat
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
      <Header title="View Workout" />
      {isLoading && (
        <View className="flex-1 justify-center">
          <ActivityIndicator size={"large"} />
        </View>
      )}
      {error && <Text>{error.message}</Text>}
      {isSuccess && (
        <>
          <WorkoutViewer workout={workout} />

          <View className="p-4">
            <SaveAsTemplateButton workout={workout} />
          </View>
        </>
      )}
    </ThemedView>
  );
}

/**
 * Component de botó que permet a l'usuari desar l'entrenament actual com una nova plantilla.
 * Realitza una petició POST a l'API per crear la plantilla.
 * @param {object} props - Propietats del component.
 * @param {workout} props.workout - L'objecte de l'entrenament que es desarà com a plantilla.
 * @returns {JSX.Element} El component del botó per desar com a plantilla.
 */
const SaveAsTemplateButton = ({ workout }: { workout: workout }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [queryError, setQueryError] = useState<string | null>(null);

  /**
   * Gestiona l'acció de desar l'entrenament com a plantilla.
   * Envia les dades de l'entrenament a l'API i, si té èxit,
   * invalida la consulta de plantilles i navega a la vista de la nova plantilla.
   */
  const saveAsTemplateHandler = async () => {
    setIsLoading(true);
    setQueryError(null);
    try {
      const response = await apiClient.post(
        "/user/templates",
        {
          uuid: workout.uuid,
          name: workout.title,
          description: workout.description,
          entries: workout.exercises.map((exercise) => ({
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
          headers: { Authorization: `Bearer ${token}` }, // Capçalera d'autorització
        },
      );
      // Invalida la consulta de plantilles per assegurar que la llista s'actualitza
      queryClient.invalidateQueries({ queryKey: ["user", "/user/templates"] });
      router.push(`/workout/template-view/${response.uuid}`);
    } catch (error: unknown) {
      // Gestiona els errors de la petició i els mostra a l'usuari
      setQueryError(handleError(error));
    }
    setIsLoading(false);
  };

  return (
    <>
      {/* Mostra missatges d'error si n'hi ha */}
      <HelperText type="error" visible={!!queryError}>{queryError}</HelperText>
      <Button
        mode="contained"
        disabled={isLoading}
        onPress={saveAsTemplateHandler}
      >
        Save as template
      </Button>
    </>
  );
};