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

/**
 * Pàgina de configuració del perfil d'usuari.
 * Permet editar les dades personals, canviar la contrasenya, gestionar el rol de trainer i accedir a accions crítiques.
 * @returns {JSX.Element} El component de la pàgina de configuració del perfil.
 */
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

// Esquema de validació per a les dades de l'usuari
const userDataSchema = z.object({
  username: z.string().min(1, "Required"),
  name: z.string().min(1, "Required"),
  bio: z.string().optional(),
});

type UserDataFormSchemaType = z.infer<typeof userDataSchema>;

/**
 * Formulari per editar les dades bàsiques de l'usuari (nom, usuari, biografia).
 * Mostra errors de validació i missatges d'èxit.
 */
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

  // Estat per forçar l'actualització dels camps
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

  // Inicialitza el formulari amb les dades rebudes de l'API
  useEffect(() => {
    if (data && isSuccess) {
      setValue("username", data.username);
      setValue("name", data.full_name);
      setValue("bio", data?.biography || "");
      setUpdates((state) => state + 1);
    }
  }, [data, isSuccess, setValue]);

  /**
   * Handler per enviar les dades modificades a l'API.
   * Mostra errors específics si el nom d'usuari ja existeix.
   */
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

      {/* Camp d'usuari */}
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

      {/* Camp de nom complet */}
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

      {/* Camp de biografia */}
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

      {/* Errors globals i de l'API */}
      {errors.root && (
        <FormHelperText error>{errors.root.message}</FormHelperText>
      )}
      {error && <FormHelperText error>{error.message}</FormHelperText>}

      {/* Botó per actualitzar les dades */}
      <Button
        variant="outlined"
        disabled={isLoading || isSubmitting}
        onClick={handleSubmit(submitHandler)}
      >
        {isSubmitting || isLoading ? "Updating..." : "Update user data"}
      </Button>

      {/* Missatge d'èxit */}
      {isSubmitSuccessful && (
        <FormHelperText sx={{ color: "success.main" }}>
          User data updated.
        </FormHelperText>
      )}
    </Box>
  );
}

// Esquema de validació per al canvi de contrasenya
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

/**
 * Formulari per canviar la contrasenya de l'usuari.
 * Mostra errors de validació i missatges d'èxit.
 */
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

  /**
   * Handler per enviar la nova contrasenya a l'API (encriptada).
   */
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

      {/* Camp de nova contrasenya */}
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

      {/* Camp de confirmació de contrasenya */}
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

      {/* Error global */}
      {errors.root && (
        <FormHelperText error>{errors.root.message}</FormHelperText>
      )}

      {/* Botó per canviar la contrasenya */}
      <Button
        variant="outlined"
        disabled={isSubmitting}
        onClick={handleSubmit(submitHandler)}
      >
        {isSubmitting ? "Changing..." : "Change password"}
      </Button>

      {/* Missatge d'èxit */}
      {isSubmitSuccessful && (
        <FormHelperText sx={{ color: "success.main" }}>
          Password changed.
        </FormHelperText>
      )}
    </Box>
  );
}

/**
 * Mostra opcions addicionals si l'usuari és entrenador (trainer).
 * Permet revisar interessos i donar-se de baixa com a entrenador.
 */
function UserDataPart() {
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );
  const { data } = useQuery({
    queryKey: ["user", "/auth/profile"],
    queryFn: async () =>
      await apiClient.get("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      }),
  });

  const [showLikesDialog, setShowLikesDialog] = useState<boolean>(false);

  return (
    data?.is_trainer && (
      <Box sx={{ mx: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        <Box>
          <Typography variant="subtitle1">Personal Trainer</Typography>
          <Typography variant="body2">
            We use your interests to better pair you with users.
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

        <UnenrollAsTrainerButton />
      </Box>
    )
  );
}

/**
 * Zona de perill amb accions crítiques: eliminar el compte.
 * @returns {JSX.Element} El component de la zona de perill.
 */
function DangerZone() {
  return (
    <Box sx={{ mx: 2, display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="subtitle1">Danger zone</Typography>
      <DeleteAccountButton />
    </Box>
  );
}

/**
 * Botó per eliminar el compte de l'usuari.
 * Mostra un diàleg de confirmació i un Snackbar en cas d'error.
 */
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

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [queryError, setQueryError] = useState<string | null>(null);

  /**
   * Handler per eliminar el compte de l'usuari.
   * Desa l'estat i redirigeix a la pantalla principal.
   */
  const deleteAccountHandler = async () => {
    setQueryError(null);
    setIsLoading(true);
    try {
      await apiClient.post("/auth/delete", undefined, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await updateAuthConfig({ token: undefined });
      setVisible(false);
      setToken(null);
      navigate("/");
    } catch (error) {
      setQueryError(handleError(error));
    }
    setIsLoading(false);
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
          <Button onClick={() => setVisible(false)} disabled={isLoading}>
            No
          </Button>
          <Button onClick={deleteAccountHandler} disabled={isLoading}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

/**
 * Botó per donar-se de baixa com a entrenador.
 * Mostra un diàleg de confirmació i un Snackbar en cas d'error.
 */
const UnenrollAsTrainerButton = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  const [visible, setVisible] = useState<boolean>(false);
  const [queryError, setQueryError] = useState<string | null>(null);

  /**
   * Handler per donar-se de baixa com a entrenador.
   * Invalida la cache i redirigeix a la pantalla principal.
   */
  const deleteAccountHandler = async () => {
    setQueryError(null);
    try {
      await apiClient.post("/auth/unregister/trainer", undefined, {
        headers: { Authorization: `Bearer ${token}` },
      });

      queryClient.invalidateQueries({ queryKey: ["user", "trainer"] });
      queryClient.invalidateQueries({ queryKey: ["user", "/auth/profile"] });
      setVisible(false);
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
        Unenroll as trainer
      </Button>

      <Snackbar
        open={!!queryError}
        onClose={() => setQueryError(null)}
        message={queryError}
      />

      <Dialog open={visible} onClose={() => setVisible(false)}>
        <DialogContent>
          <DialogContentText>
            Do you wish to unenroll as trainer?
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
