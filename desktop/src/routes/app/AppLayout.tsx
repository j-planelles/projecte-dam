import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import GroupIcon from "@mui/icons-material/Group";
import HistoryIcon from "@mui/icons-material/History";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SettingsIcon from "@mui/icons-material/Settings";
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
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { useShallow } from "zustand/react/shallow";
import UltraLogoText from "../../assets/logo-text";
import NavigationBar, {
  type NavigationBarSection,
} from "../../components/NavigationBar";
import ThemeManager from "../../components/ThemeManager";
import { updateAuthConfig } from "../../lib/authConfig";
import { useAuthStore } from "../../store/auth-store";

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

/**
 * Layout principal de l'aplicació.
 * Mostra la barra superior, la barra de navegació lateral i el contingut principal.
 * Adapta els ítems de navegació segons si l'usuari és entrenador o no.
 * @returns {JSX.Element} El component de layout de l'app.
 */
export default function AppLayout() {
  // Obté l'usuari i el token per consultar el perfil
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );
  // Consulta el perfil de l'usuari per saber si és entrenador
  const { data: userData, isSuccess } = useQuery({
    queryKey: ["user", "/auth/profile"],
    queryFn: async () =>
      await apiClient.get("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    staleTime: 2 * 60 * 60 * 1000, // 2 hores
  });

  // Decideix els ítems de navegació segons el rol de l'usuari
  const navItems = [
    ...NAV_ITEMS,
    ...(isSuccess && userData?.is_trainer
      ? NAV_ITEMS_TRAINER_ENROLLED
      : NAV_ITEMS_TRAINER_UNENROLLED),
  ];

  return (
    <ThemeManager>
      <TopBar username={userData?.username} fullName={userData?.full_name} />
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          overflow: "clip",
          backgroundColor: "background.default",
        }}
      >
        {/* Barra de navegació lateral */}
        {isSuccess && <NavigationBar items={navItems} />}

        {/* Contingut principal */}
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
          className="hide-scrollbar"
        >
          <Outlet />
        </Box>
      </Box>
    </ThemeManager>
  );
}

/**
 * Barra superior fixa amb el logo, botó de compte i botó de retrocés.
 * @param username Nom d'usuari.
 * @param fullName Nom complet de l'usuari.
 */
const TopBar = ({
  username,
  fullName,
}: { username?: string; fullName?: string }) => {
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
        <MyAccountButton username={username} fullName={fullName} />
      </Toolbar>
    </AppBar>
  );
};

/**
 * Botó per tornar enrere a la navegació.
 */
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

/**
 * Botó d'accés al compte d'usuari, amb menú per accedir a la configuració o tancar sessió.
 * @param username Nom d'usuari.
 * @param fullName Nom complet de l'usuari.
 */
const MyAccountButton = ({
  username = "user",
  fullName = "User",
}: { username?: string; fullName?: string }) => {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const [isDialogShown, setIsDialogShown] = useState<boolean>(false);

  // Handler per tancar sessió
  const handleLogout = async () => {
    await updateAuthConfig({ token: undefined });
    setIsDialogShown(false);
    setToken(null);
    navigate("/");
  };

  // Handler per anar a la configuració
  const navigateToSettings = () => {
    setIsDialogShown(false);
    navigate("/app/settings");
  };

  return (
    <>
      <Tooltip title="My Account">
        <IconButton onClick={() => setIsDialogShown(true)} sx={{ p: 0 }}>
          <Avatar sx={{ backgroundColor: "primary.main" }}>
            {fullName.charAt(0).toUpperCase()}
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
                {fullName.charAt(0).toUpperCase()}
              </Avatar>
              <Box className="flex flex-col">
                <Typography variant="h6" sx={{ margin: 0 }}>
                  {fullName}
                </Typography>
                <Typography variant="body2" sx={{ margin: 0 }}>
                  {username}
                </Typography>
              </Box>
            </Box>
            <Box
              className="flex flex-col gap-2 p-2 mt-2"
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
                variant="text"
                className="flex-1"
                onClick={navigateToSettings}
                startIcon={<SettingsIcon />}
              >
                Settings
              </Button>
              <Button
                variant="outlined"
                className="flex-1"
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
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
