import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import { updateAuthConfig } from "../../lib/authConfig";
import { useAuthStore } from "../../store/auth-store";
import { encodePassword } from "../../lib/crypto";

const schema = z
  .object({
    username: z.string(),
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

type FormSchemaType = z.infer<typeof schema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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
    apiClient,
    serverIp,
  } = useAuthStore(
    useShallow((state) => ({
      username: state.username,
      setUsername: state.setUsername,
      hashPassword: state.hashPassword,
      setToken: state.setToken,
      apiClient: state.apiClient,
      serverIp: state.serverIp,
    })),
  );

  useEffect(() => {
    setValue("username", storeUsername);
  }, [storeUsername]);

  const submitHandler = async ({ username, password }: FormSchemaType) => {
    try {
      setUsername(username);
      hashPassword(password);

      await updateAuthConfig({ username: username });

      const encodedPassword = await encodePassword(password, serverIp);

      await apiClient.post("/auth/register", undefined, {
        queries: { username: username, password: encodedPassword },
      });

      const response = await apiClient.post("/auth/token", {
        username: username,
        password: encodedPassword,
      });
      setToken(response.access_token);

      await updateAuthConfig({ token: response.access_token });

      queryClient.invalidateQueries({ queryKey: ["user"] });

      navigate("/landing/register-profile");
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error?.response?.status === 409) {
          setError("username", {
            type: "manual",
            message: "Username already taken.",
          });
        } else {
          setError("root", {
            type: "manual",
            message: "Something went wrong.",
          });
        }
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
        Create an account
      </Typography>

      <Box className="flex flex-col w-full">
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

        <Controller
          control={control}
          name="confirmPassword"
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              margin="normal"
              required
              fullWidth
              label="Confirm Password"
              type="password"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
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
          Register
        </Button>

        <Typography className="flex-1" sx={{ textAlign: "center" }}>
          or
        </Typography>

        <Link to="/landing/login" replace>
          <Button
            fullWidth
            variant="outlined"
            sx={{ mt: 2, mb: 2 }} // Margin top and bottom
            disabled={isSubmitting}
          >
            Login instead
          </Button>
        </Link>
      </Box>
    </Paper>
  );
}
