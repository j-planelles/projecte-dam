import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import {
  Appbar,
  Avatar,
  Button,
  Dialog,
  HelperText,
  Portal,
  Text,
} from "react-native-paper";
import { useShallow } from "zustand/react/shallow";
import {
  PersonAddIcon,
  PersonRemoveIcon,
  RefreshIcon,
} from "../../components/Icons";
import Header from "../../components/ui/Header";
import { ThemedView } from "../../components/ui/screen/Screen";
import { handleError } from "../../lib/errorHandler";
import { useAuthStore } from "../../store/auth-store";

/**
 * Pàgina de configuració del perfil per gestionar la relació amb l'entrenador.
 * Permet veure l'estat de la sol·licitud, desvincular-se o iniciar el procés d'enllaç amb un entrenador.
 * @returns {JSX.Element} El component de la pàgina de configuració del perfil.
 */
export default function ProfileSettingsPage() {
  const queryClient = useQueryClient();
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  // Consulta l'estat de la sol·licitud d'entrenador (pendent, acceptada, etc.)
  const requestQuery = useQuery({
    queryKey: ["user", "trainer", "/user/trainer/status"],
    queryFn: async () =>
      await apiClient.get("/user/trainer/status", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    retry: false,
  });

  // Consulta la informació de l'entrenador si ja està enllaçat
  const infoQuery = useQuery({
    queryKey: ["user", "trainer", "/user/trainer/info"],
    queryFn: async () =>
      await apiClient.get("/user/trainer/info", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    retry: false,
  });

  // Estat de càrrega combinat de les dues consultes
  const isLoading = infoQuery.isLoading || requestQuery.isLoading;
  const isFetching = infoQuery.isFetching || requestQuery.isFetching;

  // Handler per refrescar les dades de l'entrenador
  const refreshHandler = () => {
    queryClient.invalidateQueries({ queryKey: ["user", "trainer"] });
  };

  return (
    <ThemedView className="flex-1">
      <Header title="Manage your trainer">
        {/* Botó per refrescar les dades si no està carregant */}
        {!isLoading && (
          <Appbar.Action
            animated={false}
            icon={({ color }) => <RefreshIcon color={color} />}
            onPress={refreshHandler}
            disabled={isFetching}
          />
        )}
      </Header>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <ScrollView>
          <View className="pt-4 gap-4">
            <View className="mx-4 gap-4">
              {/* Mostra la capçalera amb el nom de l'entrenador si hi ha dades */}
              {requestQuery.isSuccess ||
                (infoQuery.isSuccess && (
                  <ProfilePictureHeader
                    fullName={
                      infoQuery.isSuccess
                        ? infoQuery.data.full_name
                        : requestQuery.data?.full_name || ""
                    }
                  />
                ))}
              <Text variant="bodyMedium">
                You’re always in control. Customize your fitness journey by
                setting boundaries for what trainers can suggest or adjust—from
                workout plans and intensity levels to communication preferences.
              </Text>
              {/* Mostra el contingut segons l'estat de la relació amb l'entrenador */}
              {requestQuery.isSuccess ? (
                <ReviewingContent fullName={requestQuery.data.full_name} />
              ) : infoQuery.isSuccess ? (
                <EnrolledContent />
              ) : (
                <UnenrolledContent />
              )}
            </View>
          </View>
        </ScrollView>
      )}
    </ThemedView>
  );
}

/**
 * Component per mostrar el botó d'enllaçar-se amb un entrenador si l'usuari no en té cap.
 * @returns {JSX.Element} El component per iniciar l'onboarding amb entrenador.
 */
const UnenrolledContent = () => {
  return (
    <Link asChild href="/trainer/onboarding/likes">
      <Button
        mode="outlined"
        icon={({ color }) => <PersonAddIcon color={color} />}
      >
        Enroll with trainer
      </Button>
    </Link>
  );
};

/**
 * Component per mostrar el botó de desvincular-se de l'entrenador si ja està enllaçat.
 * Mostra un diàleg de confirmació abans de fer l'acció.
 * @returns {JSX.Element} El component per desvincular-se de l'entrenador.
 */
const EnrolledContent = () => {
  const queryClient = useQueryClient();
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  const [dialogVisible, setDialogVisible] = useState<boolean>(false);

  const handleDialogClose = () => {
    setDialogVisible(false);
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [queryError, setQueryError] = useState<string | null>(null);

  /**
   * Handler per desvincular-se de l'entrenador.
   * Invalida la cache després de l'acció.
   */
  const unenrollHandler = async () => {
    handleDialogClose();
    setIsLoading(true);
    setQueryError(null);
    try {
      await apiClient.post("/user/trainer/unpair", undefined, {
        headers: { Authorization: `Bearer ${token}` },
      });
      queryClient.invalidateQueries({ queryKey: ["user", "trainer"] });
    } catch (error: unknown) {
      setQueryError(handleError(error));
    }
    setIsLoading(false);
  };

  return (
    <>
      <Button
        mode="outlined"
        icon={({ color }) => <PersonRemoveIcon color={color} />}
        disabled={isLoading}
        onPress={() => setDialogVisible(true)}
      >
        Unlink with trainer
      </Button>
      {queryError && <HelperText type="error">{queryError}</HelperText>}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={handleDialogClose}>
          <Dialog.Title>Unlink with trainer</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to unlink with your trainer? After
              unlinking, you won't be able to access any of the recommended
              workouts.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleDialogClose}>No</Button>
            <Button onPress={unenrollHandler}>Yes</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

/**
 * Component per mostrar l'estat de sol·licitud pendent amb l'entrenador.
 * Permet cancel·lar la sol·licitud mentre està en revisió.
 * @param fullName Nom complet de l'entrenador.
 * @returns {JSX.Element} El component per gestionar la sol·licitud pendent.
 */
const ReviewingContent = ({ fullName }: { fullName: string }) => {
  const queryClient = useQueryClient();
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  const [dialogVisible, setDialogVisible] = useState<boolean>(false);

  const handleDialogClose = () => {
    setDialogVisible(false);
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [queryError, setQueryError] = useState<string | null>(null);

  /**
   * Handler per cancel·lar la sol·licitud d'enllaç amb l'entrenador.
   * Invalida la cache després de l'acció.
   */
  const unenrollHandler = async () => {
    handleDialogClose();
    setIsLoading(true);
    setQueryError(null);
    try {
      await apiClient.post("/user/trainer/cancel-request", undefined, {
        headers: { Authorization: `Bearer ${token}` },
      });
      queryClient.invalidateQueries({ queryKey: ["user", "trainer"] });
    } catch (error: unknown) {
      setQueryError(handleError(error));
    }
    setIsLoading(false);
  };
  return (
    <>
      <View className="flex-row items-center gap-4 justify-center">
        <ActivityIndicator size="large" />
        <Text variant="titleSmall">
          {fullName.split(" ")[0]} is reviewing your application...
        </Text>
      </View>
      <Button
        mode="outlined"
        icon={({ color }) => <PersonRemoveIcon color={color} />}
        disabled={isLoading}
        onPress={() => setDialogVisible(true)}
      >
        Cancel enrollment application
      </Button>
      {queryError && <HelperText type="error">{queryError}</HelperText>}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={handleDialogClose}>
          <Dialog.Title>Cancel enrollment application</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to cancel the enrollment request?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleDialogClose}>No</Button>
            <Button onPress={unenrollHandler}>Yes</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

/**
 * Capçalera amb la inicial del nom de l'entrenador i el nom complet.
 * @param fullName Nom complet de l'entrenador.
 * @returns {JSX.Element} El component de la capçalera de perfil.
 */
const ProfilePictureHeader = ({ fullName }: { fullName: string }) => {
  const profilePicturePlaceholder = fullName.charAt(0).toUpperCase();

  return (
    <View className="flex-1 flex-row items-center gap-4">
      <Avatar.Text size={48} label={profilePicturePlaceholder} />
      <View className="flex-1">
        <Text className="text-xl font-bold">{fullName}</Text>
      </View>
    </View>
  );
};
