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

export default function LoginPage() {
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

  useEffect(() => {
    setValue("username", storeUsername);
  }, [storeUsername]);

  const submitHandler = async ({ username, password }: FormSchemaType) => {
    try {
      setUsername(username);

      await updateAuthConfig({ username: username });

      const encodedPassword = await encodePassword(password, serverIp);

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

        <Typography className="flex-1" sx={{ textAlign: "center" }}>
          or
        </Typography>

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
