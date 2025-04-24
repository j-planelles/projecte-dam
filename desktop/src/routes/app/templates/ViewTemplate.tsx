import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
	Box,
	Button,
	Container,
	IconButton,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
} from "@mui/material";
import { Link, useParams } from "react-router";
import WorkoutViewer from "../../../components/WorkoutViewer";
import { SAMPLE_WORKOUTS } from "../../../lib/sampleData";
import React from "react";

export default function ViewTemplatePage() {
	const { "template-uuid": workoutUuid } = useParams();

	const workout = SAMPLE_WORKOUTS.filter(
		(workout) => workout.uuid === workoutUuid,
	)[0];

	return (
		<Container>
			<ActionButtons />
			<WorkoutViewer workout={workout} timestamp={false} location={false} />
		</Container>
	);
}

const ActionButtons = () => {
	return (
		<Box className="flex flex-row justify-end gap-2">
			<Link to="edit">
				<Button variant="outlined" startIcon={<EditIcon />}>
					Edit
				</Button>
			</Link>
			<Button variant="outlined" color="error" startIcon={<DeleteIcon />}>
				Delete
			</Button>
		</Box>
	);
};
