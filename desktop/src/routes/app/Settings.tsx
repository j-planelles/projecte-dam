import { useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormHelperText,
  Snackbar,
} from "@mui/material";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import { encodePassword } from "../../lib/crypto";
import { useAuthStore } from "../../store/auth-store";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { updateAuthConfig } from "../../lib/authConfig";
import LikesDialog from "../../components/LikesDialog";
import { handleError } from "../../lib/errorHandler";

export default function SettingsPage() {
  return (
    <Container className="flex flex-col gap-2">
      <UserDataForm />

      <ChangePasswordForm />

      <UserDataPart />

      <DangerZone />
    </Container>
  );
}

const userDataSchema = z.object({
  username: z.string().min(1, "Required"),
  name: z.string().min(1, "Required"),
  bio: z.string().optional(),
});

type UserDataFormSchemaType = z.infer<typeof userDataSchema>;

function UserDataForm() {
  const queryClient = useQueryClient();
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );
  const { data, isSuccess, isLoading, error } = useQuery({
    queryKey: ["user", "/auth/profile"],
    queryFn: async () =>
      await apiClient.get("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      }),
  });

  const [updates, setUpdates] = useState<number>(0);

  const {
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<UserDataFormSchemaType>({
    resolver: zodResolver(userDataSchema),
  });

  useEffect(() => {
    if (data && isSuccess) {
      setValue("username", data.username);
      setValue("name", data.full_name);
      setValue("bio", data?.biography || "");

      setUpdates((state) => state + 1);
    }
  }, [data, isSuccess, setValue]);

  const submitHandler = async ({
    username,
    name,
    bio,
  }: UserDataFormSchemaType) => {
    try {
      await apiClient.post(
        "/auth/profile",
        {
          username: username !== data?.username ? username : undefined,
          full_name: name,
          biography: bio,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      queryClient.invalidateQueries({ queryKey: ["user", "/auth/profile"] });
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
            message: error.message,
          });
        }
      } else {
        setError("root", {
          type: "manual",
          message: (error as Error).message || "Something went wrong.",
        });
      }
    }
  };

  return (
    <Box sx={{ mx: 2, display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="subtitle1">User data</Typography>

      <Controller
        control={control}
        name="username"
        rules={{ required: true }}
        render={({ field }) => (
          <TextField
            key={`username-${updates}`}
            label="Username"
            placeholder="j.planelles"
            variant="outlined"
            fullWidth
            required
            error={!!errors.username}
            helperText={errors.username?.message}
            disabled={isLoading || isSubmitting}
            {...field}
          />
        )}
      />

      <Controller
        control={control}
        name="name"
        rules={{ required: true }}
        render={({ field }) => (
          <TextField
            key={`name-${updates}`}
            label="Name"
            placeholder="Jordi Planelles"
            variant="outlined"
            fullWidth
            required
            error={!!errors.name}
            helperText={errors.name?.message}
            disabled={isLoading || isSubmitting}
            {...field}
          />
        )}
      />

      <Controller
        control={control}
        name="bio"
        rules={{ required: true }}
        render={({ field }) => (
          <TextField
            key={`bio-${updates}`}
            label="Biography"
            placeholder="We go gym!"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            error={!!errors.bio}
            helperText={errors.bio?.message}
            disabled={isLoading || isSubmitting}
            {...field}
          />
        )}
      />

      {errors.root && (
        <FormHelperText error>{errors.root.message}</FormHelperText>
      )}

      {error && <FormHelperText error>{error.message}</FormHelperText>}

      <Button
        variant="outlined"
        disabled={isLoading || isSubmitting}
        onClick={handleSubmit(submitHandler)}
      >
        {isSubmitting || isLoading ? "Updating..." : "Update user data"}
      </Button>

      {isSubmitSuccessful && (
        <FormHelperText sx={{ color: "success.main" }}>
          User data updated.
        </FormHelperText>
      )}
    </Box>
  );
}

const changePasswordSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

type ChangePasswordFormSchemaType = z.infer<typeof changePasswordSchema>;

function ChangePasswordForm() {
  const { apiClient, token, serverIp } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
      serverIp: state.serverIp,
    })),
  );

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ChangePasswordFormSchemaType>({
    resolver: zodResolver(changePasswordSchema),
  });

  const submitHandler = async ({ password }: ChangePasswordFormSchemaType) => {
    try {
      const encryptedPassword = await encodePassword(password, serverIp);

      await apiClient.post("/auth/change-password", undefined, {
        queries: { password: encryptedPassword },
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        setError("root", {
          type: "manual",
          message: "Something went wrong.",
        });
      }
    }
  };

  return (
    <Box sx={{ mx: 2, display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="subtitle1">Change Password</Typography>

      <Controller
        control={control}
        name="password"
        rules={{ required: true }}
        render={({ field }) => (
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            type="password"
            error={!!errors.password}
            helperText={errors.password?.message}
            {...field}
          />
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        rules={{ required: true }}
        render={({ field }) => (
          <TextField
            label="Confirm password"
            variant="outlined"
            fullWidth
            type="password"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            {...field}
          />
        )}
      />

      {errors.root && (
        <FormHelperText error>{errors.root.message}</FormHelperText>
      )}

      <Button
        variant="outlined"
        disabled={isSubmitting}
        onClick={handleSubmit(submitHandler)}
      >
        {isSubmitting ? "Changing..." : "Change password"}
      </Button>

      {isSubmitSuccessful && (
        <FormHelperText sx={{ color: "success.main" }}>
          Password changed.
        </FormHelperText>
      )}
    </Box>
  );
}

function UserDataPart() {
  const [showLikesDialog, setShowLikesDialog] = useState<boolean>(false);

  return (
    <Box sx={{ mx: 2, display: "flex", flexDirection: "column", gap: 2 }}>
      <Box>
        <Typography variant="subtitle1">About you</Typography>
        <Typography variant="body2">
          We use your likes to better pair you with users.
        </Typography>
      </Box>
      <Button
        variant="outlined"
        onClick={() => {
          setShowLikesDialog(true);
        }}
      >
        Review my interests
      </Button>

      <LikesDialog
        open={showLikesDialog}
        onClose={() => {
          setShowLikesDialog(false);
        }}
        onSuccess={() => {
          setShowLikesDialog(false);
        }}
      />
    </Box>
  );
}

function DangerZone() {
  return (
    <Box sx={{ mx: 2, display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="subtitle1">Danger zone</Typography>
      <DeleteAccountButton />
    </Box>
  );
}

const DeleteAccountButton = () => {
  const navigate = useNavigate();
  const { setToken } = useAuthStore(
    useShallow((store) => ({
      setToken: store.setToken,
    })),
  );
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  const [visible, setVisible] = useState<boolean>(false);
  const [queryError, setQueryError] = useState<string | null>(null);

  const deleteAccountHandler = async () => {
    setQueryError(null)
    try {
      await apiClient.post("/auth/disable", undefined, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await updateAuthConfig({ token: undefined });
      setVisible(false);
      setToken(null);
      navigate("/");
    } catch (error) {
      setQueryError(handleError(error));
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<PersonRemoveIcon />}
        onClick={() => setVisible(true)}
      >
        Delete account
      </Button>

      <Snackbar
        open={!!queryError}
        onClose={() => setQueryError(null)}
        message={queryError}
      />

      <Dialog open={visible} onClose={() => setVisible(false)}>
        <DialogContent>
          <DialogContentText>
            Do you wish to delete your account?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVisible(false)}>No</Button>
          <Button onClick={deleteAccountHandler}>Yes</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
