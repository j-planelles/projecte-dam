import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useParams } from "react-router";
import { useShallow } from "zustand/react/shallow";
import WorkoutViewer from "../../../components/WorkoutViewer";
import { useAuthStore } from "../../../store/auth-store";

/**
 * Pàgina de visualització d'un entrenament concret.
 * Carrega les dades de l'entrenament a partir de l'UUID de la ruta i mostra el seu detall.
 * Mostra un loader mentre es carrega, errors si n'hi ha, i el detall si la consulta té èxit.
 * @returns {JSX.Element} El component de la pàgina de detall d'un entrenament.
 */
export default function ViewWorkoutPage() {
  // Obté l'UUID de l'entrenament des dels paràmetres de la ruta
  const { "workout-uuid": workoutUuid } = useParams();

  // Obté l'apiClient i el token d'autenticació de l'store d'usuari
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  // Consulta les dades de l'entrenament concret
  const { data, isLoading, isSuccess, error } = useQuery({
    queryKey: ["user", "/user/workouts", workoutUuid],
    queryFn: async () =>
      await apiClient.get("/user/workouts/:workout_uuid", {
        params: { workout_uuid: workoutUuid ? workoutUuid : "" },
        headers: { Authorization: `Bearer ${token}` },
      }),
  });

  /**
   * Construeix l'objecte workout a partir de les dades rebudes de l'API.
   * Utilitza useMemo per evitar càlculs innecessaris.
   */
  const workout = useMemo(
    () =>
      ({
        uuid: data?.uuid,
        title: data?.name,
        description: data?.description,
        timestamp: data?.instance?.timestamp_start || 0,
        duration: data?.instance?.duration || 0,
        exercises: data?.entries.map((entry) => ({
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
            type: set.set_type,
          })),
        })),
      }) as workout,
    [data],
  );

  return (
    <Container>
      {/* Loader mentre es carrega la informació */}
      {isLoading && (
        <Box className="flex items-center justify-center">
          <CircularProgress />
        </Box>
      )}
      {/* Missatge d'error si la consulta falla */}
      {error && <Typography color="error">{error.message}</Typography>}
      {/* Mostra el detall de l'entrenament si la consulta té èxit */}
      {isSuccess && <WorkoutViewer workout={workout} />}
    </Container>
  );
}
