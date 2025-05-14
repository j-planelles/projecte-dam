import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useShallow } from "zustand/react/shallow";
import WorkoutViewer from "../../../components/WorkoutViewer";
import { useAuthStore } from "../../../store/auth-store";
import { handleError } from "../../../lib/errorHandler";

export default function ViewTemplatePage() {
  const { "template-uuid": workoutUuid } = useParams();
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );
  const { data, isLoading, isSuccess, error } = useQuery({
    queryKey: ["user", "/user/templates", workoutUuid],
    queryFn: async () =>
      await apiClient.get("/user/templates/:template_uuid", {
        params: { template_uuid: workoutUuid ? workoutUuid : "" },
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
      {isSuccess && (
        <>
          <ActionButtons />
          <WorkoutViewer workout={workout} timestamp={false} location={false} />
        </>
      )}
    </Container>
  );
}

const ActionButtons = () => {
  const { "template-uuid": workoutUuid } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  const [queryError, setQueryError] = useState<string | null>(null);

  const handleDelete = async () => {
    setQueryError(null);
    try {
      await apiClient.delete("/user/templates/:template_uuid", undefined, {
        params: { template_uuid: workoutUuid ? workoutUuid : "" },
        headers: { Authorization: `Bearer ${token}` },
      });
      queryClient.invalidateQueries({ queryKey: ["user", "/user/templates"] });
      navigate("/app/templates");
    } catch (error: unknown) {
      setQueryError(
        `Failed to remove template. Please remove any recommendations first. ${handleError(error)}`,
      );
    }
  };

  return (
    <>
      <Box className="flex flex-row items-center justify-end gap-2">
        {queryError && <Typography color="error">{queryError}</Typography>}
        <Link to="edit">
          <Button variant="outlined" startIcon={<EditIcon />}>
            Edit
          </Button>
        </Link>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDelete}
        >
          Delete
        </Button>
      </Box>
    </>
  );
};
