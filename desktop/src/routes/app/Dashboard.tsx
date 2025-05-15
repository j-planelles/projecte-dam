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

export default function DashboardPage() {
  return (
    <Container className="flex flex-col gap-4">
      <UserInfo />

      <QuickLinks />

      <CardsLayout />
    </Container>
  );
}

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

const CardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Card variant="outlined" className="flex-1" sx={{ minHeight: 128 }}>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

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
