import { Paint, useFont } from "@shopify/react-native-skia";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, RefreshControl, View } from "react-native";
import {
  Avatar,
  Button,
  Card,
  Chip,
  IconButton,
  Text,
  useTheme,
} from "react-native-paper";
import { Bar, CartesianChart } from "victory-native";
import { useShallow } from "zustand/react/shallow";
import roboto from "../../../assets/fonts/Roboto-Regular.ttf";
import { useAuthStore } from "../../../store/auth-store";
import { useWorkoutStore } from "../../../store/workout-store";
import { AddIcon, CloseIcon, DumbellIcon, SettingsIcon } from "../../Icons";
import HomeTabsScreen from "../../ui/screen/HomeTabsScreen";
import WorkoutCard from "../../ui/WorkoutCard";

export default function HomePage() {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const refreshControlHandler = () => {
    setRefreshing(true);
    queryClient.invalidateQueries({ queryKey: ["user", "/auth/profile"] });
    queryClient.invalidateQueries({ queryKey: ["user", "/user/workouts"] });
    queryClient.invalidateQueries({ queryKey: ["user", "/user/stats"] });

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

function getFirstDaysOfWeek(delta: number, amount: number) {
  const today = new Date();

  const dayOfWeek = today.getDay() - 1;
  const firstDayOfThisWeek = new Date(today);
  firstDayOfThisWeek.setDate(today.getDate() - dayOfWeek);

  const d = new Date(firstDayOfThisWeek);
  d.setDate(firstDayOfThisWeek.getDate() - (amount - delta) * 7);

  return d;
}

const WorkoutsChart = () => {
  const theme = useTheme();
  const font = useFont(roboto, 12);
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );
  const { data, isSuccess } = useQuery({
    queryKey: ["user", "/user/stats"],
    queryFn: async () =>
      await apiClient.get("/user/stats", {
        headers: { Authorization: `Bearer ${token}` },
      }),
  });

  const chartData = useMemo(
    () =>
      data?.workouts_per_week?.toReversed().map((item, index) => ({
        weekDelta: index,
        workouts: item,
      })) ||
      Array.from({ length: 8 }, (_, i) => ({
        weekDelta: i,
        workouts: 0,
      })),
    [data],
  );

  const xTickValues = useMemo(
    () => chartData.map((dataPoint) => dataPoint.weekDelta),
    [chartData],
  );

  return (
    <>
      <Text variant="titleMedium">Workouts per Week</Text>

      <View style={{ height: 150 }}>
        <CartesianChart
          data={chartData}
          xKey={"weekDelta"}
          yKeys={["workouts"]}
          domainPadding={{ left: 30, right: 30, top: 10 }}
          domain={{
            y: [
              0,
              chartData
                .map((data) => data.workouts)
                .reduce((x, y) => Math.max(x, y), 0),
            ],
          }}
          axisOptions={{
            font: font,
            tickValues: xTickValues,
            formatXLabel: (value) => {
              const date = getFirstDaysOfWeek(value + 1, chartData.length);
              const day = date.getDate().toString().padStart(2, "0");
              const month = (date.getMonth() + 1).toString().padStart(2, "0");

              return `${day}/${month}`;
            },
            formatYLabel: (label) =>
              label.toString().indexOf(".") === -1 && isSuccess
                ? label.toString()
                : "",
            labelColor: theme.colors.onSurface,
            lineColor: theme.colors.onSurfaceDisabled,
          }}
        >
          {({ points, chartBounds }) => (
            <Bar chartBounds={chartBounds} points={points.workouts}>
              <Paint color={theme.colors.secondary} />
            </Bar>
          )}
        </CartesianChart>
      </View>

      <View className="flex-row gap-2">
        {isSuccess ? (
          <>
            <Chip>{data.workouts} workouts</Chip>
            <Chip>{data.workouts_last_week} this week</Chip>
          </>
        ) : (
          <View className="flex-1 justify-center">
            <ActivityIndicator size={"small"} />
          </View>
        )}
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
