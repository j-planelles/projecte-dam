import { Box, CircularProgress, CssBaseline } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import ThemeManager from "../components/ThemeManager";
import { useAuthStore } from "../store/auth-store";
import { useShallow } from "zustand/react/shallow";
import axios from "axios";

export function RootRedirector() {
  const navigate = useNavigate();
  const { token, serverIp, setServerIp } = useAuthStore(
    useShallow((state) => ({
      token: state.token,
      serverIp: state.serverIp,
      setServerIp: state.setServerIp,
    })),
  );
  const [isLoading, setIsLoading] = useState(true);

  const testServer = async () => {
    try {
      const response = await axios.get(`${serverIp}/`);

      setServerIp(serverIp, response.data.name);

      if (token) {
        navigate("/app/dashboard");
      } else {
        navigate("/landing/login");
      }
    } catch (error: unknown) {
      navigate("/landing/server");
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      testServer();
    }
  }, [isLoading, token, navigate]);

  return (
    <ThemeManager>
      <Box className="w-screen h-screen flex items-center justify-center">
        <CircularProgress />
      </Box>
    </ThemeManager>
  );
}

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
