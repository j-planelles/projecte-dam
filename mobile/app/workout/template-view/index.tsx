import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Appbar } from "react-native-paper";
import { useShallow } from "zustand/react/shallow";
import { SaveIcon } from "../../../components/Icons";
import WorkoutEditor from "../../../components/pages/WorkoutEditor";
import Header from "../../../components/ui/Header";
import { ThemedView } from "../../../components/ui/screen/Screen";
import { handleError } from "../../../lib/errorHandler";
import { useAuthStore } from "../../../store/auth-store";
import { useWorkoutStore } from "../../../store/workout-store";

/**
 * Component de pàgina per crear una nova plantilla d'entrenament.
 * Utilitza el component `WorkoutEditor` per construir la plantilla i un botó per desar-la.
 * @returns {JSX.Element} El component de la pàgina de creació de plantilles.
 */
export default function CreateTemplatePage() {
  return (
    <ThemedView className="flex-1" avoidKeyboard={false}>
      <Header title="Create Template">
        <SaveButton />
      </Header>

      <WorkoutEditorComponent />
    </ThemedView>
  );
}

/**
 * Component de botó que gestiona la lògica per desar la plantilla d'entrenament actual.
 * Obté les dades de l'entrenament des de `useWorkoutStore` i les envia a l'API.
 * @returns {JSX.Element} El component del botó de desar.
 */
const SaveButton = () => {
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
   * Gestiona l'enviament de les dades de la plantilla a l'API.
   * Si té èxit, invalida la consulta de plantilles i navega a la vista de la nova plantilla.
   * En cas d'error, el registra a la consola.
   */
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Invalida la consulta de plantilles per assegurar que la llista s'actualitza després de crear-ne una de nova
      queryClient.invalidateQueries({
        queryKey: ["user", "/user/templates"],
      });
      // Realitza la petició POST per crear la nova plantilla
      const response = await apiClient.post(
        "/user/templates",
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
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      router.replace(`/workout/template-view/${response.uuid}`);
    } catch (error: unknown) {
      console.error(handleError(error));
    }
    setIsLoading(false);
  };

  return (
    <Appbar.Action
      icon={(props) => <SaveIcon {...props} />}
      onPress={handleSubmit}
      loading={isLoading}
      animated={false}
    />
  );
};

/**
 * Component que embolcalla el `WorkoutEditor`.
 * S'encarrega de carregar un entrenament buit quan el component es munta,
 * preparant l'editor per a la creació d'una nova plantilla.
 * @returns {JSX.Element} El component `WorkoutEditor` configurat per a la creació de plantilles.
 */
const WorkoutEditorComponent = () => {
  const loadEmptyWorkout = useWorkoutStore((state) => state.loadEmptyWorkout);

  // Efecte que s'executa un cop quan el component es munta
  useEffect(() => {
    loadEmptyWorkout(); // Carrega un entrenament buit per començar a crear la plantilla
  }, [loadEmptyWorkout]);

  return <WorkoutEditor showTimer={false} showCheckboxes={false} />;
};