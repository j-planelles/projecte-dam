import { useQuery } from "@tanstack/react-query";
import { Link, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import {
  Appbar,
  Button,
  List,
  Searchbar,
  Text,
  useTheme,
} from "react-native-paper";
import { useShallow } from "zustand/react/shallow";
import { AddIcon, DumbellIcon } from "../../components/Icons";
import Header from "../../components/ui/Header";
import { ThemedView } from "../../components/ui/screen/Screen";
import { useAuthStore } from "../../store/auth-store";

/**
 * Component de pàgina que mostra una llista d'exercicis disponibles,
 * tant els creats per l'usuari com els exercicis per defecte.
 * Permet cercar exercicis i navegar per crear-ne de nous o editar-ne d'existents.
 * @returns {JSX.Element} El component de la pàgina de llista d'exercicis.
 */
export default function ExerciseListPage() {
  const router = useRouter();
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  // Consulta per obtenir els exercicis creats per l'usuari
  const userExercisesQuery = useQuery({
    queryKey: ["user", "/user/exercises"],
    queryFn: async () =>
      await apiClient.get("/user/exercises", {
        headers: { Authorization: `Bearer ${token}` }, // Capçalera d'autorització
      }),
  });

  // Consulta per obtenir els exercicis per defecte del sistema
  const defaultExercisesQuery = useQuery({
    queryKey: ["user", "/default-exercises"],
    queryFn: async () =>
      await apiClient.get("/default-exercises", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    staleTime: 2 * 60 * 60 * 1000, // Temps de validesa de les dades en cache: 2 hores
  });

  // Memoritza i combina els exercicis de l'usuari i els per defecte, ordenats alfabèticament
  const sortedExercises = useMemo(() => {
    const defaultExercisesFilter: string[] = []; // Array per filtrar exercicis per defecte que l'usuari ja ha copiat/modificat

    // Processa els exercicis de l'usuari
    const userExercises: exerciseList[] =
      userExercisesQuery.isSuccess && Array.isArray(userExercisesQuery.data)
        ? userExercisesQuery.data.map((item) => {
          if (item.default_exercise_uuid) {
            defaultExercisesFilter.push(item.default_exercise_uuid);
          }

          return {
            uuid: item.uuid,
            name: item.name,
            description: item.description,
            type: item.type,
            bodyPart: item.body_part,
            isDefault: false,
            default_exercise_uuid: item.default_exercise_uuid,
          } as exerciseList;
        })
        : [];

    // Processa els exercicis per defecte
    const defaultExercises: exerciseList[] =
      defaultExercisesQuery.isSuccess &&
        Array.isArray(defaultExercisesQuery.data)
        ? defaultExercisesQuery.data
          .map(
            (item) =>
              ({
                uuid: item.uuid,
                name: item.name,
                description: item.description,
                type: item.type,
                bodyPart: item.body_part,
                isDefault: true, // Marca com a exercici per defecte
              }) as exerciseList,
          )
          // Filtra els exercicis per defecte que ja existeixen com a exercicis d'usuari (basat en default_exercise_uuid)
          .filter((item) => defaultExercisesFilter.indexOf(item.uuid) === -1)
        : [];

    // Combina els dos arrays i els ordena alfabèticament pel nom
    return [...userExercises, ...defaultExercises].sort((a, b) =>
      a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
    );
  }, [
    defaultExercisesQuery.data,
    defaultExercisesQuery.isSuccess,
    userExercisesQuery.data,
    userExercisesQuery.isSuccess,
  ]);

  // Indica si alguna de les consultes d'exercicis està carregant
  const disableControls =
    userExercisesQuery.isLoading || defaultExercisesQuery.isLoading;

  // Estat per al terme de cerca introduït per l'usuari
  const [searchTerm, setSearchTerm] = useState<string>("");

  return (
    <ThemedView className="flex-1">
      <Header title="Manage Exercises">
        {/* Botó per afegir un nou exercici */}
        <Appbar.Action
          animated={false}
          icon={({ color }) => <AddIcon color={color} />}
          onPress={() => {
            router.push("/workout/exercise-edit/");
          }}
        />
      </Header>
      {disableControls ? ( // Si les dades s'estan carregant, mostra un indicador
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : (
        // Si les dades s'han carregat, mostra la barra de cerca i la llista d'exercicis
        <>
          <View className="px-4 py-2">
            <Searchbar
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder="Search exercises..."
            />
          </View>
          <FlatList
            data={
              // Filtra els exercicis basant-se en el terme de cerca
              sortedExercises.filter(
                (exercise) =>
                  !searchTerm || // Si no hi ha terme de cerca, mostra tots
                  exercise.name // Comprova si el nom de l'exercici conté el terme
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()),
              )
            }
            keyExtractor={(item) =>
              `${item.isDefault ? "default" : "user"}-${item.uuid}`
            }
            renderItem={({ item }) => (
              <Link
                asChild
                href={
                  // Construeix l'URL per a l'edició, distingint entre exercicis per defecte i d'usuari
                  `/workout/exercise-edit/${item.isDefault
                    ? `?defaultExerciseUUID=${item.uuid}` // Si és per defecte, passa l'UUID com a paràmetre de consulta
                    : item.uuid // Si és d'usuari, passa l'UUID directament
                  }`
                }
              >
                <List.Item title={item.name} />
              </Link>
            )}
            ListEmptyComponent={<ExerciseListEmptyComponent />}
          />
        </>
      )}
    </ThemedView>
  );
}

/**
 * Component que es mostra quan la llista d'exercicis és buida.
 * Ofereix un missatge i un botó per crear un nou exercici.
 * @returns {JSX.Element} El component per a la llista buida.
 */
const ExerciseListEmptyComponent = () => {
  const theme = useTheme();

  return (
    <View className="flex-1 items-center gap-8 pt-16">
      <DumbellIcon size={96} color={theme.colors.onSurface} />
      <Text variant="headlineLarge">No exercises...</Text>
      {/* Enllaç per crear un nou exercici */}
      <Link asChild href="/workout/exercise-edit">
        <Button mode="contained">Create an exercise</Button>
      </Link>
    </View>
  );
};