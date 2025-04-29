import { CssBaseline } from "@mui/material";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import "./main.css";
import ErrorElement from "./routes/ErrorElement";
import { RootLayout, RootRedirector } from "./routes/Root";
import AppLayout from "./routes/app/AppLayout";
import DashboardPage from "./routes/app/Dashboard";
import TemplatesPage from "./routes/app/templates/Templates";
import TrainerEnrollPage from "./routes/app/trainer/Enroll";
import TrainerRequestsPage from "./routes/app/trainer/Requests";
import TrainerUsersPage from "./routes/app/trainer/Users";
import TrainerViewUserPage from "./routes/app/trainer/ViewUser";
import ViewWorkoutPage from "./routes/app/workouts/ViewWorkout";
import WorkoutsPage from "./routes/app/workouts/Workouts";
import LandingLayout from "./routes/landing/LandingLayout";
import LoginPage from "./routes/landing/Login";
import ServerSelectionPage from "./routes/landing/ServerSelection";
import ViewTemplatePage from "./routes/app/templates/ViewTemplate";
import ExerciseListPage from "./routes/app/exercises/ExerciseList";
import ExerciseEditPage from "./routes/app/exercises/ExerciseEditor";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorElement />,
    element: <RootLayout />,
    children: [
      { index: true, element: <RootRedirector /> },
      {
        path: "app",
        element: <AppLayout />,
        children: [
          { path: "dashboard", element: <DashboardPage /> },
          {
            path: "workouts",
            children: [
              { index: true, element: <WorkoutsPage /> },
              { path: ":workout-uuid", element: <ViewWorkoutPage /> },
            ],
          },
          {
            path: "templates",
            children: [
              { index: true, element: <TemplatesPage /> },
              { path: "new", element: <></> }, // TODO: New template page
              {
                path: ":template-uuid",
                children: [
                  { index: true, element: <ViewTemplatePage /> },
                  { path: "edit", element: <></> }, // TODO: Edit template page
                ],
              },
            ],
          },
          {
            path: "exercises",
            children: [
              { index: true, element: <ExerciseListPage /> },
              { path: "new", element: <ExerciseEditPage /> },
              {
                path: ":exercise-uuid",
                children: [{ index: true, element: <ExerciseEditPage /> }],
              },
            ],
          },
          {
            path: "trainer",
            children: [
              { path: "enroll", element: <TrainerEnrollPage /> },
              {
                path: "users",
                children: [
                  { index: true, element: <TrainerUsersPage /> },
                  {
                    path: ":user-uuid",
                    element: <TrainerViewUserPage />,
                  },
                ],
              },
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
