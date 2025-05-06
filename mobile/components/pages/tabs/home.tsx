import { Paint, useFont } from "@shopify/react-native-skia";
import { useQuery } from "@tanstack/react-query";
import { Link, useRouter } from "expo-router";
import { ActivityIndicator, Pressable, View } from "react-native";
import {
  Avatar,
  Button,
  Chip,
  MD3LightTheme,
  Text,
  useTheme,
  IconButton,
  Card,
} from "react-native-paper";
import { Bar, CartesianChart } from "victory-native";
import { useShallow } from "zustand/react/shallow";
import roboto from "../../../assets/fonts/Roboto-Regular.ttf";
import { useAuthStore } from "../../../store/auth-store";
import {
  AddIcon,
  CalendarIcon,
  CloseIcon,
  DumbellIcon,
  InformationIcon,
  SettingsIcon,
} from "../../Icons";
import HomeTabsScreen from "../../ui/screen/HomeTabsScreen";
import WorkoutCard from "../../ui/WorkoutCard";
import { useWorkoutStore } from "../../../store/workout-store";
import { useState } from "react";

export default function HomePage() {
  return (
    <HomeTabsScreen>
      <ProfilePictureHeader />

      <InfoCard />

      <WorkoutsChart />

      <Text variant="titleMedium">History</Text>

      <WorkoutsList />
    </HomeTabsScreen>
  );
}

const ProfilePictureHeader = () => {
  const theme = useTheme();

  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );
  const { data, isLoading, error } = useQuery({
    queryKey: ["user", "/auth/profile"],
    queryFn: async () =>
      await apiClient.get("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      }),
  });

  return (
    <View className="flex-1 flex-col min-h-20">
      {isLoading && (
        <View className="flex-1">
          <ActivityIndicator size="large" />
        </View>
      )}
      {data && (
        <View className="flex-1 flex-row items-center gap-4">
          <Avatar.Text
            size={52}
            label={data ? data?.full_name.charAt(0).toUpperCase() : ""}
          />
          <View className="flex-1 gap-1">
            <Text variant="titleMedium">{data?.full_name}</Text>
            <Text
              variant="labelMedium"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              {data?.username}
            </Text>
          </View>
          <Link asChild href="/settings/">
            <IconButton
              icon={(props) => <SettingsIcon {...props} />}
              style={{ margin: 0 }}
            />
          </Link>
        </View>
      )}
      {error && (
        <View className="flex-1 p-2">
          <Text>Failed to load user data.</Text>
        </View>
      )}
    </View>
  );
};

const WorkoutsChart = () => {
  const theme = useTheme();
  const font = useFont(roboto, 12);
  const DATA = Array.from({ length: 8 }, (_, i) => ({
    weekDelta: i,
    workouts: Math.floor(Math.random() * 6) + 1,
  }));

  return (
    <>
      <Text variant="titleMedium">Workouts per Week</Text>

      <View style={{ height: 150 }}>
        <CartesianChart
          data={DATA}
          xKey={"weekDelta"}
          yKeys={["workouts"]}
          domainPadding={{ left: 30, right: 30, top: 10 }}
          domain={{
            y: [
              0,
              DATA.map((data) => data.workouts).reduce((x, y) =>
                Math.max(x, y),
              ),
            ],
          }}
          axisOptions={{
            font: font,
            formatXLabel: (value) => value.toString(),
            labelColor: theme.colors.onSurface,
            lineColor: theme.colors.onSurfaceDisabled,
          }}
        >
          {({ points, chartBounds }) => (
            <Bar
              chartBounds={chartBounds}
              points={points.workouts}
              color={theme.colors.secondary}
            >
              <Paint color={theme.colors.secondary} />
            </Bar>
          )}
        </CartesianChart>
      </View>

      <View className="flex-row gap-2">
        <Chip>100 workouts</Chip>
        <Chip>3 this week</Chip>
      </View>
    </>
  );
};

const WorkoutsList = () => {
  const theme = useTheme();
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
        queries: { limit: 15 }, // Obtenir fins a 15 entrades
      }),
  });

  return (
    <>
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
          <View className="gap-4 mb-4">
            {data
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
                  onPress={() =>
                    router.push(`/workout/workout-view/${workout.uuid}`)
                  }
                />
              ))}

            {data.length > 15 && (
              <Link href="/workout/history-list" asChild>
                <Button mode="text">View all</Button>
              </Link>
            )}
          </View>
        ) : (
          <View className="flex-col items-center gap-2">
            <DumbellIcon size={90} color={theme.colors.onSurface} />
            <Text variant="headlineMedium">No workouts found.</Text>
            <StartWorkoutButton />
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
      mode="outlined"
      disabled={isOngoingWorkout}
      onPress={workoutStartHandler}
    >
      Start an empty workout
    </Button>
  );
};

const InfoCard = () => {
  const [info, setInfo] = useState<null | string>(
    "Recordar implementar aquesta funcionalitat!",
  );

  const dismissHandler = () => {
    setInfo(null);
  };

  return (
    info && (
      <Card mode="outlined">
        <Card.Content>
          <Text variant="bodyMedium">{info}</Text>
        </Card.Content>
        <Card.Actions>
          <Button
            icon={(props) => <CloseIcon {...props} />}
            onPress={dismissHandler}
            mode="contained-tonal"
          >
            Dismiss
          </Button>
        </Card.Actions>
      </Card>
    )
  );
};
