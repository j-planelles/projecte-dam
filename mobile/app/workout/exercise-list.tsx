import { useQuery } from "@tanstack/react-query";
import { Link, useRouter } from "expo-router";
import { useMemo } from "react";
import { FlatList, View } from "react-native";
import { Appbar, Button, List, Text } from "react-native-paper";
import { useShallow } from "zustand/react/shallow";
import { AddIcon, DumbellIcon } from "../../components/Icons";
import Header from "../../components/ui/Header";
import { ThemedView } from "../../components/ui/screen/Screen";
import { useAuthStore } from "../../store/auth-store";

export default function ExerciseListPage() {
  const router = useRouter();
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  const userExercisesQuery = useQuery({
    queryKey: ["user", "/user/exercises"],
    queryFn: async () =>
      await apiClient.get("/user/exercises", {
        headers: { Authorization: `Bearer ${token}` },
      }),
  });
  const defaultExercisesQuery = useQuery({
    queryKey: ["user", "/default-exercises"],
    queryFn: async () =>
      await apiClient.get("/default-exercises", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    staleTime: 2 * 60 * 60 * 1000, // 2 hores
  });

  const sortedExercises = useMemo(() => {
    const defaultExercisesFilter: string[] = [];
    const userExercises: exerciseList[] =
      userExercisesQuery.isSuccess && Array.isArray(userExercisesQuery.data)
        ? userExercisesQuery.data.map((item) => {
            if (item.default_exercise_uuid) {
              defaultExercisesFilter.push(item.default_exercise_uuid);
            }

            return {
              uuid: item.uuid,
              name: item.name,
              description: item.description,
              type: item.type,
              bodyPart: item.body_part,
              userNote: item.user_note,
              isDefault: false,
              default_exercise_uuid: item.default_exercise_uuid,
            } as exerciseList;
          })
        : [];
    const defaultExercises: exerciseList[] =
      defaultExercisesQuery.isSuccess &&
      Array.isArray(defaultExercisesQuery.data)
        ? defaultExercisesQuery.data
            .map(
              (item) =>
                ({
                  uuid: item.uuid,
                  name: item.name,
                  description: item.description,
                  type: item.type,
                  bodyPart: item.body_part,
                  isDefault: true,
                }) as exerciseList,
            )
            .filter((item) => defaultExercisesFilter.indexOf(item.uuid) === -1)
        : [];
    return [...userExercises, ...defaultExercises].sort((a, b) =>
      a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
    );
  }, [
    defaultExercisesQuery.data,
    defaultExercisesQuery.isSuccess,
    userExercisesQuery.data,
    userExercisesQuery.isSuccess,
  ]);

  return (
    <ThemedView className="flex-1">
      <Header title="Manage Exercises">
        <Appbar.Action
          icon={({ color }) => <AddIcon color={color} />}
          onPress={() => {
            router.push("/workout/exercise-edit/");
          }}
        />
      </Header>
      <FlatList
        data={sortedExercises}
        keyExtractor={(item) =>
          `${item.isDefault ? "default" : "user"}-${item.uuid}`
        }
        renderItem={({ item }) => (
          <Link
            asChild
            href={`/workout/exercise-edit/${item.isDefault ? `?defaultExerciseUUID=${item.uuid}` : item.uuid}`}
          >
            <List.Item title={item.name} />
          </Link>
        )}
        ListEmptyComponent={<ExerciseListEmptyComponent />}
      />
    </ThemedView>
  );
}

const ExerciseListEmptyComponent = () => {
  return (
    <View className="flex-1 items-center gap-8 pt-16">
      <DumbellIcon size={96} />
      <Text variant="headlineLarge">No exercises...</Text>
      <View className="flex-1 gap-4">
        <Link href="/workout/exercise-edit">
          <Button mode="contained">Create an exercise</Button>
        </Link>
      </View>
    </View>
  );
};
