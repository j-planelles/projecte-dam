import { Link } from "expo-router";
import { RefreshControlProps, ScrollView, View } from "react-native";
import { Text, TouchableRipple, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowForwardIcon } from "../../Icons";
import { BasicView } from "./Screen";
import { useWorkoutStore } from "../../../store/workout-store";
import { useTimer } from "../../../lib/hooks/useTimer";
import { useEffect } from "react";

export default function HomeTabsScreen({
  children,
  refreshControl
}: {
  children: React.ReactNode;
  refreshControl?: React.ReactElement<RefreshControlProps, string | React.JSXElementConstructor<any>> | undefined
}) {
  const insets = useSafeAreaInsets();
  const ongoingWorkout = useWorkoutStore((state) => state.isOngoingWorkout);

  return (
    <View className="flex-1" style={{ paddingTop: insets.top }}>
      <ScrollView refreshControl={refreshControl}>
        <BasicView>{children}</BasicView>
      </ScrollView>
      {ongoingWorkout && <OngoingWorkoutButton />}
    </View>
  );
}

const OngoingWorkoutButton = () => {
  const theme = useTheme();

  const exerciseAmount = useWorkoutStore((state) => state.exercises.length);

  const startTime = useWorkoutStore((state) => state.timestamp);
  const { formattedTime, start } = useTimer();

  useEffect(() => {
    start(startTime);
  }, [start, startTime]);

  return (
    <Link asChild href="/workout/ongoing/">
      <TouchableRipple
        rippleColor={theme.colors.primary}
        style={{ backgroundColor: theme.colors.primaryContainer }}
      >
        <View className="p-4 flex-row items-center">
          <View className="flex-1">
            <Text
              variant="titleLarge"
              style={{ color: theme.colors.onPrimaryContainer }}
            >
              Ongoing Workout
            </Text>
            <Text
              variant="titleMedium"
              style={{ color: theme.colors.onPrimaryContainer }}
            >
              {formattedTime} - {exerciseAmount} exercises
            </Text>
          </View>

          <ArrowForwardIcon color={theme.colors.onPrimaryContainer} size={32} />
        </View>
      </TouchableRipple>
    </Link>
  );
};
