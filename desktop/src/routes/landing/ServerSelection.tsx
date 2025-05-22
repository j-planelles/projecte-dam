import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import { handleError } from "../../lib/errorHandler";
import { useAuthStore } from "../../store/auth-store";
import { updateAuthConfig } from "../../lib/authConfig";

// Esquema de validació Zod pel formulari
const schema = z.object({
  ip: z.string().url(),
});

type FormSchemaType = z.infer<typeof schema>;

/**
 * Pàgina per seleccionar i connectar-se a un servidor.
 * Permet a l'usuari introduir la URL del servidor, la valida i comprova la connexió.
 * Desa la IP del servidor a l'store global i a la configuració persistent.
 * @returns {JSX.Element} El component de la pàgina de selecció de servidor.
 */
export default function ServerSelectionPage() {
  const navigate = useNavigate();
  const { serverIp, setServerIp } = useAuthStore(
    useShallow((state) => ({
      serverIp: state.serverIp,
      setServerIp: state.setServerIp,
    })),
  );

  // Inicialitza el formulari amb Zod i React Hook Form
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({ resolver: zodResolver(schema) });

  /**
   * Handler per connectar-se al servidor.
   * Comprova la connexió, desa la IP a l'store i a la configuració persistent,
   * i navega a la pantalla de login si té èxit.
   */
  const submitHandler = async ({ ip }: FormSchemaType) => {
    try {
      const response = await axios.get(`${ip}/`);

      setServerIp(ip, response.data.name);
      await updateAuthConfig({ serverIp: ip });

      navigate("/landing/login");
    } catch (error: unknown) {
      setError("root", {
        type: "manual",
        message: handleError(error),
      });
    }
  };

  // Inicialitza el valor del formulari amb la IP guardada
  useEffect(() => {
    setValue("ip", serverIp);
  }, [serverIp]);

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: "400px",
        borderRadius: 2,
        backgroundColor: "background.paper",
      }}
    >
      <Typography component="h1" variant="h5" gutterBottom>
        Choose a server
      </Typography>
      <Box
        sx={{
          mt: 1,
          width: "100%",
        }}
      >
        {/* Input per la IP/URL del servidor */}
        <Controller
          control={control}
          name="ip"
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              margin="normal"
              required
              fullWidth
              label="Server IP"
              placeholder="https://ultra.jplanelles.cat"
              autoFocus
              {...field}
              error={!!errors.ip}
              helperText={errors.ip?.message}
              disabled={isSubmitting}
            />
          )}
        />

        {/* Missatge d'error global de connexió */}
        {errors.root && (
          <Typography variant="body2" color="error">
            {errors.root.message}
          </Typography>
        )}

        {/* Botó per connectar-se al servidor */}
        <Button
          fullWidth
          variant="filled"
          sx={{ mt: 2, mb: 2 }} // Margin top and bottom
          onClick={handleSubmit(submitHandler)}
          disabled={isSubmitting}
        >
          Connect
        </Button>
      </Box>
    </Paper>
  );
}
