import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import { useAuthStore } from "../../store/auth-store";
import axios from "axios";

const schema = z.object({
  ip: z.string().url(),
});

type FormSchemaType = z.infer<typeof schema>;

export default function ServerSelectionPage() {
  const navigate = useNavigate();
  const { serverIp, setServerIp } = useAuthStore(
    useShallow((state) => ({
      serverIp: state.serverIp,
      setServerIp: state.setServerIp,
    })),
  );
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({ resolver: zodResolver(schema) });

  const submitHandler = async ({ ip }: FormSchemaType) => {
    try {
      const response = await axios.get(`${ip}/`);

      setServerIp(ip, response.data.name);

      navigate("/landing/login");
    } catch (error: unknown) {
      setError("root", {
        type: "manual",
        message: "Failed to connect to server.",
      });
    }
  };

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
          Connect
        </Button>
      </Box>
    </Paper>
  );
}
