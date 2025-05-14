import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView, View } from "react-native";
import { List, Switch, Text } from "react-native-paper";
import { useShallow } from "zustand/react/shallow";
import { DumbellIcon } from "../../components/Icons";
import Header from "../../components/ui/Header";
import { ThemedView } from "../../components/ui/screen/Screen";
import { useSettingsStore } from "../../store/settings-store";

export default function SettingsPage() {
  return (
    <ThemedView className="flex-1">
      <Header title="General" />
      <ScrollView>
        <View>
          <View className="mx-4 gap-2 pt-4">
            <Text variant="titleSmall">Application behaviour</Text>
          </View>

          <WorkoutLastSetOption />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const WorkoutLastSetOption = () => {
  const { enableLastSet, setEnableLastLest } = useSettingsStore(
    useShallow((state) => ({
      enableLastSet: state.enableLastSet,
      setEnableLastLest: state.setEnableLastLest,
    })),
  );

  const changeHandler = async () => {
    setEnableLastLest(!enableLastSet);
    await AsyncStorage.setItem(
      "enableLastSet",
      enableLastSet ? "true" : "false",
    );
  };
  return (
    <List.Item
      title="Show last set in workout editor"
      description="Show a small hint containing the last time that the exercise was performed."
      left={(props) => (
        <List.Icon
          {...props}
          icon={({ color }) => <DumbellIcon color={color} />}
        />
      )}
      right={(props) => (
        <Switch
          {...props}
          value={enableLastSet}
          onValueChange={changeHandler}
        />
      )}
      onPress={changeHandler}
    />
  );
};
