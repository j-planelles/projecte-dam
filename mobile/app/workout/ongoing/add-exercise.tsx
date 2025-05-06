import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import {
  Appbar,
  Button,
  Chip,
  HelperText,
  List,
  Searchbar,
  Text,
  useTheme,
} from "react-native-paper";
import { v4 as uuidv4 } from "uuid";
import { useShallow } from "zustand/react/shallow";
import { DumbellIcon, FilterIcon } from "../../../components/Icons";
import Header from "../../../components/ui/Header";
import { ThemedView } from "../../../components/ui/screen/Screen";
import { useAuthStore } from "../../../store/auth-store";
import { useWorkoutStore } from "../../../store/workout-store";

export default function OngoingWorkoutAddExercisePage() {
  const theme = useTheme();
  const router = useRouter();

  const addExercises = useWorkoutStore((state) => state.addExercises);

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

  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const disableControls =
    isLoading ||
    userExercisesQuery.isLoading ||
    defaultExercisesQuery.isLoading;

  const addExerciseHandler = async () => {
    setIsLoading(true);
    setGlobalError(null);
    try {
      const userExercisesToAdd = sortedExercises.filter(
        (item) => selectedExercises.includes(item.uuid) && !item.isDefault,
      );

      const defaultExercisesToAdd = sortedExercises.filter(
        (item) => selectedExercises.includes(item.uuid) && item.isDefault,
      );

      for (const exercise of defaultExercisesToAdd) {
        const exerciseUUID = uuidv4();
        await apiClient.post(
          "/user/exercises",
          {
            uuid: exerciseUUID,
            name: exercise.name,
            description: exercise.description,
            type: exercise.type,
            body_part: exercise.bodyPart,
            default_exercise_uuid: exercise.uuid,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        userExercisesToAdd.push({ ...exercise, uuid: exerciseUUID });
      }

      const exercisesToAdd: workoutExercise[] = userExercisesToAdd.map(
        (item) => ({
          exercise: item,
          sets: [{ weight: 0, reps: 0, type: "normal" }],
        }),
      );

      addExercises(exercisesToAdd);

      router.back();
    } catch (error: any) {
      if (error instanceof AxiosError) {
        setGlobalError(error.message);
      }
    }
    setIsLoading(false);
  };

  return (
    <ThemedView className="flex-1">
      <Header title="Add exercise">
        <Appbar.Action
          animated={false}
          icon={({ color }) => <FilterIcon color={color} />}
        />
      </Header>

      <View className="px-4 py-2">
        <Searchbar
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Search exercises..."
        />
      </View>

      {disableControls ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={sortedExercises}
          keyExtractor={(item) =>
            `${item.isDefault ? "default" : "user"}-${item.uuid}`
          }
          renderItem={({ item }) => (
            <List.Item
              title={item.name}
              onPress={() =>
                item.uuid && selectedExercises.includes(item.uuid)
                  ? setSelectedExercises((state) =>
                      state.filter((value) => value !== item.uuid),
                    )
                  : setSelectedExercises((state) =>
                      item.uuid ? [...state, item.uuid] : state,
                    )
              }
              left={(props) =>
                item.uuid &&
                selectedExercises.includes(item.uuid) && (
                  <List.Icon {...props} icon="check" />
                )
              }
              style={{
                backgroundColor:
                  item.uuid && selectedExercises.includes(item.uuid)
                    ? theme.colors.primaryContainer
                    : "transparent",
              }}
            />
          )}
          ListEmptyComponent={<ExerciseListEmptyComponent />}
        />
      )}

      {selectedExercises.length > 0 && (
        <View className="px-4 py-2 gap-2">
          <View className="flex-row gap-2 flex-wrap">
            {selectedExercises.map((exerciseId) => {
              const exercise = sortedExercises.filter(
                (item) => item.uuid === exerciseId,
              )[0];
              return <Chip key={exerciseId}>{exercise.name}</Chip>;
            })}
          </View>
          {globalError !== null && (
            <HelperText type="error">{globalError}</HelperText>
          )}
          <Button
            mode="contained"
            onPress={addExerciseHandler}
            disabled={disableControls}
          >
            {selectedExercises.length > 1
              ? `Add ${selectedExercises.length} exercises`
              : "Add exercise"}
          </Button>
        </View>
      )}
    </ThemedView>
  );
}

const ExerciseListEmptyComponent = () => {
  const theme = useTheme();

  return (
    <View className="flex-1 items-center gap-8 pt-16">
      <DumbellIcon size={96} color={theme.colors.onSurface} />
      <View className="gap-4 items-center">
        <Text variant="headlineLarge">No exercises found.</Text>
      </View>
    </View>
  );
};
