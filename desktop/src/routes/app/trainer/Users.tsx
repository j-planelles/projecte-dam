import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import {
  Avatar,
  Box,
  CircularProgress,
  Container,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { useShallow } from "zustand/react/shallow";
import { useAuthStore } from "../../../store/auth-store";

/**
 * Pàgina de llistat d'usuaris enllaçats a l'entrenador.
 * Mostra tots els usuaris gestionats per l'entrenador, amb accés directe al seu perfil.
 * Mostra un loader mentre es carrega, errors si n'hi ha, i un missatge si no hi ha usuaris.
 * @returns {JSX.Element} El component de la pàgina de llistat d'usuaris.
 */
export default function TrainerUsersPage() {
  // Obté l'apiClient i el token d'autenticació de l'store d'usuari
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  // Consulta la llista d'usuaris enllaçats a l'entrenador
  const { data, isLoading, isSuccess, error } = useQuery({
    queryKey: ["user", "trainer", "/trainer/users"],
    queryFn: async () =>
      await apiClient.get("/trainer/users", {
        headers: { Authorization: `Bearer ${token}` },
      }),
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

      {/* Llista d'usuaris si la consulta té èxit */}
      {isSuccess &&
        !!data &&
        (data.length > 0 ? (
          <List>
            {data.map((user) => (
              <Link key={user.uuid} to={`/app/trainer/users/${user.uuid}`}>
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar>{user.full_name.charAt(0).toUpperCase()}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.full_name}
                    secondary={user.biography}
                  />
                </ListItemButton>
              </Link>
            ))}
          </List>
        ) : (
          // Missatge si no hi ha usuaris
          <Box className="flex flex-col items-center">
            <PersonOutlineOutlinedIcon sx={{ width: 180, height: 180 }} />
            <Typography variant="h4">No users found...</Typography>
          </Box>
        ))}
    </Container>
  );
}
