import { useQuery } from "@tanstack/react-query";
import { Link, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import {
  Appbar,
  Button,
  List,
  Searchbar,
  Text,
  useTheme,
} from "react-native-paper";
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

  const disableControls =
    userExercisesQuery.isLoading || defaultExercisesQuery.isLoading;

  const [searchTerm, setSearchTerm] = useState<string>("");

  return (
    <ThemedView className="flex-1">
      <Header title="Manage Exercises">
        <Appbar.Action
          animated={false}
          icon={({ color }) => <AddIcon color={color} />}
          onPress={() => {
            router.push("/workout/exercise-edit/");
          }}
        />
      </Header>
      {disableControls ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <>
          <View className="px-4 py-2">
            <Searchbar
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder="Search exercises..."
            />
          </View>
          <FlatList
            data={sortedExercises.filter(
              (exercise) =>
                !searchTerm ||
                exercise.name
                  .toLowerCase()
                  .indexOf(searchTerm.toLowerCase()) !== -1,
            )}
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
        </>
      )}
    </ThemedView>
  );
}

const ExerciseListEmptyComponent = () => {
  const theme = useTheme();

  return (
    <View className="flex-1 items-center gap-8 pt-16">
      <DumbellIcon size={96} color={theme.colors.onSurface} />
      <Text variant="headlineLarge">No exercises...</Text>
      <Link asChild href="/workout/exercise-edit">
        <Button mode="contained">Create an exercise</Button>
      </Link>
    </View>
  );
};
