import { useRouter } from "expo-router";
import { View } from "react-native";
import { Button } from "react-native-paper";
import WorkoutViewer from "../../../components/pages/WorkoutViewer";
import Header from "../../../components/ui/Header";
import { SAMPLE_WORKOUTS } from "../../../lib/sampleData";

export default function ViewCommunityTemplatePage() {
	const router = useRouter();

	return (
		<View className="flex-1">
			<Header title="View Community Template" />
			<WorkoutViewer
				workout={SAMPLE_WORKOUTS[0]}
				timestamp={false}
				location={false}
			/>

			<View className="p-4">
				<Button
					mode="contained"
					onPress={() => router.replace("/workout/template-view/antoino")}
				>
					Save template
				</Button>
			</View>
		</View>
	);
}
