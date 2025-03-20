import { Link, Stack, useRouter } from "expo-router";
import { FlatList, Pressable, View } from "react-native";
import { Appbar, Button, IconButton, List, Text } from "react-native-paper";
import { AddIcon, DumbellIcon } from "../../components/Icons";
import Header from "../../components/ui/Header";
import { SAMPLE_EXERCISES } from "../../lib/sampleData";
import { useExerciseStore } from "../../store/exercise-store";
import { useShallow } from "zustand/react/shallow";
import { useMemo } from "react";
import { ThemedView } from "../../components/ui/screen/Screen";

export default function ExerciseListPage() {
	const router = useRouter();
	const exercises = useExerciseStore((state) => state.exercises);
	const sortedExercises = useMemo(
		() =>
			(JSON.parse(JSON.stringify(exercises)) as exercise[]).sort((a, b) => {
				const nameA = a.name;
				const nameB = b.name;

				if (nameA < nameB) {
					return -1;
				}
				if (nameA > nameB) {
					return 1;
				}
				return 0;
			}),
		[exercises],
	);

	return (
		<ThemedView className="flex-1">
			<Header title="Manage Exercises">
				<Appbar.Action
					icon={({ color }) => <AddIcon color={color} />}
					onPress={() => {
						router.push("/workout/exercise-edit/");
					}}
				/>
			</Header>
			<FlatList
				data={sortedExercises}
				keyExtractor={(item) =>
					item.uuid === undefined ? Math.random().toString() : item.uuid
				}
				renderItem={({ item }) => (
					<Link asChild href={`/workout/exercise-edit/${item.uuid}`}>
						<List.Item title={item.name} />
					</Link>
				)}
				ListEmptyComponent={<ExerciseListEmptyComponent />}
			/>
		</ThemedView>
	);
}

const ExerciseListEmptyComponent = () => {
	const loadSampleData = useExerciseStore((state) => state.loadSampleData);

	return (
		<View className="flex-1 items-center gap-8 pt-16">
			<DumbellIcon size={96} />
			<Text variant="headlineLarge">No exercises...</Text>
			<View className="flex-1 gap-4">
				<Link href="/workout/exercise-edit">
					<Button mode="contained">Create an exercise</Button>
				</Link>
				<Button onPress={loadSampleData}>Load default exercises</Button>
			</View>
		</View>
	);
};
