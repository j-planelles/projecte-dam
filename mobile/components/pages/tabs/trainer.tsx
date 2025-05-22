import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Image, RefreshControl, View } from "react-native";
import { Avatar, Button, IconButton, Text, useTheme } from "react-native-paper";
import { useShallow } from "zustand/react/shallow";
import TrainerImage from "../../../assets/trainer-enroll.jpg";
import { useAuthStore } from "../../../store/auth-store";
import {
  DumbellIcon,
  MessagesIcon,
  MoreVerticalIcon,
  NavigateNextIcon,
} from "../../Icons";
import WorkoutCard from "../../ui/WorkoutCard";
import HomeTabsScreen from "../../ui/screen/HomeTabsScreen";

/**
 * Component principal de la pestanya "Trainer".
 * Mostra informació sobre l'entrenador personal, l'estat de la sol·licitud d'entrenador,
 * i les plantilles d'entrenament suggerides per l'entrenador.
 * @returns {JSX.Element} El component de la pestanya Entrenador.
 */
export default function TrainerTab() {
  const queryClient = useQueryClient();
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  // Consulta per obtenir l'estat de la sol·licitud d'entrenador de l'usuari
  const requestQuery = useQuery({
    queryKey: ["user", "trainer", "/user/trainer/status"],
    queryFn: async () =>
      await apiClient.get("/user/trainer/status", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    retry: false,
  });

  // Consulta per obtenir la informació de l'entrenador assignat (si n'hi ha)
  const infoQuery = useQuery({
    queryKey: ["user", "trainer", "/user/trainer/info"],
    queryFn: async () =>
      await apiClient.get("/user/trainer/info", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    retry: false,
  });

  // Indica si alguna de les consultes principals està carregant
  const isLoading = infoQuery.isLoading || requestQuery.isLoading;
  const [refreshing, setRefreshing] = useState<boolean>(false);

  /**
   * Gestiona l'acció de refrescar la pantalla.
   * Invalida les consultes relacionades amb l'entrenador per recarregar les dades.
   */
  const refreshControlHandler = () => {
    setRefreshing(true);
    queryClient.invalidateQueries({ queryKey: ["user", "trainer"] }); // Invalida totes les consultes de l'entrenador

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  return (
    <HomeTabsScreen
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refreshControlHandler}
        />
      }
    >
      {isLoading ? ( // Mostra un indicador de càrrega si les dades s'estan obtenint
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : infoQuery.isSuccess ? ( // Si la consulta d'informació de l'entrenador té èxit (l'usuari té un entrenador)
        <>
          <Text variant="headlineLarge">Personal Trainer</Text>
          <ProfilePictureHeader fullName={infoQuery.data.full_name} />
          <View className="flex-1 flex-row items-center">
            <Link href="/trainer/chat" asChild>
              <Button
                icon={({ color }) => <MessagesIcon color={color} />}
                mode="contained"
                className="flex-1"
              >
                Message Board
              </Button>
            </Link>
          </View>
          <TrainerTemplatesList />
        </>
      ) : (
        // Si l'usuari no té un entrenador assignat o la sol·licitud està pendent
        <>
          <Text variant="headlineLarge">Personal Trainer</Text>
          <Image
            source={TrainerImage}
            className="flex-1 w-full h-full rounded-[24px]"
            style={{ height: 200 }}
            resizeMode="cover"
          />
          <Text variant="bodySmall">Photo by Michael DeMoya on Unsplash</Text>
          <Text variant="bodyMedium">
            Unleash your potential and sculpt your dream body with a
            personalized fitness journey guided by our expert gym trainer
            service.
          </Text>
          {requestQuery.isSuccess ? ( // Si la consulta d'estat de la sol·licitud té èxit (sol·licitud enviada)
            <>
              <ProfilePictureHeader fullName={requestQuery.data.full_name} />
              <View className="flex-row items-center gap-4 justify-center">
                <ActivityIndicator size="large" />
                <Text variant="titleSmall">
                  {requestQuery.data.full_name.split(" ")[0]} is reviewing your
                  application...
                </Text>
              </View>
            </>
          ) : (
            // Si no hi ha sol·licitud enviada, mostra el botó per inscriure's
            <Link asChild href="/trainer/onboarding/likes">
              <Button
                mode="contained"
                icon={({ color }) => <NavigateNextIcon color={color} />}
              >
                Enroll
              </Button>
            </Link>
          )}
        </>
      )}
    </HomeTabsScreen>
  );
}

/**
 * Component que mostra una llista de plantilles d'entrenament suggerides per l'entrenador.
 * @returns {JSX.Element} El component de la llista de plantilles de l'entrenador.
 */
const TrainerTemplatesList = () => {
  const theme = useTheme();
  const router = useRouter();
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  // Consulta per obtenir les recomanacions de plantilles de l'entrenador
  const { data, isLoading, isSuccess, error } = useQuery({
    queryKey: ["user", "trainer", "/user/trainer/recommendation"],
    queryFn: async () =>
      await apiClient.get("/user/trainer/recommendation", {
        headers: { Authorization: `Bearer ${token}` },
      }),
  });

  return (
    <>
      <Text className="flex-1 text-lg font-bold">Suggested by trainer</Text>

      {isLoading && ( // Mostra un indicador de càrrega mentre s'obtenen les dades
        <View>
          <ActivityIndicator size={"large"} />
        </View>
      )}
      {error && ( // Mostra un missatge d'error si la càrrega falla
        <View>
          <Text>{error.message}</Text>
        </View>
      )}
      {isSuccess && // Si la càrrega és exitosa
        (data.length > 0 ? ( // Si hi ha plantilles per mostrar
          data
            .map(
              (data) =>
                ({
                  uuid: data.uuid,
                  title: data.name,
                  description: data.description,
                  timestamp: data.instance?.timestamp_start || 0,
                  duration: data.instance?.duration || 0,
                  exercises: data.entries.map((entry) => ({
                    restCountdownDuration: entry.rest_countdown_duration,
                    weightUnit: entry.weight_unit,
                    exercise: {
                      uuid: entry.exercise.uuid,
                      name: entry.exercise.name,
                      description: entry.exercise.description,
                      bodyPart: entry.exercise.body_part,
                      type: entry.exercise.type,
                    },
                    sets: entry.sets.map((set) => ({
                      reps: set.reps,
                      weight: set.weight,
                    })),
                  })),
                }) as workout,
            )
            .map((workout) => (
              <WorkoutCard
                key={workout.uuid}
                workout={workout}
                showTimestamp={false}
                showDescription={true}
                onPress={() =>
                  router.push(`/community/template-view/${workout.uuid}`)
                }
              />
            ))
        ) : (
          // Si no hi ha plantilles, mostra un missatge informatiu
          <View className="flex-1 items-center gap-8 pt-16">
            <DumbellIcon size={130} color={theme.colors.onSurface} />
            <View className="gap-4 items-center">
              <Text variant="headlineLarge">No templates found.</Text>
              <Text variant="bodyMedium">
                Wait for your trainer to recommend you a template.
              </Text>
            </View>
          </View>
        ))}
    </>
  );
};

/**
 * Component que mostra la capçalera amb l'avatar i el nom de l'entrenador.
 * @param {object} props - Propietats del component.
 * @param {string} props.fullName - Nom complet de l'entrenador.
 * @returns {JSX.Element} El component de la capçalera del perfil de l'entrenador.
 */
const ProfilePictureHeader = ({ fullName }: { fullName: string }) => {
  // Obté la inicial del nom per a l'avatar
  const profilePicturePlaceholder = fullName.charAt(0).toUpperCase();

  return (
    <View className="flex-1 flex-row items-center gap-4">
      <Avatar.Text size={48} label={profilePicturePlaceholder} />
      <View className="flex-1">
        <Text className="text-xl font-bold">{fullName}</Text>
      </View>
      {/* Enllaç a la configuració relacionada amb l'entrenador */}
      <Link asChild href="/settings/trainer">
        <IconButton
          icon={(props) => <MoreVerticalIcon {...props} />}
          style={{ margin: 0 }}
        />
      </Link>
    </View>
  );
};