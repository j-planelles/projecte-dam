import { useState } from "react";
import { FlatList, View } from "react-native";
import { Appbar, Button, List, Searchbar, useTheme } from "react-native-paper";
import { FilterIcon } from "../../../components/Icons";
import Header from "../../../components/ui/Header";
import { SAMPLE_GYMS } from "../../../lib/sampleData";

export default function OngoingWorkoutSelectGymPage() {
	const theme = useTheme();
	const [selectedGym, setSelectedGym] = useState<string>("");
	const [searchTerm, setSearchTerm] = useState<string>("");

	return (
		<View className="flex-1">
			<Header title="Change gym" />
			<View className="px-4 py-2">
				<Searchbar
					value={searchTerm}
					onChangeText={setSearchTerm}
					placeholder="Search gyms..."
				/>
			</View>

			<FlatList
				data={SAMPLE_GYMS}
				keyExtractor={(item) =>
					item.uuid ? item.uuid : Math.random().toString()
				}
				renderItem={({ item }) => (
					<List.Item
						title={item.name}
						onPress={() =>
							setSelectedGym((state) => (item.uuid === state ? "" : item.uuid))
						}
						left={(props) =>
							item.uuid === selectedGym && <List.Icon {...props} icon="check" />
						}
						style={{
							backgroundColor:
								item.uuid === selectedGym
									? theme.colors.primaryContainer
									: "transparent",
						}}
					/>
				)}
			/>

			<View className="px-4 py-2 gap-2">
				<Button mode="contained">Save</Button>
			</View>
		</View>
	);
}
