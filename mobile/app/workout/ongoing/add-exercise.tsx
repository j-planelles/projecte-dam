import { useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import {
	Appbar,
	Button,
	Chip,
	List,
	Searchbar,
	Text,
	useTheme,
} from "react-native-paper";
import { DumbellIcon, FilterIcon } from "../../../components/Icons";
import Header from "../../../components/ui/Header";
import { useExerciseStore } from "../../../store/exercise-store";
import { useWorkoutStore } from "../../../store/workout-store";
import { useRouter } from "expo-router";

export default function OngoingWorkoutAddExercisePage() {
	const theme = useTheme();
	const router = useRouter();

	const addExercises = useWorkoutStore((state) => state.addExercises);

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

	const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
	const [searchTerm, setSearchTerm] = useState<string>("");

	const addExerciseHandler = () => {
		const exercisesToAdd: workoutExercise[] = exercises
			.filter((item) => selectedExercises.includes(item.uuid))
			.map((item) => ({ exercise: item, sets: [] }));

		addExercises(exercisesToAdd);

		router.back();
	};

	return (
		<View className="flex-1">
			<Header title="Add exercise">
				<Appbar.Action icon={({ color }) => <FilterIcon color={color} />} />
			</Header>

			<View className="px-4 py-2">
				<Searchbar
					value={searchTerm}
					onChangeText={setSearchTerm}
					placeholder="Search exercises..."
				/>
			</View>

			<FlatList
				data={sortedExercises}
				keyExtractor={(item) =>
					item.uuid ? item.uuid : Math.random().toString()
				}
				renderItem={({ item }) => (
					<List.Item
						title={item.name}
						onPress={() =>
							item.uuid && selectedExercises.includes(item.uuid)
								? setSelectedExercises((state) =>
										state.filter((value) => value !== item.uuid),
									)
								: setSelectedExercises((state) =>
										item.uuid ? [...state, item.uuid] : state,
									)
						}
						left={(props) =>
							item.uuid &&
							selectedExercises.includes(item.uuid) && (
								<List.Icon {...props} icon="check" />
							)
						}
						style={{
							backgroundColor:
								item.uuid && selectedExercises.includes(item.uuid)
									? theme.colors.primaryContainer
									: "transparent",
						}}
					/>
				)}
				ListEmptyComponent={<ExerciseListEmptyComponent />}
			/>

			{selectedExercises.length > 0 && (
				<View className="px-4 py-2 gap-2">
					<View className="flex-row gap-2 flex-wrap">
						{selectedExercises.map((exerciseId) => {
							const exercise = exercises.filter(
								(item) => item.uuid === exerciseId,
							)[0];
							return <Chip key={exerciseId}>{exercise.name}</Chip>;
						})}
					</View>
					<Button mode="contained" onPress={addExerciseHandler}>
						{selectedExercises.length > 1
							? `Add ${selectedExercises.length} exercises`
							: "Add exercise"}
					</Button>
				</View>
			)}
		</View>
	);
}

const ExerciseListEmptyComponent = () => {
	return (
		<View className="flex-1 items-center gap-8 pt-16">
			<DumbellIcon size={96} />
			<View className="gap-4 items-center">
				<Text variant="headlineLarge">No exercises</Text>
				<Text variant="bodyMedium">
					Go to exercise manager to create new exercises.
				</Text>
			</View>
		</View>
	);
};
