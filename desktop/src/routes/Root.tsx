import { Box, CircularProgress, CssBaseline } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import ThemeManager from "../components/ThemeManager";
import { useAuthStore } from "../store/auth-store";
import { useShallow } from "zustand/react/shallow";

export function RootRedirector() {
	const navigate = useNavigate();
	const { token } = useAuthStore(
		useShallow((state) => ({ token: state.token })),
	);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setTimeout(() => {
			setIsLoading(false);
		}, 100);
	}, []);

	useEffect(() => {
		if (!isLoading) {
			if (token) {
				navigate("/app/dashboard");
			} else {
				navigate("/landing/server");
			}
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
