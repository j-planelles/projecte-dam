import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { useShallow } from "zustand/react/shallow";
import WorkoutCard from "../../../components/WorkoutCard";
import { useAuthStore } from "../../../store/auth-store";

/**
 * Pàgina de llistat d'entrenaments de l'usuari.
 * Mostra tots els entrenaments guardats, amb accés directe a cada un.
 * Mostra un loader mentre es carrega, errors si n'hi ha, i un missatge si no hi ha entrenaments.
 * @returns {JSX.Element} El component de la pàgina de llistat d'entrenaments.
 */
export default function WorkoutsPage() {
  // Obté l'apiClient i el token d'autenticació de l'store d'usuari
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  // Consulta la llista d'entrenaments de l'usuari
  const { data, isLoading, isSuccess, error } = useQuery({
    queryKey: ["user", "/user/workouts"],
    queryFn: async () =>
      await apiClient.get("/user/workouts", {
        headers: { Authorization: `Bearer ${token}` },
      }),
  });

  return (
    <Container>
      <Box className="flex flex-1 flex-col gap-4">
        {/* Loader mentre es carrega la llista */}
        {isLoading && (
          <Box className="flex items-center justify-center">
            <CircularProgress />
          </Box>
        )}

        {/* Missatge d'error si la consulta falla */}
        {error && <Typography color="error">{error.message}</Typography>}

        {/* Llista d'entrenaments si la consulta té èxit */}
        {isSuccess &&
          !!data &&
          (data.length > 0 ? (
            // Mostra cada entrenament com a enllaç a la seva pàgina de detall
            data
              .map(
                (data) =>
                  ({
                    uuid: data.uuid,
                    title: data.name,
                    description: data.description,
                    timestamp: data.instance?.timestamp_start || 0,
                    duration: data.instance?.duration || 0,
                    exercises: data.entries.map((entry) => ({
                      restCountdownDuration: entry.rest_countdown_duration,
                      weightUnit: entry.weight_unit,
                      exercise: {
                        uuid: entry.exercise.uuid,
                        name: entry.exercise.name,
                        description: entry.exercise.description,
                        bodyPart: entry.exercise.body_part,
                        type: entry.exercise.type,
                      },
                      sets: entry.sets.map((set) => ({
                        reps: set.reps,
                        weight: set.weight,
                      })),
                    })),
                  }) as workout,
              )
              .map((workout) => (
                <Link key={workout.uuid} to={`/app/workouts/${workout.uuid}`}>
                  <WorkoutCard workout={workout} />
                </Link>
              ))
          ) : (
            // Missatge si no hi ha entrenaments
            <Box className="flex flex-col items-center gap-2">
              <FitnessCenterIcon sx={{ width: 180, height: 180 }} />
              <Typography variant="h4">No workouts found...</Typography>
            </Box>
          ))}
      </Box>
    </Container>
  );
}
