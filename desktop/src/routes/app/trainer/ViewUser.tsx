import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RemoveIcon from "@mui/icons-material/Remove";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import {
	Avatar,
	Box,
	Button,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { Link, useParams } from "react-router";
import WorkoutCard from "../../../components/WorkoutCard";
import { SAMPLE_USERS, SAMPLE_WORKOUTS } from "../../../lib/sampleData";

export default function TrainerViewUserPage() {
	return (
		<Container>
			<UserInfo />
			<RecommendedWorkoutsList />
		</Container>
	);
}

const UserInfo = () => {
	const { "user-uuid": userUuid } = useParams();

	const user = SAMPLE_USERS.filter((user) => user.uuid === userUuid)[0];

	return (
		<Box className="flex flex-row gap-6 items-center">
			<Box className="flex">
				<Avatar sx={{ height: 128, width: 128, fontSize: 64 }}>
					{user.name.charAt(0).toUpperCase()}
				</Avatar>
			</Box>
			<Box className="flex flex-grow flex-col">
				<Typography variant="h3">{user.name}</Typography>
				<Typography variant="body2" sx={{ color: "text.secondary" }}>
					{user.username}
				</Typography>
				<Typography sx={{ marginTop: 1 }}>{user.description}</Typography>
			</Box>
			<Box className="flex flex-col items-top">
				<UserMenu />
			</Box>
		</Box>
	);
};

const UserMenu = () => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const unlinkUserHandler = () => {
		handleClose();
	};

	return (
		<>
			<IconButton onClick={handleClick}>
				<MoreVertIcon />
			</IconButton>
			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
			>
				<MenuItem onClick={unlinkUserHandler}>
					<ListItemIcon>
						<PersonRemoveIcon />
					</ListItemIcon>
					<ListItemText>Unlink user</ListItemText>
				</MenuItem>
			</Menu>
		</>
	);
};

const RecommendedWorkoutsList = () => {
	const [workoutModalUUID, setWorkoutModalUUID] = useState<string | null>(null);
	const [showWorkoutAddModal, setShowWorkoutAddModal] =
		useState<boolean>(false);

	return (
		<>
			<Box className="mt-4">
				<Box className="flex flex-row gap-4">
					<Typography variant="h6" className="flex-grow">
						Recommended Templates
					</Typography>
					<Button
						variant="outlined"
						startIcon={<AddIcon />}
						onClick={() => {
							setShowWorkoutAddModal(true);
						}}
					>
						Add template
					</Button>
				</Box>
				<Box className="flex flex-1 flex-col gap-4 mt-4">
					{SAMPLE_WORKOUTS.map((workout) => (
						<WorkoutCard
							key={workout.uuid}
							workout={workout}
							showTimestamp={false}
							onClick={() => {
								setWorkoutModalUUID(workout.uuid);
							}}
						/>
					))}
				</Box>
			</Box>
			<WorkoutInfoModal
				workoutUUID={workoutModalUUID}
				onClose={() => {
					setWorkoutModalUUID(null);
				}}
			/>
			<WorkoutAddModal
				show={showWorkoutAddModal}
				onClose={() => {
					setShowWorkoutAddModal(false);
				}}
			/>
		</>
	);
};

const WorkoutInfoModal = ({
	workoutUUID,
	onClose,
}: { workoutUUID: string | null; onClose: () => void }) => {
	const unrecommendHandler = () => {
		onClose();
	};

	return (
		<Dialog
			open={workoutUUID !== null}
			onClose={onClose}
			maxWidth="md"
			fullWidth
			scroll="paper"
		>
			<DialogTitle>Workout information</DialogTitle>
			<DialogContent>
				<DialogContentText>prova</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Link to={`/app/template/${workoutUUID}`}>
					<Button startIcon={<EditIcon />}>Edit</Button>
				</Link>
				<Button onClick={unrecommendHandler} startIcon={<RemoveIcon />}>
					Remove
				</Button>
				<Button onClick={onClose} startIcon={<CloseIcon />}>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
};

const WorkoutAddModal = ({
	show,
	onClose,
}: { show: boolean; onClose: () => void }) => {
	const addHandler = () => {
		onClose();
	};

	return (
		<Dialog
			open={show}
			onClose={onClose}
			maxWidth="md"
			fullWidth
			scroll="paper"
		>
			<DialogTitle>Add a template</DialogTitle>
			<DialogContent>
				<Box className="flex flex-1 flex-col gap-4">
					{SAMPLE_WORKOUTS.map((workout) => (
						<WorkoutCard
							key={workout.uuid}
							workout={workout}
							showTimestamp={false}
						/>
					))}
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} startIcon={<CloseIcon />}>
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	);
};
