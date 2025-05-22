import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import HistoryIcon from "@mui/icons-material/History";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Skeleton,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { useShallow } from "zustand/react/shallow";
import { useAuthStore } from "../../store/auth-store";

/**
 * Pàgina principal del dashboard de l'usuari.
 * Mostra la informació de l'usuari, enllaços ràpids i un resum de les dades més rellevants.
 * @returns {JSX.Element} El component de la pàgina de dashboard.
 */
export default function DashboardPage() {
  return (
    <Container className="flex flex-col gap-4">
      <UserInfo />
      <QuickLinks />
      <CardsLayout />
    </Container>
  );
}

/**
 * Mostra la informació bàsica de l'usuari (avatar, nom, usuari, biografia).
 * Mostra un loader mentre es carrega la informació.
 */
const UserInfo = () => {
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );
  const { data, isSuccess } = useQuery({
    queryKey: ["user", "/auth/profile"],
    queryFn: async () =>
      await apiClient.get("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      }),
  });

  return (
    <Box className="flex flex-row gap-6 items-center">
      <Box className="flex">
        {!isSuccess ? (
          <Skeleton variant="circular" width={128} height={128} />
        ) : (
          <Avatar
            sx={{
              height: 128,
              width: 128,
              fontSize: 64,
              backgroundColor: "primary.main",
            }}
          >
            {data.full_name.charAt(0).toUpperCase()}
          </Avatar>
        )}
      </Box>
      <Box className="flex flex-grow flex-col">
        <Typography variant="h3">
          {!isSuccess ? <Skeleton /> : data.full_name}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {!isSuccess ? <Skeleton /> : data.username}
        </Typography>
        <Typography sx={{ marginTop: 1 }}>
          {!isSuccess ? <Skeleton /> : data.biography}
        </Typography>
      </Box>
    </Box>
  );
};

/**
 * Mostra enllaços ràpids a les seccions més importants de l'aplicació.
 */
const QuickLinks = () => {
  return (
    <Box className="flex-1 flex flex-row wrap gap-2">
      <Link to="/app/templates" className="flex-1">
        <Button
          variant="tonal"
          className="w-full"
          startIcon={<AutoAwesomeMotionIcon />}
        >
          Templates
        </Button>
      </Link>

      <Link to="/app/workouts" className="flex-1">
        <Button variant="tonal" className="w-full" startIcon={<HistoryIcon />}>
          Workouts
        </Button>
      </Link>

      <Link to="/app/exercises" className="flex-1">
        <Button
          variant="tonal"
          className="w-full"
          startIcon={<FitnessCenterIcon />}
        >
          Exercises
        </Button>
      </Link>
    </Box>
  );
};

/**
 * Wrapper per a les targetes de resum del dashboard.
 * @param children Contingut de la targeta.
 */
const CardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Card variant="outlined" className="flex-1" sx={{ minHeight: 128 }}>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

/**
 * Layout de les targetes de resum del dashboard.
 * Mostra targetes per workouts, plantilles, usuaris i sol·licituds.
 */
const CardsLayout = () => {
  return (
    <>
      <Box className="flex flex-row gap-4">
        <CardWorkouts />
        <CardTemplates />
      </Box>

      <Box className="flex flex-row gap-4">
        <CardUsers />
        <CardRequests />
      </Box>
    </>
  );
};

/**
 * Targeta que mostra les últimes sol·licituds d'usuaris a l'entrenador.
 */
const CardRequests = () => {
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );
  const { data, isSuccess } = useQuery({
    queryKey: ["user", "trainer", "/trainer/requests"],
    queryFn: async () =>
      await apiClient.get("/trainer/requests", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    retry: false,
  });

  return (
    isSuccess && (
      <Link to="/app/trainer/requests" className="flex-1">
        <CardWrapper>
          <Typography variant="h6">Requests</Typography>
          {data.length > 0 ? (
            data.map(
              (item, index) =>
                index < 5 && (
                  <Typography key={item.uuid as string}>
                    {item.user.full_name}
                  </Typography>
                ),
            )
          ) : (
            <Box className="flex items-center justify-center">
              <Typography variant="body2">No requests found.</Typography>
            </Box>
          )}
        </CardWrapper>
      </Link>
    )
  );
};

/**
 * Targeta que mostra els usuaris enllaçats a l'entrenador.
 */
const CardUsers = () => {
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );
  const { data, isSuccess } = useQuery({
    queryKey: ["user", "trainer", "/trainer/users"],
    queryFn: async () =>
      await apiClient.get("/trainer/users", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    retry: false,
  });

  return (
    isSuccess && (
      <Link to="/app/trainer/users" className="flex-1">
        <CardWrapper>
          <Typography variant="h6">Linked Users</Typography>
          {data.length > 0 ? (
            data.map(
              (item, index) =>
                index < 5 && (
                  <Typography key={item.uuid}>{item.full_name}</Typography>
                ),
            )
          ) : (
            <Box className="flex items-center justify-center">
              <Typography variant="body2">No users found.</Typography>
            </Box>
          )}
        </CardWrapper>
      </Link>
    )
  );
};

/**
 * Targeta que mostra les plantilles d'entrenament de l'usuari.
 */
const CardTemplates = () => {
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );
  const { data, isSuccess } = useQuery({
    queryKey: ["user", "/user/templates"],
    queryFn: async () =>
      await apiClient.get("/user/templates", {
        headers: { Authorization: `Bearer ${token}` },
      }),
  });

  return (
    <Link to="/app/templates" className="flex-1">
      <CardWrapper>
        <Typography variant="h6">Templates</Typography>
        {isSuccess ? (
          data.length > 0 ? (
            data.map(
              (item, index) =>
                index < 5 && (
                  <Typography key={item.uuid}>{item.name}</Typography>
                ),
            )
          ) : (
            <Box className="flex items-center justify-center">
              <Typography variant="body2">No templates found.</Typography>
            </Box>
          )
        ) : (
          <Box className="flex items-center justify-center">
            <CircularProgress />
          </Box>
        )}
      </CardWrapper>
    </Link>
  );
};

/**
 * Targeta que mostra els últims entrenaments de l'usuari.
 */
const CardWorkouts = () => {
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );
  const { data, isSuccess } = useQuery({
    queryKey: ["user", "/user/workouts"],
    queryFn: async () =>
      await apiClient.get("/user/workouts", {
        headers: { Authorization: `Bearer ${token}` },
        queries: { limit: 3 },
      }),
  });

  return (
    <Link to="/app/workouts" className="flex-1">
      <CardWrapper>
        <Typography variant="h6">Latest Workouts</Typography>
        {isSuccess ? (
          data.length > 0 ? (
            data.map((item) => (
              <Typography key={item.uuid}>{item.name}</Typography>
            ))
          ) : (
            <Box className="flex items-center justify-center">
              <Typography variant="body2">No workouts found.</Typography>
            </Box>
          )
        ) : (
          <Box className="flex items-center justify-center">
            <CircularProgress />
          </Box>
        )}
      </CardWrapper>
    </Link>
  );
};
