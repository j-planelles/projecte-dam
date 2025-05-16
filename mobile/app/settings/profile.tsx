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

  useEffect(() => {
    if (data && isSuccess) {
      setValue("username", data.username);
      setValue("name", data.full_name);
      setValue("bio", data?.biography || "");
    }
  }, [data, isSuccess]);

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

      <Controller
        control={control}
        name="bio"
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            mode="outlined"
            label="Biography"
            multiline
            placeholder="Femboy by day, gym bro by night 🏋♂🌈🇹"
            error={errors.bio !== undefined}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            disabled={isLoading || isSubmitting}
          />
        )}
      />

      {errors.bio && <HelperText type="error">{errors.bio.message}</HelperText>}

      {errors.root && (
        <HelperText type="error">{errors.root.message}</HelperText>
      )}

      {error && <HelperText type="error">{error.message}</HelperText>}

      <Button
        mode="outlined"
        disabled={isLoading}
        loading={isSubmitting || isLoading}
        onPress={handleSubmit(submitHandler)}
      >
        Update user data
      </Button>

      {isSubmitSuccessful && (
        <HelperText type="info">User data updated.</HelperText>
      )}
    </View>
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
      setError("root", {
        type: "manual",
        message: handleError(error),
      });
    }
  };

  return (
    <View className="mx-4 gap-2">
      <Text variant="titleSmall">Change Password</Text>
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

      <Button
        mode="outlined"
        loading={isSubmitting}
        disabled={isSubmitting}
        onPress={handleSubmit(submitHandler)}
      >
        Change password
      </Button>

      {isSubmitSuccessful && (
        <HelperText type="info">Password changed.</HelperText>
      )}
    </View>
  );
}

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
