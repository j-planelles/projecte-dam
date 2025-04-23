import { CssBaseline } from "@mui/material";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import "./main.css";
import ErrorElement from "./routes/ErrorElement";
import { RootRedirector } from "./routes/Root";
import AppLayout from "./routes/app/AppLayout";
import DashboardPage from "./routes/app/Dashboard";
import TemplatesPage from "./routes/app/Templates";
import WorkoutsPage from "./routes/app/Workouts";
import TrainerEnrollPage from "./routes/app/trainer/Enroll";
import LandingLayout from "./routes/landing/LandingLayout";
import LoginPage from "./routes/landing/Login";
import ServerSelectionPage from "./routes/landing/ServerSelection";
import TrainerUsersPage from "./routes/app/trainer/Users";
import TrainerRequestsPage from "./routes/app/trainer/Requests";

const router = createBrowserRouter([
	{
		path: "/",
		errorElement: <ErrorElement />,
		children: [
			{ index: true, element: <RootRedirector /> },
			{
				path: "app",
				element: <AppLayout />,
				children: [
					{ path: "dashboard", element: <DashboardPage /> },
					{ path: "workouts", element: <WorkoutsPage /> },
					{ path: "templates", element: <TemplatesPage /> },
					{
						path: "trainer",
						children: [
							{ path: "enroll", element: <TrainerEnrollPage /> },
							{ path: "users", element: <TrainerUsersPage /> },
							{ path: "requests", element: <TrainerRequestsPage /> },
						],
					},
				],
				errorElement: <ErrorElement />,
			},
			{
				path: "landing",
				element: <LandingLayout />,
				children: [
					{ path: "server", element: <ServerSelectionPage /> },
					{ path: "login", element: <LoginPage /> },
				],
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<>
		<CssBaseline />
		<RouterProvider router={router} />
	</>,
);
