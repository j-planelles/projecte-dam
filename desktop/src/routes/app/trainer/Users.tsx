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

export default function TrainerUsersPage() {
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  const { data, isLoading, isSuccess, error } = useQuery({
    queryKey: ["user", "trainer", "/trainer/users"],
    queryFn: async () =>
      await apiClient.get("/trainer/users", {
        headers: { Authorization: `Bearer ${token}` },
      }),
  });

  return (
    <Container>
      {isLoading && (
        <Box className="flex items-center justify-center">
          <CircularProgress />
        </Box>
      )}
      {error && <Typography color="error">{error.message}</Typography>}
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
          <Box className="flex flex-col items-center">
            <PersonOutlineOutlinedIcon sx={{ width: 180, height: 180 }} />
            <Typography variant="h4">No users found...</Typography>
          </Box>
        ))}
    </Container>
  );
}
