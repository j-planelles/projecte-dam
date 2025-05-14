import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import { useAuthStore } from "../../store/auth-store";
import { handleError } from "../../lib/errorHandler";

const schema = z.object({
  name: z.string(),
  bio: z.string().optional(),
});

type FormSchemaType = z.infer<typeof schema>;

export default function RegisterProfilePage() {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({ resolver: zodResolver(schema) });

  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

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

        {errors.root && (
          <Typography variant="body2" color="error">
            {errors.root.message}
          </Typography>
        )}

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
