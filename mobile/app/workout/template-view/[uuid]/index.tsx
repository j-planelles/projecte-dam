import { useQuery } from "@tanstack/react-query";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { ActivityIndicator, View } from "react-native";
import { Appbar, Button, HelperText, Text } from "react-native-paper";
import { useShallow } from "zustand/react/shallow";
import { EditIcon } from "../../../../components/Icons";
import WorkoutViewer from "../../../../components/pages/WorkoutViewer";
import Header from "../../../../components/ui/Header";
import { ThemedView } from "../../../../components/ui/screen/Screen";
import { useAuthStore } from "../../../../store/auth-store";
import { useWorkoutStore } from "../../../../store/workout-store";

/**
 * Component de pàgina per visualitzar una plantilla d'entrenament.
 * Carrega la plantilla des de l'API utilitzant l'UUID proporcionat i mostra la informació
 * mitjançant el component `WorkoutViewer`. També permet iniciar un entrenament a partir de la plantilla
 * i editar-la si no hi ha un entrenament en curs.
 * @returns {JSX.Element} El component de la pàgina de visualització de plantilles.
 */
export default function ViewTemplatePage() {
  const { uuid } = useLocalSearchParams();
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  // Consulta la plantilla a l'API utilitzant React Query
  const { data, isLoading, isSuccess, error } = useQuery({
    queryKey: ["user", "/user/templates", uuid],
    queryFn: async () =>
      await apiClient.get("/user/templates/:template_uuid", {
        params: { template_uuid: uuid.toString() },
        headers: { Authorization: `Bearer ${token}` },
      }),
  });

  // Construeix l'objecte workout a partir de les dades rebudes de l'API
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
      <Header title="View Template">
        <EditWorkoutButton />
      </Header>
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
          <WorkoutViewer workout={workout} timestamp={false} />

          <View className="p-4">
            <StartWorkoutButton workout={workout} />
          </View>
        </>
      )}
    </ThemedView>
  );
}

/**
 * Component de botó per iniciar un entrenament a partir de la plantilla visualitzada.
 * Si ja hi ha un entrenament en curs, mostra un missatge informatiu i desactiva el botó.
 * @param {workout} workout - L'entrenament a iniciar.
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
      {/* Mostra un missatge si ja hi ha un entrenament en curs */}
      {isOngoingWorkout && (
        <HelperText type="info">
          A workout is already in progress. Stop it to start a new one or to
          edit a template.
        </HelperText>
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

/**
 * Component de botó per editar la plantilla visualitzada.
 * Navega a la pàgina d'edició de la plantilla. El botó està desactivat si hi ha un entrenament en curs.
 * @returns {JSX.Element} El component del botó d'edició.
 */
const EditWorkoutButton = () => {
  const { uuid } = useLocalSearchParams();
  const isOngoingWorkout = useWorkoutStore((state) => state.isOngoingWorkout);

  return (
    <Link asChild href={`/workout/template-view/${uuid}/edit`}>
      <Appbar.Action
        animated={false}
        icon={({ color }) => <EditIcon color={color} />}
        disabled={isOngoingWorkout}
      />
    </Link>
  );
};
