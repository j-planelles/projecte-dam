import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, View, Text } from "react-native";
import { useShallow } from "zustand/react/shallow";
import Header from "../../components/ui/Header";
import { ThemedView } from "../../components/ui/screen/Screen";
import WorkoutCard from "../../components/ui/WorkoutCard";
import { useAuthStore } from "../../store/auth-store";
import { useMemo } from "react";

export default function TemplatesListPage() {
  const router = useRouter();
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );
  const { data, isLoading, isSuccess, error } = useQuery({
    queryKey: ["user", "/user/workouts"],
    queryFn: async () =>
      await apiClient.get("/user/workouts", {
        headers: { Authorization: `Bearer ${token}` },
        queries: { limit: 100 },
      }),
  });

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
    [data],
  );

  return (
    <ThemedView className="flex-1">
      <Header title="Workout History" />

      {isLoading && (
        <View>
          <ActivityIndicator size={"large"} />
        </View>
      )}
      {error && (
        <View>
          <Text>{error.message}</Text>
        </View>
      )}
      {isSuccess && (
        <FlatList
          className="p-2"
          data={workouts}
          keyExtractor={(item) =>
            item.uuid ? item.uuid : Math.random().toString()
          }
          renderItem={({ item }) => (
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
