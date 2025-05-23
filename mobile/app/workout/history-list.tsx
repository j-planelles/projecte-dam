import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, View, Text } from "react-native";
import { useShallow } from "zustand/react/shallow";
import Header from "../../components/ui/Header";
import { ThemedView } from "../../components/ui/screen/Screen";
import WorkoutCard from "../../components/ui/WorkoutCard";
import { useAuthStore } from "../../store/auth-store";
import { useMemo } from "react";

/**
 * Component de pàgina que mostra una llista de l'historial d'entrenaments de l'usuari.
 * Obté les dades dels entrenaments des de l'API i les mostra en una llista.
 * @returns {JSX.Element} El component de la pàgina de llista d'historial d'entrenaments.
 */
export default function TemplatesListPage() {
  const router = useRouter();
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  // Consulta per obtenir l'historial d'entrenaments de l'usuari
  const { data, isLoading, isSuccess, error } = useQuery({
    queryKey: ["user", "/user/workouts"],
    queryFn: async () =>
      await apiClient.get("/user/workouts", {
        headers: { Authorization: `Bearer ${token}` },
        queries: { limit: 100 },
      }),
  });

  // Memoritza i transforma les dades dels entrenaments per a la llista
  const workouts = useMemo(
    () =>
      data?.map(
        (data) =>
          ({
            uuid: data.uuid,
            title: data.name,
            description: data.description,
            timestamp: data.instance?.timestamp_start || 0,
            duration: data.instance?.duration || 0,
            exercises: data.entries.map((entry) => ({
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
              })),
            })),
          }) as workout,
      ),
    [data], // Es recalcula quan canvien les dades de la consulta
  );

  return (
    <ThemedView className="flex-1">
      <Header title="Workout History" />

      {isLoading && ( // Mostra un indicador de càrrega mentre s'obtenen les dades
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size={"large"} />
        </View>
      )}
      {error && ( // Mostra un missatge d'error si la càrrega falla
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-center">
            Failed to load workout history: {error.message}
          </Text>
        </View>
      )}
      {isSuccess && ( // Si la càrrega és exitosa
        <FlatList
          className="p-2"
          data={workouts}
          keyExtractor={(item) =>
            // Extreu una clau única per a cada element
            item.uuid ? item.uuid : Math.random().toString()
          }
          renderItem={({ item }) => (
            // Renderitza una WorkoutCard per a cada entrenament
            <WorkoutCard
              workout={item}
              className="mb-2"
              showDescription
              onPress={() => router.push(`/workout/workout-view/${item.uuid}`)}
            />
          )}
        />
      )}
    </ThemedView>
  );
}