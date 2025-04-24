import { Container } from "@mui/material";
import { useParams } from "react-router";
import WorkoutViewer from "../../../components/WorkoutViewer";
import { SAMPLE_WORKOUTS } from "../../../lib/sampleData";

export default function ViewWorkoutPage() {
	const { "workout-uuid": workoutUuid } = useParams();

	const workout = SAMPLE_WORKOUTS.filter(
		(workout) => workout.uuid === workoutUuid,
	)[0];

	return (
		<Container>
			<WorkoutViewer workout={workout} />
		</Container>
	);
}
