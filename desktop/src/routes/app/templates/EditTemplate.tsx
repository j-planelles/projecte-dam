import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useShallow } from "zustand/react/shallow";
import WorkoutEditor from "../../../components/WorkoutEditor";
import { useWorkoutStore } from "../../../store/workout-store";
import { useAuthStore } from "../../../store/auth-store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { handleError } from "../../../lib/errorHandler";

export default function TemplateEditPage() {
  const { "template-uuid": templateUuid } = useParams();
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );
  const { startWorkout, startEmptyWorkout } = useWorkoutStore(
    useShallow((state) => ({
      startWorkout: state.startWorkout,
      startEmptyWorkout: state.startEmptyWorkout,
    })),
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["user", "/user/templates", templateUuid],
    queryFn: async () =>
      await apiClient.get("/user/templates/:template_uuid", {
        params: { template_uuid: templateUuid ? templateUuid : "" },
        headers: { Authorization: `Bearer ${token}` },
      }),
    enabled: !!templateUuid,
  });

  useEffect(() => {
    if (!templateUuid) {
      startEmptyWorkout();
    } else {
      if (data) {
        const workout = {
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
              userNote: entry.exercise.user_note,
              bodyPart: entry.exercise.body_part,
              type: entry.exercise.type,
            },
            sets: entry.sets.map((set) => ({
              reps: set.reps,
              weight: set.weight,
              type: set.set_type,
            })),
          })),
        } as workout;
        startWorkout(workout);
      }
    }
  }, [startEmptyWorkout, startWorkout, templateUuid, data]);

  return (
    <Container>
      {error && <Typography color="error">{error.message}</Typography>}
      {isLoading || error ? (
        <Box className="flex items-center justify-center">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box className="flex flex-row gap-4 mb-2">
            <Typography variant="h6" className="flex-grow">
              {templateUuid ? "Edit template" : "Create template"}
            </Typography>
            <SaveTemplateButton />
          </Box>
          <WorkoutEditor />
        </>
      )}
    </Container>
  );
}

const SaveTemplateButton = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { "template-uuid": templateUuid } = useParams();
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  const workoutStore = useWorkoutStore(
    useShallow((state) => ({
      uuid: state.uuid,
      title: state.title,
      timestamp: state.timestamp,
      gym: state.gym,
      description: state.description,
      exercises: state.exercises,
    })),
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [queryError, setQueryError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    setQueryError(null);
    try {
      queryClient.invalidateQueries({
        queryKey: ["user", "/user/templates"],
      });
      if (templateUuid) {
        await apiClient.put(
          "/user/templates/:template_uuid",
          {
            uuid: workoutStore.uuid,
            name: workoutStore.title,
            description: workoutStore.description,
            entries: workoutStore.exercises.map((exercise) => ({
              rest_countdown_duration: exercise.restCountdownDuration,
              weight_unit: exercise.weightUnit,
              exercise: {
                uuid: exercise.exercise.uuid,
                name: exercise.exercise.name,
                description: exercise.exercise.description,
                user_note: exercise.exercise.userNote,
                body_part: exercise.exercise.bodyPart,
                type: exercise.exercise.type,
              },
              sets: exercise.sets.map((set) => ({
                reps: set.reps,
                weight: set.weight,
                set_type: set.type,
              })),
            })),
          },
          {
            params: { template_uuid: templateUuid },
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        navigate(`/app/templates/${templateUuid}`);
      } else {
        const response = await apiClient.post(
          "/user/templates",
          {
            uuid: workoutStore.uuid,
            name: workoutStore.title,
            description: workoutStore.description,
            entries: workoutStore.exercises.map((exercise) => ({
              rest_countdown_duration: exercise.restCountdownDuration,
              weight_unit: exercise.weightUnit,
              exercise: {
                uuid: exercise.exercise.uuid,
                name: exercise.exercise.name,
                description: exercise.exercise.description,
                user_note: exercise.exercise.userNote,
                body_part: exercise.exercise.bodyPart,
                type: exercise.exercise.type,
              },
              sets: exercise.sets.map((set) => ({
                reps: set.reps,
                weight: set.weight,
                set_type: set.type,
              })),
            })),
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        navigate(`/app/templates/${response.uuid}`);
      }
    } catch (error: unknown) {
      setQueryError(handleError(error));
    }
    setIsLoading(false);
  };

  return (
    <Button
      variant="outlined"
      startIcon={<SaveIcon />}
      disabled={isLoading}
      onClick={() => handleSubmit()}
    >
      {templateUuid ? "Update template" : "Save template"}
    </Button>
  );
};
