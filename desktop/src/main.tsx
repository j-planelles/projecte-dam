import { CssBaseline, type Theme, ThemeProvider } from "@mui/material";
import { createMaterialYouTheme } from "mui-create-material-you-theme";
import { type ReactNode, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import "./main.css";
import RootLayout from "./routes/RootLayout";

const router = createBrowserRouter([
	{
		path: "/",
		element: <RootLayout />,
		children: [],
	},
]);

const materialYouLight: Theme = createMaterialYouTheme("light");
const materialYouDark: Theme = createMaterialYouTheme("dark");

function ThemeManager({ children }: { children: ReactNode }) {
	const prefersDarkMode = window.matchMedia(
		"(prefers-color-scheme: dark)",
	).matches;
	const [mode, setMode] = useState(prefersDarkMode ? "dark" : "light");

	const theme = mode === "dark" ? materialYouDark : materialYouLight;

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

		const handleChange = (e: MediaQueryListEvent) => {
			setMode(e.matches ? "dark" : "light");
		};

		mediaQuery.addEventListener("change", handleChange);

		// Clean up
		return () => {
			mediaQuery.removeEventListener("change", handleChange);
		};
	}, []);

	return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<ThemeManager>
		<CssBaseline />
		<RouterProvider router={router} />
	</ThemeManager>,
);
