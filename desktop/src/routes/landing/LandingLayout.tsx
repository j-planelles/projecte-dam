import { Box, ThemeProvider, Typography } from "@mui/material";
import { createMaterialYouTheme } from "mui-create-material-you-theme";
import { Outlet } from "react-router";

const materialYouDark = createMaterialYouTheme("dark");

export default function LandingLayout() {
	return (
		<ThemeProvider theme={materialYouDark}>
			<Box
				sx={{
					backgroundImage: 'url("/assets/landing-background.jpg")',
					backgroundSize: "cover",
					backgroundPosition: "center center",
					backgroundColor: "background.default",
					height: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Outlet />
				<BackgroundImageCredit />
			</Box>
		</ThemeProvider>
	);
}

const BackgroundImageCredit = () => {
	return (
		<Typography className="absolute left-2 bottom-2 text-gray-500">
			Photo by Kirill Bogomolov on Unsplash
		</Typography>
	);
};
