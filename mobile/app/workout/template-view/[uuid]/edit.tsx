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

  const workoutStore = useWorkoutStore(
    useShallow((state) => ({
      uuid: state.uuid,
      title: state.title,
      timestamp: state.timestamp,
      description: state.description,
      exercises: state.exercises,
    })),
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      queryClient.invalidateQueries({
        queryKey: ["user", "/user/templates"],
      });
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

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [queryError, setQueryError] = useState<string | null>(null);

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
      router.replace("/");
    } catch (error: unknown) {
      console.error(handleError(error));
    }
    setIsLoading(false);
  };

  return (
    <>
      <Appbar.Action
        animated={false}
        icon={(props) => <TrashCanIcon {...props} />}
        onPress={() => setVisible(true)}
        loading={isLoading}
      />
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
      <Portal>
        <Snackbar visible={!!queryError} onDismiss={() => setQueryError(null)}>
          Failed to remove template. Please remove any recommendations to users
          in the desktop app and try again. {queryError}
        </Snackbar>
      </Portal>
    </>
  );
};

const WorkoutEditorComponent = () => {
  const { uuid } = useLocalSearchParams();
  const loadWorkout = useWorkoutStore((state) => state.loadWorkout);
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );
  const { data, isLoading, error } = useQuery({
    queryKey: ["user", "/user/templates", uuid],
    queryFn: async () =>
      await apiClient.get("/user/templates/:template_uuid", {
        params: { template_uuid: uuid.toString() },
        headers: { Authorization: `Bearer ${token}` },
      }),
  });

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
      {error && <Text>{error.message}</Text>}
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
