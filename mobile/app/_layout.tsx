import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";
import { RestCountdownProvider } from "../store/rest-timer-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { useColorScheme } from "react-native";
import { customDarkTheme, customLightTheme } from "../lib/theme";

const client = new QueryClient();

export default function MainLayout() {
	const colorScheme = useColorScheme();
	const { theme } = useMaterial3Theme(); // TODO: Implement Material 3 Theme

	const paperTheme =
		colorScheme === "dark" ? { ...customDarkTheme } : { ...customLightTheme };

	return (
		<>
			<StatusBar style="auto" />
			<SafeAreaProvider>
				<QueryClientProvider client={client}>
					<RestCountdownProvider>
						<PaperProvider theme={paperTheme}>
							<Stack
								screenOptions={{
									headerShown: false,
								}}
							/>
						</PaperProvider>
					</RestCountdownProvider>
				</QueryClientProvider>
			</SafeAreaProvider>
		</>
	);
}
