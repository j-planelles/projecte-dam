import { ScrollView, View } from "react-native";
import { Divider, Text } from "react-native-paper";

export default function WorkoutViewer({
	workout,
	timestamp = true,
	location = true,
	creator = true,
}: {
	workout: workout;
	timestamp?: boolean;
	location?: boolean;
	creator?: boolean;
}) {
	return (
		<ScrollView>
			<View className="pt-4 gap-2">
				<WorkoutInformation
					workout={workout}
					timestamp={timestamp}
					location={location}
					creator={creator}
				/>
				<WorkoutExercises exercises={workout.exercises} />
			</View>
		</ScrollView>
	);
}

const WorkoutInformation = ({
	workout,
	timestamp,
	location,
	creator,
}: {
	workout: workout;
	timestamp: boolean;
	location: boolean;
	creator: boolean;
}) => {
	const timestampDate = new Date(workout.timestamp);
	const durationDate = new Date(workout.duration);
	const durationText = `${String(durationDate.getHours()).padStart(2, "0")}:${String(durationDate.getMinutes()).padStart(2, "0")}`;

	return (
		<View className="px-4 gap-2">
			<View>
				<Text variant="titleLarge">{workout.title}</Text>
				{creator && <Text variant="titleSmall">by {workout.creator}</Text>}
			</View>

			<Text variant="bodyLarge">{workout.description}</Text>

			{timestamp && (
				<Text variant="titleMedium">
					{`${timestampDate.toLocaleString()} for ${durationText}`}
				</Text>
			)}

			{location && <Text variant="titleMedium">{workout.gym}</Text>}
		</View>
	);
};

const WorkoutExercises = ({
	exercises,
}: {
	exercises: workoutExercise[];
}) => {
	return (
		<>
			<Divider />
			{exercises.map((exercise, index) => (
				<WorkoutExercise key={index} exercise={exercise} />
			))}
		</>
	);
};

const WorkoutExercise = ({
	exercise,
}: {
	exercise: workoutExercise;
}) => {
	return (
		<View>
			<View className="flex-1 flex-row items-center pl-4 pr-2">
				<Text variant="titleMedium" className="flex-1">
					{exercise.exercise.name}
				</Text>
			</View>

			{exercise.sets.map((set, index) => (
				<WorkoutSet key={index} set={set} index={index} />
			))}

			<Divider />
		</View>
	);
};

const WorkoutSet = ({
	set,
	index,
}: {
	set: exerciseSet;
	index: number;
}) => {
	return (
		<View className="flex-1 flex-row items-center py-2 px-4">
			<Text variant="titleMedium" className="w-12 px-4">
				{index + 1}
			</Text>
			<Text variant="bodyLarge" className="flex-1 px-2">
				{set.weight} kg
			</Text>
			<Text variant="bodyLarge" className="flex-1 px-2">
				{set.reps} reps
			</Text>
		</View>
	);
};
