import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView, View } from "react-native";
import { List, Switch, Text } from "react-native-paper";
import { useShallow } from "zustand/react/shallow";
import { DumbellIcon } from "../../components/Icons";
import Header from "../../components/ui/Header";
import { ThemedView } from "../../components/ui/screen/Screen";
import { useSettingsStore } from "../../store/settings-store";

/**
 * Pàgina de configuració general de l'aplicació.
 * Permet modificar el comportament general, com la visualització de la darrera sèrie realitzada.
 * @returns {JSX.Element} El component de la pàgina de configuració general.
 */
export default function SettingsPage() {
  return (
    <ThemedView className="flex-1">
      <Header title="General" />
      <ScrollView>
        <View>
          <View className="mx-4 gap-2 pt-4">
            <Text variant="titleSmall">Application behaviour</Text>
          </View>

          {/* Opció per mostrar l'última sèrie realitzada a l'editor d'entrenaments */}
          <WorkoutLastSetOption />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

/**
 * Opció per activar o desactivar la visualització de la darrera sèrie realitzada a l'editor d'entrenaments.
 * Desa la preferència a l'store i a AsyncStorage.
 * @returns {JSX.Element} El component de l'opció de configuració.
 */
const WorkoutLastSetOption = () => {
  // Obté l'estat i l'actualitzador de la preferència des de l'store
  const { enableLastSet, setEnableLastLest } = useSettingsStore(
    useShallow((state) => ({
      enableLastSet: state.enableLastSet,
      setEnableLastLest: state.setEnableLastLest,
    })),
  );

  // Handler per canviar l'estat de la preferència i desar-la a AsyncStorage
  const changeHandler = async () => {
    setEnableLastLest(!enableLastSet);
    await AsyncStorage.setItem(
      "enableLastSet",
      !enableLastSet ? "true" : "false",
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
