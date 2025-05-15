import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useColorScheme, View } from "react-native";
import { SystemBars } from "react-native-edge-to-edge";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";
import { RestCountdownProvider } from "../store/rest-timer-context";

const client = new QueryClient();

export default function MainLayout() {
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme({
    fallbackSourceColor: "769CDF",
  });

  const paperTheme =
    colorScheme === "dark"
      ? { ...MD3DarkTheme, colors: theme.dark }
      : { ...MD3LightTheme, colors: theme.light };

  return (
    <SafeAreaProvider>
      <SystemBars style="auto" />
      <KeyboardProvider>
        <QueryClientProvider client={client}>
          <RestCountdownProvider>
            <PaperProvider theme={paperTheme}>
              <View
                style={{ flex: 1, backgroundColor: paperTheme.colors.surface }}
              >
                <Stack
                  screenOptions={{
                    headerShown: false,
                    contentStyle: {
                      backgroundColor: paperTheme.colors.surface,
                    },
                  }}
                />
              </View>
            </PaperProvider>
          </RestCountdownProvider>
        </QueryClientProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}
