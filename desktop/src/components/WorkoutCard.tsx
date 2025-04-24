import { Card, CardActionArea, CardContent, Typography } from "@mui/material";

export default function WorkoutCard({
	workout,
	onClick,
	className,
	showDescription = true,
	showTimestamp = true,
}: {
	workout: workout;
	onClick?: () => void;
	className?: string;
	showDescription?: boolean;
	showTimestamp?: boolean;
}) {
	return (
		<Card variant="outlined" onClick={onClick}>
			<CardActionArea>
				<CardContent>
					<Typography variant="h6" component="div">
						{workout.title}
					</Typography>
					{showDescription && workout.description && (
						<Typography gutterBottom variant="body1" component="div">
							{workout.description}
						</Typography>
					)}
					{showTimestamp && workout.timestamp && (
						<Typography gutterBottom variant="body2" component="div">
							{parseTimestamp(workout.timestamp, workout.duration)}
						</Typography>
					)}
					<Typography variant="body2" sx={{ color: "text.secondary" }}>
						{parseExercises(workout.exercises).map((exercise, index) => (
							<div key={index}>{exercise}</div>
						))}
					</Typography>
				</CardContent>
			</CardActionArea>
		</Card>
	);
}

const parseTimestamp = (timestamp: number, duration: number) => {
	const timestampDate = new Date(timestamp);
	const durationSeconds = Math.trunc(duration % 60);
	const durationMinutes = Math.trunc(duration / 60);
	const durationText = `${durationMinutes}:${String(durationSeconds).padStart(2, "0")}`;

	return `${timestampDate.toLocaleString()} for ${durationText}`;
};

const parseExercises = (exercises: workoutExercise[]) =>
	exercises.length <= 4
		? exercises.map((value) => `${value.sets.length}x ${value.exercise.name}`)
		: [
				...exercises
					.slice(0, 3)
					.map((value) => `${value.sets.length}x ${value.exercise.name}`),
				`${exercises.slice(3).length} exercises more...`,
			];
