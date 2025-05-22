import { Box, ThemeProvider, Typography } from "@mui/material";
import { createMaterialYouTheme } from "mui-create-material-you-theme";
import { Outlet } from "react-router";
import UltraLogoText from "../../assets/logo-text";

// Generar el tema fosc de Material Design 3
const materialYouDark = createMaterialYouTheme("dark");

/**
 * Layout per a les pàgines de landing/login/registre.
 * Aplica un tema fosc Material You, mostra el logo i un crèdit de la imatge de fons.
 * @returns {JSX.Element} El component de layout per a la landing.
 */
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
        {/* Logo de l'aplicació a la part superior */}
        <UltraLogo />
        {/* Outlet per mostrar la pàgina corresponent (login, registre, etc.) */}
        <Outlet />
        {/* Crèdit de la imatge de fons */}
        <BackgroundImageCredit />
      </Box>
    </ThemeProvider>
  );
}

/**
 * Component que mostra el logo de l'aplicació a la part superior de la pantalla.
 * @returns {JSX.Element} El component del logo.
 */
const UltraLogo = () => {
  return (
    <div className="absolute top-0 left-0 w-screen flex justify-center">
      <UltraLogoText fill="#FFF" className="w-auto h-8 mt-4" />
    </div>
  );
};

/**
 * Component que mostra el crèdit de la imatge de fons.
 * @returns {JSX.Element} El component del crèdit de la imatge.
 */
const BackgroundImageCredit = () => {
  return (
    <Typography className="absolute left-2 bottom-2 text-gray-500">
      Photo by Kirill Bogomolov on Unsplash
    </Typography>
  );
};
