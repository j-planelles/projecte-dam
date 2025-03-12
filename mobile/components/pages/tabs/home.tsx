import { Paint, useFont } from "@shopify/react-native-skia";
import { Link, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Avatar, Button, MD3LightTheme } from "react-native-paper";
import { Bar, CartesianChart } from "victory-native";
import roboto from "../../../assets/fonts/Roboto-Regular.ttf";
import {
  CalendarIcon,
  CloseIcon,
  InformationIcon,
  SettingsIcon,
} from "../../Icons";
import CompactChip from "../../ui/CompactChip";
import InfoCard from "../../ui/InfoCard";
import HomeTabsScreen from "../../ui/screen/HomeTabsScreen";
import WorkoutCard from "../../ui/WorkoutCard";

const SAMPLE_WORKOUTS: workout[] = [
  {
    uuid: "c1be768f-4455-4b1d-ac6c-2ddf82e2a137",
    title: "Full Body Strength Training",
    timestamp: 1697001600,
    duration: 90,
    gym: "Planet Fitness",
    creator: "John Doe",
    description:
      "A comprehensive full-body workout focusing on building strength and endurance",
    exercises: [
      {
        exercise: {
          name: "Bench Press",
        },
        sets: [
          { reps: 8, weight: 135 },
          { reps: 8, weight: 135 },
          { reps: 8, weight: 135 },
        ],
      },
      {
        exercise: {
          name: "Pull-ups",
        },
        sets: [
          { reps: 10, weight: 0 },
          { reps: 8, weight: 0 },
          { reps: 6, weight: 0 },
        ],
      },
      {
        exercise: {
          name: "Dumbbell Squat",
        },
        sets: [
          { reps: 12, weight: 40 },
          { reps: 10, weight: 40 },
          { reps: 8, weight: 40 },
        ],
      },
      {
        exercise: {
          name: "Deadlift",
        },
        sets: [
          { reps: 6, weight: 185 },
          { reps: 6, weight: 185 },
          { reps: 4, weight: 185 },
        ],
      },
      {
        exercise: {
          name: "Bicep Curl",
        },
        sets: [
          { reps: 12, weight: 20 },
          { reps: 10, weight: 20 },
          { reps: 8, weight: 20 },
        ],
      },
      {
        exercise: {
          name: "Tricep Dip",
        },
        sets: [
          { reps: 15, weight: 0 },
          { reps: 12, weight: 0 },
          { reps: 10, weight: 0 },
        ],
      },
      {
        exercise: {
          name: "Plank",
        },
        sets: [
          { reps: 60, weight: 0 },
          { reps: 60, weight: 0 },
        ],
      },
    ],
  },
  {
    uuid: "efd04bdc-2997-4729-8442-5b9a106aa933",
    title: "Upper Body Strength",
    timestamp: 1697001600,
    duration: 75,
    gym: "Planet Fitness",
    creator: "John Doe",
    description: "Focus on building upper body strength and endurance",
    exercises: [
      {
        exercise: {
          name: "Bench Press",
        },
        sets: [
          { reps: 8, weight: 135 },
          { reps: 8, weight: 135 },
          { reps: 8, weight: 135 },
        ],
      },
      {
        exercise: {
          name: "Pull-ups",
        },
        sets: [
          { reps: 10, weight: 0 },
          { reps: 8, weight: 0 },
          { reps: 6, weight: 0 },
        ],
      },
      {
        exercise: {
          name: "Dumbbell Shoulder Press",
        },
        sets: [
          { reps: 10, weight: 30 },
          { reps: 8, weight: 30 },
          { reps: 6, weight: 30 },
        ],
      },
      {
        exercise: {
          name: "Bicep Curl",
        },
        sets: [
          { reps: 12, weight: 20 },
          { reps: 10, weight: 20 },
          { reps: 8, weight: 20 },
        ],
      },
      {
        exercise: {
          name: "Tricep Dip",
        },
        sets: [
          { reps: 15, weight: 0 },
          { reps: 12, weight: 0 },
          { reps: 10, weight: 0 },
        ],
      },
    ],
  },
];

export default function HomePage() {
  return (
    <HomeTabsScreen>
      <ProfilePictureHeader />

      <InfoCard
        left={<InformationIcon />}
        right={
          <Pressable
            onPress={() => {
              console.log("Pressed");
            }}
          >
            <CloseIcon />
          </Pressable>
        }
      >
        {`A wrapper for views that should respond to touches. Provides a material "ink ripple" interaction effect for supported platforms (>= Android Lollipop). On unsupported platforms, it falls back to a highlight effect.`}
      </InfoCard>

      <WorkoutsChart />

      <Text className="text-lg font-bold">History</Text>

      <WorkoutsList />

      <Link href="/workout/history-list" asChild>
        <Button mode="text">View all</Button>
      </Link>
    </HomeTabsScreen>
  );
}

const ProfilePictureHeader = () => {
  return (
    <View className="flex-1 flex-row items-center gap-4">
      <Avatar.Text size={48} label="J" />
      <View className="flex-1">
        <Text className="text-xl font-bold">Jordi Planelles Pérez</Text>
        <View className="flex-row gap-2">
          <CompactChip>100 workouts</CompactChip>
          <CompactChip>3 this week</CompactChip>
        </View>
      </View>
      <Link asChild href="/settings/">
        <Pressable>
          <SettingsIcon />
        </Pressable>
      </Link>
    </View>
  );
};

const WorkoutsChart = () => {
  const font = useFont(roboto, 12);
  const DATA = Array.from({ length: 8 }, (_, i) => ({
    weekDelta: i,
    workouts: Math.floor(Math.random() * 6) + 1,
  }));

  return (
    <>
      <View className="flex-1 flex-row items-center">
        <Text className="flex-1 text-lg font-bold">Workouts per week</Text>
        <Link href="/" asChild>
          <Pressable>
            <CalendarIcon />
          </Pressable>
        </Link>
      </View>

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
          }}
        >
          {({ points, chartBounds }) => (
            <Bar chartBounds={chartBounds} points={points.workouts}>
              <Paint color={MD3LightTheme.colors.primary} />
            </Bar>
          )}
        </CartesianChart>
      </View>
    </>
  );
};

const WorkoutsList = () => {
  const router = useRouter();

  return (
    <>
      {SAMPLE_WORKOUTS.map((workout) => (
        <WorkoutCard
          key={workout.uuid}
          workout={workout}
          onPress={() => router.push(`/workout/workout-view/${workout.uuid}`)}
        />
      ))}
    </>
  );
};
