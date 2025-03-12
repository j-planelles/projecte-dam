import { Link } from "expo-router";
import { ScrollView, View } from "react-native";
import { Text, TouchableRipple, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowForwardIcon } from "../../Icons";
import { BasicView } from "./Screen";

export default function HomeTabsScreen({
  children,
}: {
  children: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();
  const ONGOING_WORKOUT = true;

  return (
    <View className="flex-1" style={{ paddingTop: insets.top }}>
      <ScrollView>
        <BasicView>{children}</BasicView>
      </ScrollView>
      {ONGOING_WORKOUT && <OngoingWorkoutButton />}
    </View>
  );
}

const OngoingWorkoutButton = () => {
  const theme = useTheme();

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
              style={{ color: theme.colors.onSecondaryContainer }}
            >
              Ongoing Workout
            </Text>
            <Text
              variant="titleMedium"
              style={{ color: theme.colors.onSecondaryContainer }}
            >
              10:14 - 3 exercises remaining
            </Text>
          </View>

          <ArrowForwardIcon
            color={theme.colors.onSecondaryContainer}
            size={32}
          />
        </View>
      </TouchableRipple>
    </Link>
  );
};
