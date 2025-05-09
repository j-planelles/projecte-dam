import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, RefreshControl, View } from "react-native";
import { Button, IconButton, Text, useTheme } from "react-native-paper";
import { useShallow } from "zustand/react/shallow";
import { useAuthStore } from "../../../store/auth-store";
import { useWorkoutStore } from "../../../store/workout-store";
import { AddIcon, DumbellIcon } from "../../Icons";
import WorkoutCard from "../../ui/WorkoutCard";
import HomeTabsScreen from "../../ui/screen/HomeTabsScreen";

export default function WorkoutTab() {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const refreshControlHandler = () => {
    setRefreshing(true);
    queryClient.invalidateQueries({ queryKey: ["user", "/user/templates"] });

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  return (
    <HomeTabsScreen
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refreshControlHandler}
        />
      }
    >
      <Text variant="headlineLarge">Workout</Text>

      <StartWorkoutButton />

      <Link href="/workout/exercise-list" asChild>
        <Button
          icon={({ color }) => <DumbellIcon color={color} />}
          mode="contained-tonal"
        >
          Manage exercises
        </Button>
      </Link>

      <TemplatesList />
    </HomeTabsScreen>
  );
}

const TemplatesList = () => {
  const theme = useTheme();
  const router = useRouter();
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );
  const { data, isLoading, isSuccess, error } = useQuery({
    queryKey: ["user", "/user/templates"],
    queryFn: async () =>
      await apiClient.get("/user/templates", {
        headers: { Authorization: `Bearer ${token}` },
      }),
  });

  return (
    <>
      <View className="flex-1 flex-row items-center">
        <Text className="flex-1 text-lg font-bold">Templates</Text>
        <CreateTemplateIcon />
      </View>

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
      {isSuccess &&
        (data.length > 0 ? (
          data
            .map(
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
                      userNote: entry.exercise.user_note,
                      bodyPart: entry.exercise.body_part,
                      type: entry.exercise.type,
                    },
                    sets: entry.sets.map((set) => ({
                      reps: set.reps,
                      weight: set.weight,
                    })),
                  })),
                }) as workout,
            )
            .map((workout) => (
              <WorkoutCard
                key={workout.uuid}
                workout={workout}
                showTimestamp={false}
                showDescription={true}
                onPress={() =>
                  router.push(`/workout/template-view/${workout.uuid}`)
                }
              />
            ))
        ) : (
          <View className="flex-col items-center gap-2">
            <DumbellIcon size={130} color={theme.colors.onSurface} />
            <Text variant="headlineMedium">No templates found.</Text>
            <Text>
              Create a new template or save a past workout as a template.
            </Text>
            <CreateTemplateEmptyListIcon />
          </View>
        ))}
    </>
  );
};

const StartWorkoutButton = () => {
  const router = useRouter();
  const { startEmptyWorkout, isOngoingWorkout } = useWorkoutStore(
    useShallow((state) => ({
      startEmptyWorkout: state.startEmptyWorkout,
      isOngoingWorkout: state.isOngoingWorkout,
    })),
  );

  const workoutStartHandler = () => {
    startEmptyWorkout();
    router.push("/workout/ongoing/");
  };

  return (
    <Button
      icon={(props) => <AddIcon {...props} />}
      mode="contained"
      disabled={isOngoingWorkout}
      onPress={workoutStartHandler}
    >
      Start an empty workout
    </Button>
  );
};

const CreateTemplateIcon = () => {
  const isOngoingWorkout = useWorkoutStore((state) => state.isOngoingWorkout);

  return (
    <Link asChild href="/workout/template-view/">
      <IconButton
        icon={(props) => <AddIcon {...props} />}
        style={{ margin: 0 }}
        disabled={isOngoingWorkout}
      />
    </Link>
  );
};

const CreateTemplateEmptyListIcon = () => {
  const isOngoingWorkout = useWorkoutStore((state) => state.isOngoingWorkout);

  return (
    <Link asChild href="/workout/template-view/">
      <Button
        icon={(props) => <AddIcon {...props} />}
        disabled={isOngoingWorkout}
        mode="outlined"
      >
        Create template
      </Button>
    </Link>
  );
};
