import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MD3DarkTheme, PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";
import { RestCountdownProvider } from "../store/rest-timer-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const client = new QueryClient();

export default function MainLayout() {
	return (
		<>
			<StatusBar style="auto" />
			<SafeAreaProvider>
				<QueryClientProvider client={client}>
					{/* <PaperProvider theme={MD3DarkTheme}> */}
					<RestCountdownProvider>
						<PaperProvider>
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
