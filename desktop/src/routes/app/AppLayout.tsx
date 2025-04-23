import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import GroupIcon from "@mui/icons-material/Group";
import HomeIcon from "@mui/icons-material/Home";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
	AppBar,
	Avatar,
	Box,
	Button,
	IconButton,
	Modal,
	Paper,
	Toolbar,
	Tooltip,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router";
import NavigationBar, {
	type NavigationBarSection,
} from "../../components/NavigationBar";
import ThemeManager from "../../components/ThemeManager";

const navItems: NavigationBarSection[] = [
	{
		items: [{ name: "Dashboard", path: "/app/dashboard", icon: <HomeIcon /> }],
	},
	{
		title: "My workouts",
		items: [
			{ name: "Workouts", path: "/app/workouts", icon: <FitnessCenterIcon /> },
			{
				name: "Templates",
				path: "/app/templates",
				icon: <AutoAwesomeMotionIcon />,
			},
		],
	},
	{
		title: "Personal Trainer",
		items: [
			{ name: "Enroll", path: "/app/trainer/enroll", icon: <GroupIcon /> },
			{ name: "Users", path: "/app/trainer/users", icon: <GroupIcon /> },
			{
				name: "Requests",
				path: "/app/trainer/requests",
				icon: <PersonAddIcon />,
			},
		],
	},
];

export default function AppLayout() {
	return (
		<ThemeManager>
			<TopBar />
			<Box
				sx={{
					display: "flex",
					height: "100vh",
					overflow: "clip",
					backgroundColor: "background.default",
				}}
			>
				<NavigationBar items={navItems} />

				<Box
					component="main"
					sx={{
						flexGrow: 1,
						flex: "1 1 auto",
						p: 3,
						backgroundColor: "background.paper",
						borderTopLeftRadius: "32px",
						borderTopRightRadius: "32px",
						marginTop: "64px",
						marginRight: "16px",
						overflow: "scroll",
					}}
				>
					<Outlet />
				</Box>
			</Box>
		</ThemeManager>
	);
}

const TopBar = () => {
	return (
		<AppBar
			position="fixed"
			sx={{
				zIndex: (theme) => theme.zIndex.drawer + 1,
			}}
		>
			<Toolbar>
				<BackIcon />
				<Typography
					variant="h5"
					noWrap
					component="div"
					className="flex-grow"
					sx={{ fontWeight: "bold", marginLeft: 2 }}
				>
					Ultra Workout Manager
				</Typography>
				<MyAccountButton />
			</Toolbar>
		</AppBar>
	);
};

const BackIcon = () => {
	const navigate = useNavigate();

	const handleBack = () => {
		navigate(-1);
	};

	return (
		<IconButton size="medium" color="inherit" onClick={handleBack}>
			<ArrowBackIcon />
		</IconButton>
	);
};

const MyAccountButton = () => {
	const navigate = useNavigate();
	const [isDialogShown, setIsDialogShown] = useState<boolean>(false);

	const handleLogout = () => {
		setIsDialogShown(false);
		navigate("/landing/login");
	};

	return (
		<>
			<Tooltip title="My Account">
				<IconButton onClick={() => setIsDialogShown(true)} sx={{ p: 0 }}>
					<Avatar sx={{ backgroundColor: "primary.main" }}>J</Avatar>
				</IconButton>
			</Tooltip>
			<Modal open={isDialogShown} onClose={() => setIsDialogShown(false)}>
				<Box
					sx={{
						position: "absolute",
						right: "24px",
						top: "48px",
					}}
				>
					<Paper
						elevation={3}
						className="p-2 min-w-sm"
						sx={{
							backgroundColor: "background.default",
							borderRadius: "20px",
							overflow: "clip",
						}}
					>
						<Box
							className="flex flex-row items-center gap-4 p-2"
							sx={{
								backgroundColor: "background.paper",
								borderTopLeftRadius: "18px",
								borderTopRightRadius: "18px",
							}}
						>
							<Avatar sx={{ backgroundColor: "primary.main" }}>J</Avatar>
							<Typography variant="h6">Jordi Planelles</Typography>
						</Box>
						<Box
							className="flex gap-4 p-2 mt-2"
							sx={{
								backgroundColor: "background.paper",
								borderBottomLeftRadius: "18px",
								borderBottomRightRadius: "18px",
							}}
						>
							<Button
								variant="outlined"
								className="flex-1"
								onClick={handleLogout}
							>
								Log out
							</Button>
						</Box>
					</Paper>
				</Box>
			</Modal>
		</>
	);
};
