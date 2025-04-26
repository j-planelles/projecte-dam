import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, type FormEvent } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { useShallow } from "zustand/react/shallow";
import { useAuthStore } from "../../store/auth-store";
import { z } from "zod";
import { AxiosError } from "axios";

const schema = z.object({
  username: z.string(),
  password: z.string().min(8),
});

type FormSchemaType = z.infer<typeof schema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const apiClient = useAuthStore((store) => store.apiClient);
  const {
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({ resolver: zodResolver(schema) });

  const {
    username: storeUsername,
    setUsername,
    hashPassword,
    setToken,
  } = useAuthStore(
    useShallow((state) => ({
      username: state.username,
      setUsername: state.setUsername,
      hashPassword: state.hashPassword,
      setToken: state.setToken,
    })),
  );

  useEffect(() => {
    setValue("username", storeUsername);
  }, [storeUsername]);

  const submitHandler = async ({ username, password }: FormSchemaType) => {
    try {
      setUsername(username);
      hashPassword(password);

      const response = await apiClient.post("/auth/token", {
        username: username,
        password: password,
      });
      setToken(response.access_token);

      queryClient.invalidateQueries({ queryKey: ["user"] });

      navigate("/");
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error);
        setError("root", {
          type: "manual",
          message:
            error?.response?.status === 401
              ? "Invalid username and password"
              : "Internal server error. Please try again later.",
        });
      }
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
      <Box
        sx={{
          mt: 1, // Margin top for spacing below the title
          width: "100%", // Ensure form takes full width of the Paper
        }}
      >
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
            />
          )}
        />
        {errors.username && (
          <Typography variant="body2" color="error">
            {errors.username.message}
          </Typography>
        )}

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
            />
          )}
        />
        {errors.password && (
          <Typography variant="body2" color="error">
            {errors.password.message}
          </Typography>
        )}

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
          Login
        </Button>
      </Box>
    </Paper>
  );
}
