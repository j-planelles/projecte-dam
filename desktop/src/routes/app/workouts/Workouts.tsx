import { Box, Container } from "@mui/material";
import WorkoutCard from "../../../components/WorkoutCard";
import { SAMPLE_WORKOUTS } from "../../../lib/sampleData";
import { Link } from "react-router";

export default function WorkoutsPage() {
	return (
		<Container>
			<Box className="flex flex-1 flex-col gap-4">
				{SAMPLE_WORKOUTS.map((workout) => (
					<Link key={workout.uuid} to={`/app/workouts/${workout.uuid}`}>
						<WorkoutCard workout={workout} />
					</Link>
				))}
			</Box>
		</Container>
	);
}
