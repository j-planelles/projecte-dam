import React from "react";
import { ScrollView, View } from "react-native";
import { Button, Text } from "react-native-paper";
import ChoiceBox from "../../components/ui/ChoiceBox";
import Header from "../../components/ui/Header";
import { ThemedView } from "../../components/ui/screen/Screen";

const WEIGHT_UNITS = ["Metric (kg)", "Imperal (lbs)"];
const DISTANCE_UNITS = ["Metric (m)", "Imperal (ft)"];

export default function UnitsSettingsPage() {
	return (
		<ThemedView className="flex-1">
			<Header title="Your profile" />
			<ScrollView>
				<View className="pt-4 gap-4">
					<View className="mx-4 gap-2">
						<Text variant="titleSmall">Default Units</Text>
						<Text variant="bodyMedium">
							You can change the units temporally in the current workout page.
							Changing these options will not reflect recorded activity.
						</Text>
						<ChoiceBox
							mode="outlined"
							label="Weight Units"
							elements={WEIGHT_UNITS}
						/>
						<ChoiceBox
							mode="outlined"
							label="Distance Units"
							elements={DISTANCE_UNITS}
						/>
					</View>

					<View className="mx-4 gap-2">
						<Text variant="titleSmall">Language</Text>
						<Button mode="outlined">Change language in System Settings</Button>
					</View>
				</View>
			</ScrollView>
		</ThemedView>
	);
}
