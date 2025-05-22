import "react-native-get-random-values";
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

// Crea una instància del client de React Query
const client = new QueryClient();

/**
 * Component principal de la disposició (layout) de l'aplicació.
 * Envolta tota l'aplicació amb els proveïdors necessaris, com ara el tema,
 * el client de consultes (QueryClient), el context per al compte enrere de descans,
 * el gestor de teclat i el proveïdor d'àrea segura.
 * @returns {JSX.Element} El component de la disposició principal.
 */
export default function MainLayout() {
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme({
    fallbackSourceColor: "769CDF", // Color de reserva si no es pot determinar el color del sistema
  });

  // Adapta el tema Material 3 per a la llibreria React Native Paper
  const paperTheme =
    colorScheme === "dark"
      ? { ...MD3DarkTheme, colors: theme.dark }
      : { ...MD3LightTheme, colors: theme.light };

  return (
    // Proveïdor per gestionar les àrees segures de la pantalla (evitar superposicions amb la barra d'estat, etc.)
    <SafeAreaProvider>
      <SystemBars style="auto" />
      {/* Proveïdor per a la gestió del teclat a l'aplicació */}
      <KeyboardProvider>
        {/* Proveïdor per a React Query, permetent l'ús de consultes a l'API */}
        <QueryClientProvider client={client}>
          {/* Proveïdor per al context del compte enrere de descans entre sèries */}
          <RestCountdownProvider>
            {/* Proveïdor de tema per a React Native Paper */}
            <PaperProvider theme={paperTheme}>
              {/* Contenidor principal de l'aplicació amb el color de fons del tema */}
              <View
                style={{ flex: 1, backgroundColor: paperTheme.colors.surface }}
              >
                {/* Component Stack d'Expo Router per a la navegació basada en piles */}
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