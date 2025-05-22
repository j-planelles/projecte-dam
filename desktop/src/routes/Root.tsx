import { Box, CircularProgress, CssBaseline } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import ThemeManager from "../components/ThemeManager";
import { useAuthStore } from "../store/auth-store";
import { useShallow } from "zustand/react/shallow";
import axios from "axios";
import { loadAuthConfig } from "../lib/authConfig";

/**
 * Component que redirigeix l'usuari a la ruta adequada segons l'estat d'autenticació i configuració.
 * - Si hi ha token i servidor vàlid, navega al dashboard.
 * - Si només hi ha servidor, navega a login.
 * - Si no hi ha configuració, navega a la selecció de servidor.
 * Mostra un loader mentre comprova l'estat.
 * @returns {JSX.Element} El component de redirecció automàtica.
 */
export function RootRedirector() {
  const navigate = useNavigate();
  const {
    token: storeToken,
    serverIp: storeServerIp,
    setServerIp,
    setUsername,
    setToken,
  } = useAuthStore(
    useShallow((state) => ({
      token: state.token,
      serverIp: state.serverIp,
      setServerIp: state.setServerIp,
      setUsername: state.setUsername,
      setToken: state.setToken,
    })),
  );
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Comprova la configuració local i l'estat del servidor.
   * Redirigeix segons si hi ha token, servidor i connexió vàlida.
   */
  const testServer = async () => {
    try {
      const configData = await loadAuthConfig();

      const token = configData?.token ? configData.token : storeToken;
      const serverIp = configData?.serverIp
        ? configData.serverIp
        : storeServerIp;

      if (configData?.token) {
        setToken(configData.token);
      }
      if (configData?.username) {
        setUsername(configData.username);
      }

      // Comprova que el servidor respongui
      const response = await axios.get(`${serverIp}/`);

      setServerIp(serverIp, response.data.name);

      if (token) {
        navigate("/app/dashboard");
      } else {
        navigate("/landing/login");
      }
    } catch (error: unknown) {
      // Si falla la connexió, navega a la selecció de servidor
      navigate("/landing/server");
    }
  };

  // Simula un petit delay per mostrar el loader
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  }, []);

  // Un cop ha passat el delay, executa la comprovació
  useEffect(() => {
    if (!isLoading) {
      testServer();
    }
  }, [isLoading, storeToken, navigate]);

  return (
    <ThemeManager>
      <Box className="w-screen h-screen flex items-center justify-center">
        <CircularProgress />
      </Box>
    </ThemeManager>
  );
}

/**
 * Component arrel que proveeix el context de React Query
 * Mostra el component fill corresponent segons la ruta.
 * @returns {JSX.Element} El layout arrel de l'aplicació.
 */
const client = new QueryClient();

export function RootLayout() {
  return (
    <>
      <QueryClientProvider client={client}>
        <CssBaseline />
        <Outlet />
      </QueryClientProvider>
    </>
  );
}
