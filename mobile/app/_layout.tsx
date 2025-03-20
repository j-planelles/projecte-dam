import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";
import { RestCountdownProvider } from "../store/rest-timer-context";

export default function MainLayout() {
	return (
		<>
			<StatusBar style="auto" />
			<SafeAreaProvider>
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
			</SafeAreaProvider>
		</>
	);
}
