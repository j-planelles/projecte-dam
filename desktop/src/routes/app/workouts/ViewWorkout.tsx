import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useParams } from "react-router";
import { useShallow } from "zustand/react/shallow";
import WorkoutViewer from "../../../components/WorkoutViewer";
import { useAuthStore } from "../../../store/auth-store";

export default function ViewWorkoutPage() {
  const { "workout-uuid": workoutUuid } = useParams();
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );
  const { data, isLoading, isSuccess, error } = useQuery({
    queryKey: ["user", "/user/workouts", workoutUuid],
    queryFn: async () =>
      await apiClient.get("/user/workouts/:workout_uuid", {
        params: { workout_uuid: workoutUuid ? workoutUuid : "" },
        headers: { Authorization: `Bearer ${token}` },
      }),
  });

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
      {isLoading && (
        <Box className="flex items-center justify-center">
          <CircularProgress />
        </Box>
      )}
      {error && <Typography color="error">{error.message}</Typography>}
      {isSuccess && <WorkoutViewer workout={workout} />}
    </Container>
  );
}
