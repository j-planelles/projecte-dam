import { ScrollView, View } from "react-native";
import { List, Switch, Text } from "react-native-paper";
import { DumbellIcon, TimerIcon } from "../../components/Icons";
import Header from "../../components/ui/Header";
import { useState } from "react";
import ChoiceBox from "../../components/ui/ChoiceBox";
import { ThemedView } from "../../components/ui/screen/Screen";

const THEME_SWITCH_ITEMS = ["Use device default", "Light", "Dark"];

export default function SettingsPage() {
  const [timerRestSound, setTimerRestSound] = useState<boolean>(false);
  const [workoutLocationsEnabled, setWorkoutLocationsEnabled] =
    useState<boolean>(false);

  return (
    <ThemedView className="flex-1">
      <Header title="General" />
      <ScrollView>
        <View>
          <View className="mx-4 gap-2 pt-4">
            <Text variant="titleSmall">Application behaviour</Text>
          </View>

          <List.Item
            title="Rest timer sound effect"
            description="Play a sound when the rest countdown ends"
            left={(props) => (
              <List.Icon
                {...props}
                icon={({ color }) => <TimerIcon color={color} />}
              />
            )}
            right={(props) => (
              <Switch
                {...props}
                value={timerRestSound}
                onValueChange={() => setTimerRestSound((value) => !value)}
              />
            )}
            onPress={() => setTimerRestSound((value) => !value)}
          />

          <List.Item
            title="Use workout locations"
            description="When enabled, will allow you to specify a gym for each workout."
            left={(props) => (
              <List.Icon
                {...props}
                icon={({ color }) => <DumbellIcon color={color} />}
              />
            )}
            right={(props) => (
              <Switch
                {...props}
                value={workoutLocationsEnabled}
                onValueChange={() =>
                  setWorkoutLocationsEnabled((value) => !value)
                }
              />
            )}
            onPress={() => setWorkoutLocationsEnabled((value) => !value)}
          />

          <ChoiceBox
            mode="outlined"
            label="Theme"
            elements={THEME_SWITCH_ITEMS}
            className="mx-4"
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}
