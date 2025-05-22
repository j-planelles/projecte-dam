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
import TemplateEditPage from "./routes/app/templates/EditTemplate";
import RegisterPage from "./routes/landing/Register";
import RegisterProfilePage from "./routes/landing/RegisterProfile";
import SettingsPage from "./routes/app/Settings";
import TrainerMessageBoardPage from "./routes/app/trainer/MessageBoard";

/**
 * Definició de la jerarquia de rutes de l'aplicació web amb React Router.
 * Inclou rutes per a l'app principal, gestió d'entrenaments, plantilles, exercicis,
 * entrenador, configuració i el procés de landing/login/registre.
 */

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorElement />,
    element: <RootLayout />,
    children: [
      // Redirecció inicial segons l'estat de l'usuari
      { index: true, element: <RootRedirector /> },

      // Rutes de l'aplicació principal
      {
        path: "app",
        element: <AppLayout />,
        children: [
          // Dashboard principal
          { path: "dashboard", element: <DashboardPage /> },

          // Entrenaments
          {
            path: "workouts",
            children: [
              { index: true, element: <WorkoutsPage /> },
              { path: ":workout-uuid", element: <ViewWorkoutPage /> },
            ],
          },

          // Plantilles d'entrenament
          {
            path: "templates",
            children: [
              { index: true, element: <TemplatesPage /> },
              { path: "new", element: <TemplateEditPage /> },
              {
                path: ":template-uuid",
                children: [
                  { index: true, element: <ViewTemplatePage /> },
                  { path: "edit", element: <TemplateEditPage /> },
                ],
              },
            ],
          },

          // Exercicis
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

          // Gestió d'entrenador i usuaris
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
                    children: [
                      { index: true, element: <TrainerViewUserPage /> },
                      {
                        path: "messages",
                        element: <TrainerMessageBoardPage />,
                      },
                    ],
                  },
                ],
              },
              { path: "requests", element: <TrainerRequestsPage /> },
            ],
          },

          // Configuració general
          { path: "settings", element: <SettingsPage /> },
        ],
        errorElement: <ErrorElement />,
      },

      // Rutes de landing, login i registre
      {
        path: "landing",
        element: <LandingLayout />,
        children: [
          { path: "server", element: <ServerSelectionPage /> },
          { path: "login", element: <LoginPage /> },
          { path: "register", element: <RegisterPage /> },
          { path: "register-profile", element: <RegisterProfilePage /> },
        ],
      },
    ],
  },
]);

/**
 * Renderitza l'aplicació React amb el proveïdor de rutes i el reset de CSS.
 */
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <>
    <CssBaseline />
    <RouterProvider router={router} />
  </>,
);
