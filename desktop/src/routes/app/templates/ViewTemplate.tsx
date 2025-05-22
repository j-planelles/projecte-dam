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
import { handleError } from "../../../lib/errorHandler";
import { useAuthStore } from "../../../store/auth-store";

/**
 * Pàgina de visualització d'una plantilla d'entrenament.
 * Carrega les dades de la plantilla a partir de l'UUID de la ruta i mostra el seu detall.
 * Permet editar o eliminar la plantilla.
 * @returns {JSX.Element} El component de la pàgina de detall d'una plantilla.
 */
export default function ViewTemplatePage() {
  // Obté l'UUID de la plantilla des dels paràmetres de la ruta
  const { "template-uuid": workoutUuid } = useParams();

  // Obté l'apiClient i el token d'autenticació de l'store d'usuari
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  // Consulta les dades de la plantilla concreta
  const { data, isLoading, isSuccess, error } = useQuery({
    queryKey: ["user", "/user/templates", workoutUuid],
    queryFn: async () =>
      await apiClient.get("/user/templates/:template_uuid", {
        params: { template_uuid: workoutUuid ? workoutUuid : "" },
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
      {/* Mostra el detall de la plantilla i els botons d'acció si la consulta té èxit */}
      {isSuccess && (
        <>
          <ActionButtons />
          <WorkoutViewer workout={workout} timestamp={false} />
        </>
      )}
    </Container>
  );
}

/**
 * Botons d'acció per editar o eliminar la plantilla.
 * Gestiona la navegació i la petició d'eliminació.
 */
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

  /**
   * Handler per eliminar la plantilla.
   * Invalida la cache i redirigeix a la llista de plantilles.
   */
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
