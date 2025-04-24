import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Container, Typography } from "@mui/material";
import WorkoutCard from "../../components/WorkoutCard";
import { SAMPLE_WORKOUTS } from "../../lib/sampleData";
import { Link } from "react-router";

export default function TemplatesPage() {
	return (
		<Container>
			<Box className="flex flex-1 flex-col gap-4">
				<Box className="flex flex-row gap-4">
					<Typography variant="h6" className="flex-grow">
						My Templates
					</Typography>
					<Link to="/app/templates/new">
						<Button variant="outlined" startIcon={<AddIcon />}>
							Create template
						</Button>
					</Link>
				</Box>

				{SAMPLE_WORKOUTS.map((workout) => (
					<Link key={workout.uuid} to={`/app/templates/${workout.uuid}`}>
						<WorkoutCard workout={workout} showTimestamp={false} />
					</Link>
				))}
			</Box>
		</Container>
	);
}
