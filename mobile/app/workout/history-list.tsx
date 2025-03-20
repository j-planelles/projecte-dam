import { FlatList, View } from "react-native";
import Screen, { BasicScreen } from "../../components/ui/screen/Screen";
import WorkoutCard from "../../components/ui/WorkoutCard";
import { Stack, useRouter } from "expo-router";
import { TouchableRipple } from "react-native-paper";
import Header from "../../components/ui/Header";
import { SAMPLE_WORKOUTS } from "../../lib/sampleData";

export default function TemplatesListPage() {
	const router = useRouter();

	return (
		<View className="flex-1">
			<Header title="Workout History" />
			<FlatList
				className="p-2"
				data={SAMPLE_WORKOUTS}
				keyExtractor={(item) => item.uuid}
				renderItem={({ item }) => (
					<WorkoutCard
						workout={item}
						className="mb-2"
						showDescription
						onPress={() => router.push(`/workout/workout-view/${item.uuid}`)}
					/>
				)}
			/>
		</View>
	);
}
