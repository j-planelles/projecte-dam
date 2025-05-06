import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Appbar } from "react-native-paper";
import { useShallow } from "zustand/react/shallow";
import { SaveIcon } from "../../../components/Icons";
import WorkoutEditor from "../../../components/pages/WorkoutEditor";
import Header from "../../../components/ui/Header";
import { ThemedView } from "../../../components/ui/screen/Screen";
import { useAuthStore } from "../../../store/auth-store";
import { useWorkoutStore } from "../../../store/workout-store";

export default function CreateTemplatePage() {
  return (
    <ThemedView className="flex-1">
      <Header title="Create Template">
        <SaveButton />
      </Header>

      <WorkoutEditorComponent />
    </ThemedView>
  );
}

const SaveButton = () => {
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
      gym: state.gym,
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
              user_note: exercise.exercise.userNote,
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
      if (error instanceof AxiosError) {
        console.error(`${error?.request?.status} ${error?.request?.response}.`);
      } else {
        console.error(`${error}`);
      }
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

const WorkoutEditorComponent = () => {
  const loadEmptyWorkout = useWorkoutStore((state) => state.loadEmptyWorkout);

  useEffect(() => {
    loadEmptyWorkout();
  }, [loadEmptyWorkout]);

  return <WorkoutEditor showTimer={false} showCheckboxes={false} />;
};
