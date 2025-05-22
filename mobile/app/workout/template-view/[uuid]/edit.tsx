import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import {
  Appbar,
  Button,
  Dialog,
  Portal,
  Snackbar,
  Text,
} from "react-native-paper";
import { useShallow } from "zustand/react/shallow";
import { SaveIcon, TrashCanIcon } from "../../../../components/Icons";
import WorkoutEditor from "../../../../components/pages/WorkoutEditor";
import Header from "../../../../components/ui/Header";
import { ThemedView } from "../../../../components/ui/screen/Screen";
import { handleError } from "../../../../lib/errorHandler";
import { useAuthStore } from "../../../../store/auth-store";
import { useWorkoutStore } from "../../../../store/workout-store";

/**
 * Component de pàgina per editar una plantilla d'entrenament existent.
 * Mostra l'editor de plantilles i els botons per desar o eliminar la plantilla.
 * @returns {JSX.Element} El component de la pàgina d'edició de plantilles.
 */
export default function EditTemplatePage() {
  return (
    <ThemedView className="flex-1" avoidKeyboard={false}>
      <Header title="Edit Template">
        <DeleteButton />
        <SaveButton />
      </Header>
      <WorkoutEditorComponent />
    </ThemedView>
  );
}

/**
 * Component de botó que gestiona la lògica per desar els canvis a la plantilla d'entrenament.
 * Obté les dades de l'entrenament des de l'store i les envia a l'API mitjançant una petició PUT.
 * @returns {JSX.Element} El component del botó de desar.
 */
const SaveButton = () => {
  const { uuid } = useLocalSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  // Obté les dades de l'entrenament actual des de l'store d'entrenaments
  const workoutStore = useWorkoutStore(
    useShallow((state) => ({
      uuid: state.uuid,
      title: state.title,
      timestamp: state.timestamp,
      description: state.description,
      exercises: state.exercises,
    })),
  );

  const [isLoading, setIsLoading] = useState<boolean>(false); // Estat per controlar la càrrega de la petició

  /**
   * Gestiona l'enviament de les dades modificades de la plantilla a l'API.
   * Si té èxit, invalida la consulta de plantilles i torna enrere a la vista anterior.
   * En cas d'error, el registra a la consola.
   */
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Invalida la consulta de plantilles per assegurar que la llista s'actualitza després de l'edició
      queryClient.invalidateQueries({
        queryKey: ["user", "/user/templates"],
      });
      // Realitza la petició PUT per actualitzar la plantilla
      await apiClient.put(
        "/user/templates/:template_uuid",
        {
          uuid: workoutStore.uuid,
          name: workoutStore.title,
          description: workoutStore.description,
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
          params: { template_uuid: uuid.toString() },
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      router.back();
    } catch (error: unknown) {
      console.error(handleError(error));
    }
    setIsLoading(false);
  };

  return (
    <Appbar.Action
      animated={false}
      icon={(props) => <SaveIcon {...props} />}
      onPress={handleSubmit}
      loading={isLoading}
    />
  );
};

/**
 * Component de botó que gestiona la lògica per eliminar la plantilla d'entrenament.
 * Mostra un diàleg de confirmació abans d'eliminar i un Snackbar en cas d'error.
 * @returns {JSX.Element} El component del botó d'eliminar.
 */
const DeleteButton = () => {
  const { uuid } = useLocalSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  const [isLoading, setIsLoading] = useState<boolean>(false); // Estat per controlar la càrrega de la petició
  const [visible, setVisible] = useState<boolean>(false); // Estat per mostrar/ocultar el diàleg de confirmació
  const [queryError, setQueryError] = useState<string | null>(null); // Estat per mostrar errors

  /**
   * Gestiona l'eliminació de la plantilla a l'API.
   * Si té èxit, invalida la consulta de plantilles i navega a la pàgina principal.
   * En cas d'error, mostra un missatge d'error.
   */
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      queryClient.invalidateQueries({
        queryKey: ["user", "/user/templates"],
      });
      await apiClient.delete("/user/templates/:template_uuid", undefined, {
        params: { template_uuid: uuid.toString() },
        headers: { Authorization: `Bearer ${token}` },
      });
      router.replace("/"); // Navega a la pàgina principal després d'eliminar
    } catch (error: unknown) {
      console.error(handleError(error));
      setQueryError("Error deleting template.");
    }
    setIsLoading(false);
  };

  return (
    <>
      {/* Botó per mostrar el diàleg de confirmació d'eliminació */}
      <Appbar.Action
        animated={false}
        icon={(props) => <TrashCanIcon {...props} />}
        onPress={() => setVisible(true)}
        loading={isLoading}
      />
      {/* Diàleg de confirmació */}
      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Do you wish to delete this template?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)}>No</Button>
            <Button onPress={handleSubmit}>Yes</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      {/* Snackbar per mostrar errors d'eliminació */}
      <Portal>
        <Snackbar visible={!!queryError} onDismiss={() => setQueryError(null)}>
          Failed to remove template. Please remove any recommendations to users
          in the desktop app and try again. {queryError}
        </Snackbar>
      </Portal>
    </>
  );
};

/**
 * Component que embolcalla el `WorkoutEditor` per editar una plantilla existent.
 * Carrega la plantilla des de l'API quan el component es munta i la desa a l'store.
 * Mostra un indicador de càrrega mentre es carrega la plantilla i un missatge d'error si falla.
 * @returns {JSX.Element} El component `WorkoutEditor` configurat per a l'edició de plantilles.
 */
const WorkoutEditorComponent = () => {
  const { uuid } = useLocalSearchParams();
  const loadWorkout = useWorkoutStore((state) => state.loadWorkout);
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );
  // Consulta la plantilla a l'API utilitzant React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ["user", "/user/templates", uuid],
    queryFn: async () =>
      await apiClient.get("/user/templates/:template_uuid", {
        params: { template_uuid: uuid.toString() },
        headers: { Authorization: `Bearer ${token}` },
      }),
  });

  // Carrega la plantilla a l'store quan es reben les dades
  useEffect(() => {
    if (data) {
      const workout = {
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
      } as workout;

      loadWorkout(workout);
    }
  }, [data]);

  return (
    <>
      {/* Mostra un missatge d'error si la consulta falla */}
      {error && <Text>{error.message}</Text>}
      {/* Mostra un indicador de càrrega mentre es carrega la plantilla */}
      {isLoading ? (
        <View className="flex-1 justify-center">
          <ActivityIndicator size={"large"} />
        </View>
      ) : (
        <WorkoutEditor showTimer={false} showCheckboxes={false} />
      )}
    </>
  );
};
