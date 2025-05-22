import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Portal,
  Snackbar,
  Typography,
} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useShallow } from "zustand/react/shallow";
import WorkoutEditor from "../../../components/WorkoutEditor";
import { handleError } from "../../../lib/errorHandler";
import { useAuthStore } from "../../../store/auth-store";
import { useWorkoutStore } from "../../../store/workout-store";

/**
 * Pàgina per crear o editar una plantilla d'entrenament.
 * Si es passa un UUID per la ruta, carrega la plantilla per editar-la; si no, crea una plantilla buida.
 * Mostra un loader mentre es carrega, errors si n'hi ha, i l'editor de plantilles.
 * @returns {JSX.Element} El component de la pàgina d'edició/creació de plantilles.
 */
export default function TemplateEditPage() {
  // Obté l'UUID de la plantilla des dels paràmetres de la ruta
  const { "template-uuid": templateUuid } = useParams();

  // Obté l'apiClient i el token d'autenticació de l'store d'usuari
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  // Accions per inicialitzar l'editor d'entrenament
  const { startWorkout, startEmptyWorkout } = useWorkoutStore(
    useShallow((state) => ({
      startWorkout: state.startWorkout,
      startEmptyWorkout: state.startEmptyWorkout,
    })),
  );

  // Consulta les dades de la plantilla si s'està editant
  const { data, isLoading, error } = useQuery({
    queryKey: ["user", "/user/templates", templateUuid],
    queryFn: async () =>
      await apiClient.get("/user/templates/:template_uuid", {
        params: { template_uuid: templateUuid ? templateUuid : "" },
        headers: { Authorization: `Bearer ${token}` },
      }),
    enabled: !!templateUuid,
  });

  /**
   * Inicialitza l'editor amb una plantilla buida o amb la plantilla carregada.
   */
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
      {/* Missatge d'error si la consulta falla */}
      {error && <Typography color="error">{error.message}</Typography>}
      {/* Loader mentre es carrega la informació */}
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

/**
 * Botó per desar o actualitzar la plantilla.
 * Gestiona la petició POST/PUT segons si s'està creant o editant.
 * Mostra un Snackbar en cas d'error.
 */
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

  // Obté les dades de la plantilla des de l'store d'entrenament
  const workoutStore = useWorkoutStore(
    useShallow((state) => ({
      uuid: state.uuid,
      title: state.title,
      timestamp: state.timestamp,
      description: state.description,
      exercises: state.exercises,
    })),
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [queryError, setQueryError] = useState<string | null>(null);

  /**
   * Handler per desar o actualitzar la plantilla.
   * Fa POST si és nova, PUT si s'està editant.
   * Invalida la cache i navega a la plantilla guardada.
   */
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
    <>
      <Button
        variant="outlined"
        startIcon={<SaveIcon />}
        disabled={isLoading}
        onClick={() => handleSubmit()}
      >
        {templateUuid ? "Update template" : "Save template"}
      </Button>
      <Portal>
        <Snackbar open={!!queryError} onClose={() => setQueryError(null)} />
      </Portal>
    </>
  );
};
