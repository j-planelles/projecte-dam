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
} from "react-native-paper";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import { LogOutIcon, PersonRemoveIcon } from "../../components/Icons";
import Header from "../../components/ui/Header";
import { ThemedView } from "../../components/ui/screen/Screen";
import { useAuthStore } from "../../store/auth-store";
import { useRouter } from "expo-router";
import * as SecureStorage from "expo-secure-store";

export default function ProfileSettingsPage() {
  return (
    <ThemedView className="flex-1">
      <Header title="Your profile" />
      <ScrollView>
        <View className="pt-4 gap-4">
          <UserDataForm />

          <ChangePasswordForm />

          <AboutYouPart />

          <DangerZone />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const userDataSchema = z.object({
  username: z.string(),
  name: z.string(),
  bio: z.string().optional(),
});

type FormSchemaType = z.infer<typeof userDataSchema>;

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

  const submitHandler = async ({ username, name, bio }: FormSchemaType) => {
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

  const {
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormSchemaType>({ resolver: zodResolver(userDataSchema) });
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

function ChangePasswordForm() {
  return (
    <View className="mx-4 gap-2">
      <Text variant="titleSmall">Change Password</Text>
      <TextInput label="Password" mode="outlined" secureTextEntry />
      <TextInput label="Repeat Password" mode="outlined" secureTextEntry />
      <Button mode="outlined">Change password</Button>
    </View>
  );
}

function AboutYouPart() {
  return (
    <View className="mx-4 gap-2">
      <Text variant="titleSmall">About you</Text>
      <Text>
        We use your likes to better pair you with a personal trainer.{" "}
      </Text>
      <Button mode="outlined">Review my likes</Button>
      <Text>
        Your usual gym will be used to set the location field in new workouts.
      </Text>
      <Button mode="outlined">Change my usual gym</Button>
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

  const [visible, setVisible] = useState<boolean>(false);
  const deleteAccountHandler = () => {
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
        icon={({ color }) => <PersonRemoveIcon color={color} />}
        onPress={() => setVisible(true)}
      >
        Delete account
      </Button>
      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Content>
            <Text variant="bodyMedium">Do you wish to log out?</Text>
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
