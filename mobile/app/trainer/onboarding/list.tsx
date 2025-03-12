import { useRouter } from "expo-router";
import { FlatList, View } from "react-native";
import { Avatar, Button, List, Text } from "react-native-paper";
import { NavigateNextIcon } from "../../../components/Icons";
import Header from "../../../components/ui/Header";
import { useState } from "react";
import { SAMPLE_TRAINERS } from "../../../lib/sampleData";

export default function TrainerOnboardingListPage() {
	const router = useRouter();
	const [selectedTrainer, setSelectedTrainer] = useState<string>("");

	const navigationDisabled = selectedTrainer === "";

	const handleSubmit = () => {
		router.push("/");
	};

	return (
		<View className="flex-1">
			<Header title="Choose your trainer" />

			<FlatList
				data={SAMPLE_TRAINERS}
				keyExtractor={(item) => item.username}
				renderItem={({ item }) => (
					<List.Item
						title={item.name}
						description={item.description}
						left={() => (
							<View className="pl-4">
								{selectedTrainer === item.username ? (
									<Avatar.Icon size={48} icon="check" />
								) : (
									<Avatar.Text size={48} label={item.name.charAt(0)} />
								)}
							</View>
						)}
						onPress={() =>
							selectedTrainer === item.username
								? setSelectedTrainer("")
								: setSelectedTrainer(item.username)
						}
					/>
				)}
			/>

			<View className="p-4 gap-4">
				{navigationDisabled && <Text>Please select a trainer.</Text>}
				<Button
					className="w-full"
					icon={({ color }) => <NavigateNextIcon color={color} />}
					disabled={navigationDisabled}
					mode="contained"
					onPress={handleSubmit}
				>
					Next
				</Button>
			</View>
		</View>
	);
}

const TrainerCard = ({ trainer }: { trainer: trainer }) => {
	return <List.Item title />;
};
