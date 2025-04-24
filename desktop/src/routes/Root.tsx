import { Box, CircularProgress, CssBaseline } from "@mui/material";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import ThemeManager from "../components/ThemeManager";

export function RootRedirector() {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true);
	const [isLoggedIn, setIsLoggedIn] = useState(false); // Replace with your actual auth state

	useEffect(() => {
		setTimeout(() => {
			setIsLoggedIn(true);
			setIsLoading(false);
		}, 100);
	}, []);

	useEffect(() => {
		if (!isLoading) {
			if (isLoggedIn) {
				navigate("/app/dashboard");
			} else {
				navigate("/landing/server");
			}
		}
	}, [isLoading, isLoggedIn, navigate]);

	return (
		<ThemeManager>
			<Box className="w-screen h-screen flex items-center justify-center">
				<CircularProgress />
			</Box>
		</ThemeManager>
	);
}

export function RootLayout() {
	return (
		<>
			<CssBaseline />
			<Outlet />
		</>
	);
}
