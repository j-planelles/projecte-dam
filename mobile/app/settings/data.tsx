import React from "react";
import { ScrollView, View } from "react-native";
import { Button, Text } from "react-native-paper";
import Header from "../../components/ui/Header";

export default function DataSettingsPage() {
	return (
		<View className="flex-1">
			<Header title="Import/Export data" />
			<ScrollView>
				<View className="pt-4 gap-4">
					<View className="mx-4 gap-2">
						<Text variant="titleSmall">Import/Export Data from Ultra</Text>
						<Text variant="bodyMedium">
							Export data for use with the Ultra application.
						</Text>
						<Button mode="outlined">Export Ultra data</Button>
						<Button mode="outlined">Import Ultra data</Button>
					</View>

					<View className="mx-4 gap-2">
						<Text variant="titleSmall">Import Strong Data</Text>
						<Text variant="bodyMedium">Import data from the Strong app.</Text>
						<Button mode="outlined">Import Strong data</Button>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}
