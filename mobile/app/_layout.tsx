import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../global.css";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function MainLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <SafeAreaProvider>
        {/* <PaperProvider theme={MD3DarkTheme}> */}
        <PaperProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </PaperProvider>
      </SafeAreaProvider>
    </>
  );
}
