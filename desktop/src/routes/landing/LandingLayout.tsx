import { Box, ThemeProvider, Typography } from "@mui/material";
import { createMaterialYouTheme } from "mui-create-material-you-theme";
import { Outlet } from "react-router";
import UltraLogoText from "../../assets/logo-text";

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
				<UltraLogo />
				<Outlet />
				<BackgroundImageCredit />
			</Box>
		</ThemeProvider>
	);
}

const UltraLogo = () => {
	return (
		<div className="absolute top-0 left-0 w-screen flex justify-center">
			<UltraLogoText fill="#FFF" className="w-auto h-8 mt-4" />
		</div>
	);
};

const BackgroundImageCredit = () => {
	return (
		<Typography className="absolute left-2 bottom-2 text-gray-500">
			Photo by Kirill Bogomolov on Unsplash
		</Typography>
	);
};
