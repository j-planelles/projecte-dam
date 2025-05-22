import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { List, Text, useTheme } from "react-native-paper";
import { DumbellIcon, PersonIcon, SettingsIcon } from "../../components/Icons";
import Header from "../../components/ui/Header";
import UltraLogoText from "../../components/ui/logo-text";
import { ThemedView } from "../../components/ui/screen/Screen";

/**
 * Pàgina principal de configuració de l'aplicació.
 * Permet accedir a la configuració general, del perfil i de l'entrenador personal.
 * @returns {JSX.Element} El component de la pàgina de configuració.
 */
export default function SettingsPage() {
  const router = useRouter();

  return (
    <ThemedView>
      <Header title="Settings" />
      <ScrollView>
        <View className="">
          <List.Section>
            {/* Opció per accedir a la configuració general */}
            <List.Item
              title="General"
              description="Application behaviour..."
              left={(props) => (
                <List.Icon
                  {...props}
                  icon={({ color }) => <SettingsIcon color={color} />}
                />
              )}
              onPress={() => router.push("/settings/general")}
            />

            {/* Opció per accedir a la configuració del perfil */}
            <List.Item
              title="Profile"
              description="Customize your profile, password, privacy..."
              left={(props) => (
                <List.Icon
                  {...props}
                  icon={({ color }) => <PersonIcon color={color} />}
                />
              )}
              onPress={() => router.push("/settings/profile")}
            />

            {/* Opció per accedir a la gestió de l'entrenador personal */}
            <List.Item
              title="Personal Trainer"
              description="Manage your personal trainer"
              left={(props) => (
                <List.Icon
                  {...props}
                  icon={({ color }) => <DumbellIcon color={color} />}
                />
              )}
              onPress={() => router.push("/settings/trainer")}
            />
          </List.Section>

          {/* Peu de pàgina amb informació de l'aplicació */}
          <ApplicationVersionFooter />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

/**
 * Peu de pàgina amb la informació de la versió i autoria de l'aplicació.
 * @returns {JSX.Element} El component del peu de pàgina.
 */
const ApplicationVersionFooter = () => {
  const theme = useTheme();

  return (
    <View className="items-center gap-2">
      <UltraLogoText fill={theme.colors.onSurface} />
      <View className="items-center">
        <Text variant="titleMedium" className="text-center">
          Ultra Workout Manager
        </Text>
        <Text variant="bodyMedium" className="text-center">
          Jordi Planelles Perez
        </Text>
        <Text variant="bodyMedium" className="text-center">
          Projecte DAM Institut de Palamós
        </Text>
      </View>
    </View>
  );
};
