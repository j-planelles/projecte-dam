import { Box, Button, Typography } from "@mui/material";
import { useNavigate, useRouteError } from "react-router";

/**
 * Component d'error global per a les rutes.
 * Mostra un missatge d'error i un botó per tornar enrere.
 * @returns {JSX.Element} El component d'error de ruta.
 */
export default function ErrorElement() {
  const navigate = useNavigate();
  const error = useRouteError() as Error;

  return (
    <Box className="w-screen h-screen flex flex-col gap-4 items-center justify-center">
      <Typography variant="h4">Something went wrong</Typography>
      <Typography>
        {error.message ? error.message : "Internal error"}
      </Typography>
      <Button
        onClick={() => {
          navigate(-1);
        }}
        variant="outlined"
      >
        Go back
      </Button>
    </Box>
  );
}
