import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Container, Typography } from "@mui/material";
import WorkoutCard from "../../../components/WorkoutCard";
import { SAMPLE_WORKOUTS } from "../../../lib/sampleData";
import { Link } from "react-router";
import { useState } from "react";
import SearchField from "../../../components/SearchField";

export default function TemplatesPage() {
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [showSearchBox, setShowSearchBox] = useState<boolean>(false);

	return (
		<Container>
			<Box className="flex flex-1 flex-col gap-4 mb-2">
				<Box className="flex flex-row gap-4">
					<Typography variant="h6" className="flex-grow">
						My Templates
					</Typography>
					<Button
						variant={showSearchBox ? "filled" : "outlined"}
						startIcon={<SearchIcon />}
						onClick={() => setShowSearchBox((value) => !value)}
					>
						Search
					</Button>
					<Link to="/app/templates/new">
						<Button variant="outlined" startIcon={<AddIcon />}>
							Create template
						</Button>
					</Link>
				</Box>

				{showSearchBox && (
					<SearchField
						value={searchTerm}
						onValueChange={(event) => {
							setSearchTerm(event.target.value);
						}}
						placeholder="Search templates"
					/>
				)}

				{SAMPLE_WORKOUTS.filter(
					(workout) =>
						!showSearchBox ||
						!searchTerm ||
						workout.title
							.trim()
							.toLowerCase()
							.indexOf(searchTerm.trim().toLowerCase()) !== -1,
				).map((workout) => (
					<Link key={workout.uuid} to={`/app/templates/${workout.uuid}`}>
						<WorkoutCard workout={workout} showTimestamp={false} />
					</Link>
				))}
			</Box>
		</Container>
	);
}
