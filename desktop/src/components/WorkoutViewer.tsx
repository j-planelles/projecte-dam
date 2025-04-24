import { Box, Divider, Typography } from "@mui/material";

export default function WorkoutViewer({
	workout,
	timestamp = true,
	location = true,
	creator = false,
}: {
	workout: workout;
	timestamp?: boolean;
	location?: boolean;
	creator?: boolean;
}) {
	return (
		<Box>
			<WorkoutInformation
				workout={workout}
				timestamp={timestamp}
				location={location}
				creator={creator}
			/>
			<WorkoutExercises exercises={workout.exercises} />
		</Box>
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
	const durationSeconds = Math.trunc(workout.duration % 60);
	const durationMinutes = Math.trunc(workout.duration / 60);
	const durationText = `${durationMinutes}:${String(durationSeconds).padStart(2, "0")}`;

	return (
		<Box className="flex flex-col gap-2">
			<Box>
				<Typography variant="h3">{workout.title}</Typography>
				{creator && (
					<Typography variant="body1">by {workout.creator}</Typography>
				)}
			</Box>

			{workout.description && (
				<Typography variant="h6">{workout.description}</Typography>
			)}

			<Box>
				{timestamp && (
					<Typography variant="body1">
						{`${timestampDate.toLocaleString()} for ${durationText}`}
					</Typography>
				)}
				{location && workout.gym && (
					<Typography variant="body2" sx={{ color: "text.secondary" }}>
						{workout.gym}
					</Typography>
				)}
			</Box>
		</Box>
	);
};

const WorkoutExercises = ({
	exercises,
}: {
	exercises: workoutExercise[];
}) => {
	return (
		<Box>
			{exercises.map((exercise, index) => (
				<WorkoutExercise key={index} exercise={exercise} />
			))}
		</Box>
	);
};

const WorkoutExercise = ({
	exercise,
}: {
	exercise: workoutExercise;
}) => {
	return (
		<Box className="flex flex-col">
			<Typography className="py-2">{exercise.exercise.name}</Typography>

			{exercise.sets.map((set, index) => (
				<WorkoutSet key={index} set={set} index={index} />
			))}
		</Box>
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
		<Box className="flex flex-1 flex-row items-center py-2">
			<Typography className="w-12 px-4" sx={{ color: "text.secondary" }}>
				{set.type === "normal" ? index + 1 : set.type === "dropset" ? "D" : "F"}
			</Typography>
			<Typography className="flex-1 px-2">{set.weight} kg</Typography>
			<Typography className="flex-1 px-2">{set.reps} reps</Typography>
		</Box>
	);
};
