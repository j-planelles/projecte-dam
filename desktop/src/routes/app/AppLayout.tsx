import { useShallow } from "zustand/react/shallow";
import { useQuery } from "@tanstack/react-query";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import GroupIcon from "@mui/icons-material/Group";
import HomeIcon from "@mui/icons-material/Home";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import HistoryIcon from "@mui/icons-material/History";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  Modal,
  Paper,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router";
import NavigationBar, {
  type NavigationBarSection,
} from "../../components/NavigationBar";
import ThemeManager from "../../components/ThemeManager";
import { useAuthStore } from "../../store/auth-store";
import UltraLogoText from "../../assets/logo-text";

const NAV_ITEMS: NavigationBarSection[] = [
  {
    items: [{ name: "Dashboard", path: "/app/dashboard", icon: <HomeIcon /> }],
  },
  {
    title: "My workouts",
    items: [
      { name: "Workouts", path: "/app/workouts", icon: <HistoryIcon /> },
      {
        name: "Templates",
        path: "/app/templates",
        icon: <AutoAwesomeMotionIcon />,
      },
      {
        name: "Exercises",
        path: "/app/exercises",
        icon: <FitnessCenterIcon />,
      },
    ],
  },
];

const NAV_ITEMS_TRAINER_UNENROLLED: NavigationBarSection[] = [
  {
    title: "Personal Trainer",
    items: [
      { name: "Enroll", path: "/app/trainer/enroll", icon: <GroupIcon /> },
    ],
  },
];

const NAV_ITEMS_TRAINER_ENROLLED: NavigationBarSection[] = [
  {
    title: "Personal Trainer",
    items: [
      { name: "Users", path: "/app/trainer/users", icon: <GroupIcon /> },
      {
        name: "Requests",
        path: "/app/trainer/requests",
        icon: <PersonAddIcon />,
      },
    ],
  },
];

export default function AppLayout() {
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );
  const { data: userData, isSuccess } = useQuery({
    queryKey: ["user", "/auth/profile"],
    queryFn: async () =>
      await apiClient.get("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    staleTime: 2 * 60 * 60 * 1000, // 2 hores
  });

  const navItems = [
    ...NAV_ITEMS,
    ...(isSuccess && userData?.is_trainer
      ? NAV_ITEMS_TRAINER_ENROLLED
      : NAV_ITEMS_TRAINER_UNENROLLED),
  ];

  return (
    <ThemeManager>
      <TopBar username={userData?.username} />
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          overflow: "clip",
          backgroundColor: "background.default",
        }}
      >
        {isSuccess && <NavigationBar items={navItems} />}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            flex: "1 1 auto",
            p: 3,
            backgroundColor: "background.paper",
            borderTopLeftRadius: "32px",
            borderTopRightRadius: "32px",
            marginTop: "64px",
            marginRight: "16px",
            overflow: "scroll",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </ThemeManager>
  );
}

const TopBar = ({ username }: { username?: string }) => {
  const theme = useTheme();

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <BackIcon />
        <Box className="flex-grow justify-start ml-4">
          <UltraLogoText
            className="w-auto h-6"
            fill={theme.palette.text.primary}
          />
        </Box>
        <MyAccountButton username={username} />
      </Toolbar>
    </AppBar>
  );
};

const BackIcon = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <IconButton size="medium" color="inherit" onClick={handleBack}>
      <ArrowBackIcon />
    </IconButton>
  );
};

const MyAccountButton = ({ username = "User" }: { username?: string }) => {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const [isDialogShown, setIsDialogShown] = useState<boolean>(false);

  const handleLogout = () => {
    setIsDialogShown(false);
    setToken(null);
    navigate("/landing/server");
  };

  return (
    <>
      <Tooltip title="My Account">
        <IconButton onClick={() => setIsDialogShown(true)} sx={{ p: 0 }}>
          <Avatar sx={{ backgroundColor: "primary.main" }}>
            {username.charAt(0).toUpperCase()}
          </Avatar>
        </IconButton>
      </Tooltip>
      <Modal open={isDialogShown} onClose={() => setIsDialogShown(false)}>
        <Box
          sx={{
            position: "absolute",
            right: "24px",
            top: "48px",
          }}
        >
          <Paper
            elevation={3}
            className="p-2 min-w-sm"
            sx={(theme) => ({
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "background.paper"
                  : "background.default",
              borderRadius: "20px",
              overflow: "clip",
            })}
          >
            <Box
              className="flex flex-row items-center gap-4 p-2"
              sx={(theme) => ({
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "background.default"
                    : "background.paper",
                borderTopLeftRadius: "18px",
                borderTopRightRadius: "18px",
              })}
            >
              <Avatar sx={{ backgroundColor: "primary.main" }}>
                {username.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h6">{username}</Typography>
            </Box>
            <Box
              className="flex gap-4 p-2 mt-2"
              sx={(theme) => ({
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "background.default"
                    : "background.paper",
                borderBottomLeftRadius: "18px",
                borderBottomRightRadius: "18px",
              })}
            >
              <Button
                variant="outlined"
                className="flex-1"
                onClick={handleLogout}
              >
                Log out
              </Button>
            </Box>
          </Paper>
        </Box>
      </Modal>
    </>
  );
};
