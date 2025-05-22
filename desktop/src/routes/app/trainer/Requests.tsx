import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Container,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { handleError } from "../../../lib/errorHandler";
import { useAuthStore } from "../../../store/auth-store";

/**
 * Pàgina de gestió de sol·licituds d'usuaris a l'entrenador.
 * Mostra totes les sol·licituds pendents, permet acceptar o denegar cada una.
 * Mostra un loader mentre es carrega, errors si n'hi ha, i un missatge si no hi ha sol·licituds.
 * @returns {JSX.Element} El component de la pàgina de sol·licituds d'entrenador.
 */
export default function TrainerRequestsPage() {
  // Obté l'apiClient i el token d'autenticació de l'store d'usuari
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  // Consulta la llista de sol·licituds pendents
  const { data, isLoading, isSuccess, error } = useQuery({
    queryKey: ["user", "trainer", "/trainer/requests"],
    queryFn: async () =>
      await apiClient.get("/trainer/requests", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    retry: false,
  });

  return (
    <Container>
      {/* Loader mentre es carrega la llista */}
      {isLoading && (
        <Box className="flex items-center justify-center">
          <CircularProgress />
        </Box>
      )}

      {/* Missatge d'error si la consulta falla */}
      {error && <Typography color="error">{error.message}</Typography>}

      {/* Llista de sol·licituds si la consulta té èxit */}
      {isSuccess &&
        !!data &&
        (data.length > 0 ? (
          <List>
            {data.map((item) => (
              <UserListItem
                key={item.user.uuid}
                user={
                  {
                    uuid: item.user.uuid,
                    username: item.user.username,
                    name: item.user.full_name,
                    description: item.user.biography,
                  } as user
                }
              />
            ))}
          </List>
        ) : (
          // Missatge si no hi ha sol·licituds
          <Box className="flex flex-col items-center">
            <GroupAddOutlinedIcon sx={{ width: 180, height: 180 }} />
            <Typography variant="h4">No requests found...</Typography>
          </Box>
        ))}
    </Container>
  );
}

/**
 * Element de la llista d'usuaris amb accions per acceptar o denegar la sol·licitud.
 * @param user L'usuari que ha fet la sol·licitud.
 */
const UserListItem = ({ user }: { user: user }) => {
  return (
    <ListItem
      secondaryAction={<UserListItemActions userUUID={user.uuid} />}
      className="rounded-full"
      sx={{
        paddingY: 1,
        "& .MuiListItemSecondaryAction-root": {
          opacity: 0, // Amaga per defecte
          visibility: "hidden",
        },
        "&:hover": {
          backgroundColor: "background.default",
          "& .MuiListItemSecondaryAction-root": {
            opacity: 1,
            visibility: "visible",
          },
        },
      }}
    >
      <ListItemAvatar>
        <Avatar>{user.name.charAt(0).toUpperCase()}</Avatar>
      </ListItemAvatar>
      <ListItemText primary={user.name} secondary={user.description} />
    </ListItem>
  );
};

/**
 * Accions per acceptar o denegar la sol·licitud d'un usuari.
 * Mostra l'estat de la petició i missatges d'error si cal.
 * @param userUUID UUID de l'usuari.
 */
const UserListItemActions = ({ userUUID }: { userUUID: string }) => {
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [input, setInput] = useState<null | "accept" | "deny">(null);

  /**
   * Handler per acceptar o denegar la sol·licitud.
   * Actualitza l'estat i mostra el resultat.
   */
  const handleSubmit = async (userInput: "accept" | "deny") => {
    setIsLoading(true);
    setQueryError(null);
    setInput(null);
    try {
      await apiClient.post("/trainer/requests/:user_uuid", undefined, {
        params: { user_uuid: userUUID },
        queries: { action: userInput },
        headers: { Authorization: `Bearer ${token}` },
      });
      setInput(userInput);
    } catch (error: unknown) {
      setQueryError(handleError(error));
    }
    setIsLoading(false);
  };

  return (
    <Box className="flex flex-row gap-2 items-center">
      {queryError && <Typography color="error">{queryError}</Typography>}
      {isLoading ? (
        <>
          <CircularProgress size="25px" />
          <Typography color="primary" className="pr-2">
            Requesting...
          </Typography>
        </>
      ) : input === null ? (
        <ButtonGroup variant="outlined">
          <Button
            startIcon={<CheckIcon />}
            color="success"
            sx={{ backgroundColor: "background.paper" }}
            onClick={() => {
              handleSubmit("accept");
            }}
          >
            Accept
          </Button>
          <Button
            startIcon={<CloseIcon />}
            color="error"
            sx={{ backgroundColor: "background.paper" }}
            onClick={() => {
              handleSubmit("deny");
            }}
          >
            Deny
          </Button>
        </ButtonGroup>
      ) : (
        <Typography
          color={input === "accept" ? "success" : "error"}
          className="pr-2"
        >
          Request {input === "accept" ? "accepted" : "denied"}
        </Typography>
      )}
    </Box>
  );
};
