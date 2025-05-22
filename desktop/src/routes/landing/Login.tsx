import { zodResolver } from "@hookform/resolvers/zod";
import DnsOutlinedIcon from "@mui/icons-material/DnsOutlined";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import { updateAuthConfig } from "../../lib/authConfig";
import { encodePassword } from "../../lib/crypto";
import { handleError } from "../../lib/errorHandler";
import { useAuthStore } from "../../store/auth-store";

const schema = z.object({
  username: z.string(),
  password: z.string().min(8),
});

type FormSchemaType = z.infer<typeof schema>;

/**
 * Pàgina de login d'usuari.
 * Permet iniciar sessió, valida les dades, encripta la contrasenya i desa el token.
 * Desa la informació a la configuració persistent.
 * @returns {JSX.Element} El component de la pàgina de login.
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Inicialitza el formulari amb Zod i React Hook Form
  const {
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({ resolver: zodResolver(schema) });

  // Obté i actualitza dades d'usuari i servidor des de l'store global
  const {
    username: storeUsername,
    setUsername,
    setToken,
    apiClient,
    serverName,
    serverIp,
  } = useAuthStore(
    useShallow((state) => ({
      username: state.username,
      setUsername: state.setUsername,
      setToken: state.setToken,
      apiClient: state.apiClient,
      serverName: state.serverName,
      serverIp: state.serverIp,
    })),
  );

  // Inicialitza el valor del formulari amb el nom d'usuari guardat
  useEffect(() => {
    setValue("username", storeUsername);
  }, [storeUsername]);

  /**
   * Handler per iniciar sessió.
   * Desa el nom d'usuari, encripta la contrasenya, obté el token i el desa.
   * Navega a la pantalla principal si té èxit.
   */
  const submitHandler = async ({ username, password }: FormSchemaType) => {
    try {
      setUsername(username);

      await updateAuthConfig({ username: username });

      // Encripta la contrasenya abans d'enviar-la
      const encodedPassword = await encodePassword(password, serverIp);

      // Obté el token d'accés
      const response = await apiClient.post("/auth/token", {
        username: username,
        password: encodedPassword,
      });
      setToken(response.access_token);

      await updateAuthConfig({ token: response.access_token });

      queryClient.invalidateQueries({ queryKey: ["user"] });

      navigate("/");
    } catch (error) {
      setError("root", {
        type: "manual",
        message:
          error instanceof AxiosError && error?.response?.status === 401
            ? "Invalid username and password"
            : handleError(error),
      });
    }
  };

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
        Login to Ultra
      </Typography>

      {/* Botó per canviar el servidor de connexió */}
      <Link to="/landing/server">
        <Button
          className="w-full"
          sx={{ color: "onSurface.main" }}
          startIcon={<DnsOutlinedIcon />}
        >
          Connecting to {serverName}
        </Button>
      </Link>

      <Box className="flex flex-col w-full">
        {/* Input per al nom d'usuari */}
        <Controller
          control={control}
          name="username"
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              margin="normal"
              required
              fullWidth
              label="Username"
              placeholder="j.planelles"
              autoFocus
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={!!errors.username}
              helperText={errors.username?.message}
            />
          )}
        />

        {/* Input per a la contrasenya */}
        <Controller
          control={control}
          name="password"
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          )}
        />

        {/* Missatge d'error global */}
        {errors.root && (
          <Typography variant="body2" color="error">
            {errors.root.message}
          </Typography>
        )}

        {/* Botó per iniciar sessió */}
        <Button
          fullWidth
          variant="filled"
          sx={{ mt: 2, mb: 2 }} // Margin top and bottom
          onClick={handleSubmit(submitHandler)}
          disabled={isSubmitting}
        >
          Login
        </Button>

        <Typography className="flex-1" sx={{ textAlign: "center" }}>
          or
        </Typography>

        {/* Botó per anar a la pantalla de registre */}
        <Link to="/landing/register" replace>
          <Button
            fullWidth
            variant="outlined"
            sx={{ mt: 2, mb: 2 }} // Margin top and bottom
            disabled={isSubmitting}
          >
            Create an account
          </Button>
        </Link>
      </Box>
    </Paper>
  );
}
