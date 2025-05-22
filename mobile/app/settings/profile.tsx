import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, View } from "react-native";
import {
  Button,
  HelperText,
  Text,
  TextInput,
  Dialog,
  Portal,
  Snackbar,
} from "react-native-paper";
import { unknown, z } from "zod";
import { useShallow } from "zustand/react/shallow";
import { LogOutIcon, PersonRemoveIcon } from "../../components/Icons";
import Header from "../../components/ui/Header";
import { ThemedView } from "../../components/ui/screen/Screen";
import { useAuthStore } from "../../store/auth-store";
import { useRouter } from "expo-router";
import * as SecureStorage from "expo-secure-store";
import { encodePassword } from "../../lib/crypto";
import { handleError } from "../../lib/errorHandler";

/**
 * Pàgina de configuració del perfil d'usuari.
 * Permet editar les dades personals, canviar la contrasenya i accedir a accions crítiques com tancar sessió o eliminar el compte.
 * @returns {JSX.Element} El component de la pàgina de configuració del perfil.
 */
export default function ProfileSettingsPage() {
  return (
    <ThemedView className="flex-1">
      <Header title="Your profile" />
      <ScrollView>
        <View className="pt-4 gap-4">
          <UserDataForm />
          <ChangePasswordForm />
          <DangerZone />
        </View>
      </ScrollView>
    </ThemedView>
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

  // Inicialitza el formulari amb les dades rebudes de l'API
  useEffect(() => {
    if (data && isSuccess) {
      setValue("username", data.username);
      setValue("name", data.full_name);
      setValue("bio", data?.biography || "");
    }
  }, [data, isSuccess]);

  // Handler per enviar les dades modificades a l'API
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
      if (error instanceof AxiosError && error?.response?.status === 409) {
        setError("username", {
          type: "manual",
          message: "Username already taken.",
        });
      } else {
        setError("root", {
          type: "manual",
          message: handleError(error),
        });
      }
    }
  };

  const {
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<UserDataFormSchemaType>({
    resolver: zodResolver(userDataSchema),
  });

  return (
    <View className="mx-4 gap-2">
      <Text variant="titleSmall">User data</Text>

      {/* Camp d'usuari */}
      <Controller
        control={control}
        name="username"
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Username"
            placeholder="j.planelles"
            mode="outlined"
            autoCorrect={false}
            autoCapitalize="none"
            error={errors.username !== undefined}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            disabled={isLoading || isSubmitting}
          />
        )}
      />
      {errors.username && (
        <HelperText type="error">{errors.username.message}</HelperText>
      )}

      {/* Camp de nom complet */}
      <Controller
        control={control}
        name="name"
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            mode="outlined"
            label="Name"
            placeholder="Jordi Planelles"
            error={errors.name !== undefined}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            disabled={isLoading || isSubmitting}
          />
        )}
      />
      {errors.name && (
        <HelperText type="error">{errors.name.message}</HelperText>
      )}

      {/* Camp de biografia */}
      <Controller
        control={control}
        name="bio"
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            mode="outlined"
            label="Biography"
            multiline
            placeholder="We go gym!"
            error={errors.bio !== undefined}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            disabled={isLoading || isSubmitting}
          />
        )}
      />
      {errors.bio && <HelperText type="error">{errors.bio.message}</HelperText>}

      {/* Errors globals i de l'API */}
      {errors.root && (
        <HelperText type="error">{errors.root.message}</HelperText>
      )}
      {error && <HelperText type="error">{error.message}</HelperText>}

      {/* Botó per actualitzar les dades */}
      <Button
        mode="outlined"
        disabled={isLoading}
        loading={isSubmitting || isLoading}
        onPress={handleSubmit(submitHandler)}
      >
        Update user data
      </Button>

      {/* Missatge d'èxit */}
      {isSubmitSuccessful && (
        <HelperText type="info">User data updated.</HelperText>
      )}
    </View>
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

  // Handler per enviar la nova contrasenya a l'API (encriptada)
  const submitHandler = async ({ password }: ChangePasswordFormSchemaType) => {
    try {
      const encryptedPassword = await encodePassword(password, serverIp);

      await apiClient.post("/auth/change-password", undefined, {
        queries: { password: encryptedPassword },
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      setError("root", {
        type: "manual",
        message: handleError(error),
      });
    }
  };

  return (
    <View className="mx-4 gap-2">
      <Text variant="titleSmall">Change Password</Text>
      {/* Camp de nova contrasenya */}
      <Controller
        control={control}
        name="password"
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            mode="outlined"
            error={!!errors.password}
            secureTextEntry
          />
        )}
      />
      {errors.password && (
        <Text className="font-bold text-red-500">
          {errors.password.message}
        </Text>
      )}

      {/* Camp de confirmació de contrasenya */}
      <Controller
        control={control}
        name="confirmPassword"
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Confirm password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            mode="outlined"
            error={!!errors.confirmPassword}
            secureTextEntry
          />
        )}
      />
      {errors.confirmPassword && (
        <Text className="font-bold text-red-500">
          {errors.confirmPassword.message}
        </Text>
      )}

      {/* Botó per canviar la contrasenya */}
      <Button
        mode="outlined"
        loading={isSubmitting}
        disabled={isSubmitting}
        onPress={handleSubmit(submitHandler)}
      >
        Change password
      </Button>

      {/* Missatge d'èxit */}
      {isSubmitSuccessful && (
        <HelperText type="info">Password changed.</HelperText>
      )}
    </View>
  );
}

/**
 * Zona de perill amb accions crítiques: tancar sessió i eliminar el compte.
 * @returns {JSX.Element} El component de la zona de perill.
 */
function DangerZone() {
  return (
    <>
      <View className="mx-4 gap-2">
        <Text variant="titleSmall" className="pb-2">
          Danger zone
        </Text>
        <LogOutButton />
        <DeleteAccountButton />
      </View>
    </>
  );
}

/**
 * Botó per tancar la sessió de l'usuari.
 * Mostra un diàleg de confirmació abans de tancar la sessió.
 */
const LogOutButton = () => {
  const router = useRouter();
  const { setToken, setConnectionTest } = useAuthStore(
    useShallow((store) => ({
      setToken: store.setToken,
      setConnectionTest: store.setConnectionTest,
    })),
  );

  const [visible, setVisible] = useState<boolean>(false);
  const logOutHandler = async () => {
    await SecureStorage.deleteItemAsync("token");
    setVisible(false);
    setToken(null);
    setConnectionTest(false);
    router.dismissAll();
    router.replace("/");
  };

  return (
    <>
      <Button
        mode="outlined"
        icon={({ color }) => <LogOutIcon color={color} />}
        onPress={() => setVisible(true)}
      >
        Log Out
      </Button>
      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Content>
            <Text variant="bodyMedium">Do you wish to log out?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)}>No</Button>
            <Button onPress={logOutHandler}>Yes</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

/**
 * Botó per eliminar el compte de l'usuari.
 * Mostra un diàleg de confirmació i un Snackbar en cas d'error.
 */
const DeleteAccountButton = () => {
  const router = useRouter();
  const { setToken, setConnectionTest } = useAuthStore(
    useShallow((store) => ({
      setToken: store.setToken,
      setConnectionTest: store.setConnectionTest,
    })),
  );
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  const [queryError, setQueryError] = useState<string | null>(null);
  const [visible, setVisible] = useState<boolean>(false);

  // Handler per eliminar el compte de l'usuari
  const deleteAccountHandler = async () => {
    setQueryError(null);
    try {
      await apiClient.post("/auth/delete", undefined, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await SecureStorage.deleteItemAsync("token");
      setVisible(false);
      setToken(null);
      setConnectionTest(false);
      router.dismissAll();
      router.replace("/");
    } catch (error) {
      setQueryError(handleError(unknown));
    }
  };

  return (
    <>
      <Button
        mode="outlined"
        icon={({ color }) => <PersonRemoveIcon color={color} />}
        onPress={() => setVisible(true)}
      >
        Delete account
      </Button>
      <Portal>
        <Snackbar visible={!!queryError} onDismiss={() => setQueryError(null)}>
          {queryError}
        </Snackbar>
      </Portal>
      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Do you wish to delete your account?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)}>No</Button>
            <Button onPress={deleteAccountHandler}>Yes</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};
