import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { Button, Chip, HelperText, Text } from "react-native-paper";
import { useShallow } from "zustand/react/shallow";
import {
  AddIcon,
  CheckIcon,
  NavigateNextIcon,
} from "../../../components/Icons";
import Header from "../../../components/ui/Header";
import { ThemedView } from "../../../components/ui/screen/Screen";
import { useAuthStore } from "../../../store/auth-store";
import { handleError } from "../../../lib/errorHandler";

/**
 * Pàgina per revisar i seleccionar interessos durant l'onboarding d'entrenador.
 * Permet a l'usuari seleccionar interessos que s'utilitzaran per trobar un entrenador adequat.
 * @returns {JSX.Element} El component de la pàgina de selecció d'interessos.
 */
export default function TrainerOnboardingLikesPage() {
  const router = useRouter();
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  // Consulta la llista d'interessos disponibles per a l'usuari
  const { data, isSuccess } = useQuery({
    queryKey: ["user", "/user/trainer/interests"],
    queryFn: async () =>
      await apiClient.get("/user/trainer/interests", {
        headers: { Authorization: `Bearer ${token}` },
      }),
  });

  // Estat per controlar els interessos seleccionats
  const [likes, setLikes] = useState<string[]>([]);
  const navigationDisabled = likes.length < 1;

  // Afegeix un interès a la llista de seleccionats
  const addLike = (newItem: string) => {
    setLikes((state) => [...state, newItem]);
  };

  // Elimina un interès de la llista de seleccionats
  const removeLike = (newItem: string) => {
    setLikes((state) => state.filter((item) => item !== newItem));
  };

  /**
   * Quan es carreguen les dades, inicialitza els interessos seleccionats
   * segons els que ja estiguin marcats com a seleccionats a l'API.
   */
  useEffect(() => {
    if (data) {
      setLikes(data.filter((item) => item.selected).map((item) => item.uuid));
    }
  }, [data]);

  // Handler per alternar la selecció d'un interès
  const checkClickHandler = (newItem: string) => {
    if (likes.includes(newItem)) {
      removeLike(newItem);
    } else {
      addLike(newItem);
    }
  };

  // Estat per controlar la càrrega i errors de la petició
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [queryError, setQueryError] = useState<string | null>(null);

  /**
   * Handler per desar els interessos seleccionats a l'API.
   * Navega a la següent pantalla de l'onboarding si té èxit.
   */
  const handleSubmit = async () => {
    setIsLoading(true);
    setQueryError(null);
    try {
      await apiClient.post("/user/trainer/interests", likes, {
        headers: { Authorization: `Bearer ${token}` },
      });

      router.push("/trainer/onboarding/list");
    } catch (error: unknown) {
      setQueryError(handleError(error));
    }
    setIsLoading(false);
  };

  return (
    <ThemedView className="h-full">
      <Header title="Review your interests" />

      {/* Llista d'interessos en format Chip, amb indicador de càrrega si cal */}
      <ScrollView>
        <View className="flex-row flex-wrap p-4 gap-4">
          {isSuccess ? (
            data.map((item) => (
              <Chip
                key={item.uuid}
                icon={({ color }) =>
                  likes.includes(item.uuid) ? (
                    <CheckIcon color={color} />
                  ) : (
                    <AddIcon color={color} />
                  )
                }
                selected={likes.includes(item.uuid)}
                showSelectedOverlay={true}
                onPress={() => checkClickHandler(item.uuid)}
              >
                {item.name}
              </Chip>
            ))
          ) : (
            <View className="flex-1 justify-center">
              <ActivityIndicator size={"large"} />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Controls per continuar, missatges d'error i informació */}
      <View className="p-4 gap-4">
        {queryError && <HelperText type="error">{queryError}</HelperText>}
        {navigationDisabled && (
          <Text>Please select at least one interest.</Text>
        )}
        <Text>
          Your interests will be used to help us search for your trainer.
        </Text>
        <Button
          className="w-full"
          icon={({ color }) => <NavigateNextIcon color={color} />}
          disabled={navigationDisabled || isLoading}
          mode="contained"
          onPress={handleSubmit}
        >
          Next
        </Button>
      </View>
    </ThemedView>
  );
}
