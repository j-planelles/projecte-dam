import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import { useAuthStore } from "../../store/auth-store";
import { handleError } from "../../lib/errorHandler";

// Esquema de validació de Zod pel formulari
const schema = z.object({
  name: z.string(),
  bio: z.string().optional(),
});

type FormSchemaType = z.infer<typeof schema>;

/**
 * Pàgina per completar el perfil d'usuari durant el registre.
 * Permet introduir el nom complet i la biografia, i desa la informació al servidor.
 * @returns {JSX.Element} El component de la pàgina de configuració de perfil.
 */
export default function RegisterProfilePage() {
  const navigate = useNavigate();

  // Inicialitza el formulari amb Zod i React Hook Form
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({ resolver: zodResolver(schema) });

  // Obté l'apiClient i el token d'autenticació de l'store d'usuari
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  /**
   * Handler per desar el perfil de l'usuari.
   * Desa el nom i la biografia a l'API i navega a la pantalla principal si té èxit.
   */
  const submitHandler = async ({ name, bio }: FormSchemaType) => {
    try {
      await apiClient.post(
        "/auth/profile",
        {
          biography: bio,
          full_name: name,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      navigate("/");
    } catch (error) {
      setError("root", { type: "manual", message: handleError(error) });
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
        Set up your profile
      </Typography>

      <Box className="flex flex-col w-full">
        {/* Input per al nom complet */}
        <Controller
          control={control}
          name="name"
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              margin="normal"
              required
              fullWidth
              label="Name"
              placeholder="Jordi Planelles"
              autoFocus
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          )}
        />

        {/* Input per a la biografia */}
        <Controller
          control={control}
          name="bio"
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              margin="normal"
              required
              fullWidth
              label="Biography"
              placeholder="Jordi Planelles"
              autoFocus
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={!!errors.bio}
              helperText={errors.bio?.message}
              multiline
            />
          )}
        />

        {/* Missatge d'error global */}
        {errors.root && (
          <Typography variant="body2" color="error">
            {errors.root.message}
          </Typography>
        )}

        {/* Botó per desar el perfil */}
        <Button
          fullWidth
          variant="filled"
          sx={{ mt: 2, mb: 2 }} // Margin top and bottom
          onClick={handleSubmit(submitHandler)}
          disabled={isSubmitting}
        >
          Update
        </Button>
      </Box>
    </Paper>
  );
}
