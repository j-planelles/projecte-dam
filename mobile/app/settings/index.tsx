import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { List, Text, useTheme } from "react-native-paper";
import { DumbellIcon, PersonIcon, SettingsIcon } from "../../components/Icons";
import Header from "../../components/ui/Header";
import UltraLogoText from "../../components/ui/logo-text";
import { ThemedView } from "../../components/ui/screen/Screen";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <ThemedView>
      <Header title="Settings" />
      <ScrollView>
        <View className="">
          <List.Section>
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

          <ApplicationVersionFooter />
        </View>
      </ScrollView>
    </ThemedView>
  );
}
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
