import { type Theme, ThemeProvider } from "@mui/material";
import { createMaterialYouTheme } from "mui-create-material-you-theme";
import { type ReactNode, useState, useEffect } from "react";

const materialYouLight: Theme = createMaterialYouTheme("light");
const materialYouDark: Theme = createMaterialYouTheme("dark");

export default function ThemeManager({ children }: { children: ReactNode }) {
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
