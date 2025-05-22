import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import {
  Avatar,
  Button,
  Dialog,
  HelperText,
  List,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";
import { useShallow } from "zustand/react/shallow";
import { NavigateNextIcon, PeopleIcon } from "../../../components/Icons";
import Header from "../../../components/ui/Header";
import { ThemedView } from "../../../components/ui/screen/Screen";
import { handleError } from "../../../lib/errorHandler";
import { useAuthStore } from "../../../store/auth-store";

/**
 * Pàgina per seleccionar un entrenador durant l'onboarding.
 * Mostra una llista d'entrenadors disponibles i permet sol·licitar-ne un.
 * @returns {JSX.Element} El component de la pàgina de selecció d'entrenador.
 */
export default function TrainerOnboardingListPage() {
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  // Consulta la llista d'entrenadors disponibles
  const { data, isLoading, isSuccess, error } = useQuery({
    queryKey: ["user", "trainer", "/user/trainer/search"],
    queryFn: async () =>
      await apiClient.get("/user/trainer/search", {
        headers: { Authorization: `Bearer ${token}` },
      }),
  });

  return (
    <ThemedView className="flex-1">
      <Header title="Choose your trainer" />

      {/* Mostra un missatge d'error si la consulta falla */}
      {error && <HelperText type="error">{error.message}</HelperText>}

      {/* Mostra un indicador de càrrega mentre es carrega la llista */}
      {isLoading && <ActivityIndicator size="large" />}

      {/* Mostra la llista d'entrenadors si la consulta té èxit */}
      {isSuccess && <TrainerList data={data} />}
    </ThemedView>
  );
}

/**
 * Component que mostra la llista d'entrenadors i permet seleccionar-ne un.
 * Permet enviar una sol·licitud per connectar amb l'entrenador seleccionat.
 * @param data Llista d'entrenadors disponibles.
 * @returns {JSX.Element} El component de la llista d'entrenadors.
 */
const TrainerList = ({ data }: { data: any }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  // Estat per controlar el diàleg de confirmació, càrrega, errors i entrenador seleccionat
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [selectedTrainer, setSelectedTrainer] = useState<string>("");
  const navigationDisabled = selectedTrainer === "" || isLoading;

  /**
   * Handler per enviar la sol·licitud a l'entrenador seleccionat.
   * Mostra un diàleg de confirmació si té èxit.
   */
  const handleSubmit = async () => {
    setIsLoading(true);
    setQueryError(null);
    try {
      await apiClient.post("/user/trainer/request", undefined, {
        queries: { trainer_uuid: selectedTrainer },
        headers: { Authorization: `Bearer ${token}` },
      });
      queryClient.invalidateQueries({ queryKey: ["user", "trainer"] });
      setDialogVisible(true);
    } catch (error: unknown) {
      setQueryError(handleError(error));
    }
    setIsLoading(false);
  };

  /**
   * Handler per tancar el diàleg i navegar a la pàgina principal.
   */
  const navigateHome = () => {
    setDialogVisible(false);
    router.push("/");
  };

  return (
    <>
      {/* Llista d'entrenadors */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.uuid}
        renderItem={({ item }) => (
          <List.Item
            title={item.full_name}
            description={item.biography}
            left={() => (
              <View className="pl-4">
                {selectedTrainer === item.uuid ? (
                  <Avatar.Icon size={48} icon="check" />
                ) : (
                  <Avatar.Text
                    size={48}
                    label={item.full_name.charAt(0).toUpperCase()}
                  />
                )}
              </View>
            )}
            onPress={() =>
              selectedTrainer === item.uuid
                ? setSelectedTrainer("")
                : setSelectedTrainer(item.uuid)
            }
          />
        )}
        ListEmptyComponent={TrainerListEmptyComponent}
      />

      {/* Controls per continuar o mostrar errors */}
      <View className="p-4 gap-4">
        {navigationDisabled && <Text>Please select a trainer.</Text>}
        {queryError && <HelperText type="error">{queryError}</HelperText>}
        <Button
          className="w-full"
          icon={({ color }) => <NavigateNextIcon color={color} />}
          disabled={navigationDisabled}
          mode="contained"
          onPress={handleSubmit}
        >
          Next
        </Button>
      </View>
      {/* Diàleg de confirmació de sol·licitud */}
      <Portal>
        <Dialog visible={dialogVisible}>
          <Dialog.Title>Trainer requested</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              You have successfully requested a trainer's services! Now, the
              trainer must review your request and accept it or deny it. You can
              cancel it anytime in the settings page.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={navigateHome}>Ok</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

/**
 * Component que es mostra quan no hi ha entrenadors disponibles.
 * @returns {JSX.Element} El component de llista buida.
 */
const TrainerListEmptyComponent = () => {
  const theme = useTheme();

  return (
    <View className="flex-1 items-center gap-4 pt-16">
      <PeopleIcon size={130} color={theme.colors.onSurface} />
      <Text variant="headlineLarge">No trainers found...</Text>
      <Text variant="bodyMedium" className="px-4">
        Could not find any trainers that adjust to your interests. Modify your
        interests and try again.
      </Text>
    </View>
  );
};
