import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { handleError } from "../lib/errorHandler";
import { useAuthStore } from "../store/auth-store";

/**
 * Diàleg per revisar i seleccionar interessos.
 * Permet seleccionar interessos que ajudaran els usuaris a trobar el perfil del trainer.
 * Mostra un loader mentre es carrega, errors si n'hi ha, i permet desar la selecció.
 * @param open Si el diàleg està obert.
 * @param onClose Handler per tancar el diàleg.
 * @param onSuccess Handler que s'executa quan es desa correctament.
 * @param dismissable Si es pot tancar el diàleg sense desar (per defecte true).
 * @returns {JSX.Element} El component del diàleg d'interessos.
 */
export default function LikesDialog({
  open,
  onClose,
  onSuccess,
  dismissable = true,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  dismissable?: boolean;
}) {
  // Obté l'apiClient i el token d'autenticació de l'store d'usuari
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  // Consulta la llista d'interessos disponibles per a l'usuari
  const { data, isSuccess } = useQuery({
    queryKey: ["user", "/user/trainer/interests"],
    queryFn: async () =>
      await apiClient.get("/user/trainer/interests", {
        headers: { Authorization: `Bearer ${token}` },
      }),
  });

  // Estat per controlar els interessos seleccionats
  const [likes, setLikes] = useState<string[]>([]);
  const navigationDisabled = likes.length < 1;

  // Afegeix o elimina un interès de la llista de seleccionats
  const addLike = (newItem: string) => {
    setLikes((state) => [...state, newItem]);
  };
  const removeLike = (newItem: string) => {
    setLikes((state) => state.filter((item) => item !== newItem));
  };

  // Inicialitza els interessos seleccionats segons els que ja estiguin marcats a l'API
  useEffect(() => {
    if (data) {
      setLikes(data.filter((item) => item.selected).map((item) => item.uuid));
    }
  }, [data]);

  // Handler per alternar la selecció d'un interès
  const checkClickHandler = (newItem: string) => {
    if (likes.includes(newItem)) {
      removeLike(newItem);
    } else {
      addLike(newItem);
    }
  };

  // Estat per controlar la càrrega i errors de la petició
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [queryError, setQueryError] = useState<string | null>(null);

  /**
   * Handler per desar els interessos seleccionats a l'API.
   * Executa onSuccess si té èxit.
   */
  const handleSubmit = async () => {
    setIsLoading(true);
    setQueryError(null);
    try {
      await apiClient.post("/user/trainer/interests", likes, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onSuccess();
    } catch (error: unknown) {
      setQueryError(handleError(error));
    }
    setIsLoading(false);
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        !isLoading && onClose();
      }}
      fullWidth
    >
      <DialogTitle>Review your interests</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Your interests will help users to find your profile. You can always
          change them in the settings page.
        </DialogContentText>
      </DialogContent>
      <DialogContent className="flex flex-row flex-wrap overflow-scroll gap-2">
        {isSuccess ? (
          data.map((item) => (
            <Chip
              key={item.uuid}
              icon={likes.includes(item.uuid) ? <CheckIcon /> : <AddIcon />}
              variant={likes.includes(item.uuid) ? "filled" : "outlined"}
              onClick={() => checkClickHandler(item.uuid)}
              label={item.name}
            />
          ))
        ) : (
          <Box className="flex-1 justify-center">
            <CircularProgress size="large" />
          </Box>
        )}
        {queryError && <Typography color="error">{queryError}</Typography>}
        {navigationDisabled && (
          <DialogContentText>
            Please select at least one interest.
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        {dismissable && (
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          disabled={isLoading || navigationDisabled}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
