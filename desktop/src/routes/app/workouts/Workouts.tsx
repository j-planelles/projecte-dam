import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { useShallow } from "zustand/react/shallow";
import WorkoutCard from "../../../components/WorkoutCard";
import { useAuthStore } from "../../../store/auth-store";

export default function WorkoutsPage() {
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );
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
        {isLoading && (
          <Box className="flex items-center justify-center">
            <CircularProgress />
          </Box>
        )}
        {error && <Typography color="error">{error.message}</Typography>}
        {isSuccess &&
          !!data &&
          (data.length > 0 ? (
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
            <Box className="flex flex-col items-center gap-2">
              <FitnessCenterIcon sx={{ width: 180, height: 180 }} />
              <Typography variant="h4">No workouts found...</Typography>
            </Box>
          ))}
      </Box>
    </Container>
  );
}
