import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import {
  Button,
  Chip,
  HelperText,
  List,
  Searchbar,
  Text,
  useTheme,
} from "react-native-paper";
import { v4 as uuidv4 } from "uuid";
import { useShallow } from "zustand/react/shallow";
import { DumbellIcon } from "../../../components/Icons";
import Header from "../../../components/ui/Header";
import { ThemedView } from "../../../components/ui/screen/Screen";
import { handleError } from "../../../lib/errorHandler";
import { useAuthStore } from "../../../store/auth-store";
import { useWorkoutStore } from "../../../store/workout-store";

/**
 * Pàgina per afegir exercicis a un entrenament en curs.
 * Permet seleccionar exercicis propis o per defecte, cercar-los i afegir-los a l'entrenament.
 * @returns {JSX.Element} El component de la pàgina d'afegir exercicis.
 */
export default function OngoingWorkoutAddExercisePage() {
  const theme = useTheme();
  const router = useRouter();

  // Acció per afegir exercicis a l'entrenament des de l'store
  const addExercises = useWorkoutStore((state) => state.addExercises);

  // Obté l'apiClient i el token d'autenticació de l'store d'usuari
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  // Consulta d'exercicis de l'usuari
  const userExercisesQuery = useQuery({
    queryKey: ["user", "/user/exercises"],
    queryFn: async () =>
      await apiClient.get("/user/exercises", {
        headers: { Authorization: `Bearer ${token}` },
      }),
  });

  // Consulta d'exercicis per defecte (amb cache de 2 hores)
  const defaultExercisesQuery = useQuery({
    queryKey: ["user", "/default-exercises"],
    queryFn: async () =>
      await apiClient.get("/default-exercises", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    staleTime: 2 * 60 * 60 * 1000, // 2 hores
  });

  /**
   * Combina i ordena els exercicis de l'usuari i per defecte.
   * Els exercicis per defecte que ja han estat afegits per l'usuari no es mostren dues vegades.
   */
  const sortedExercises = useMemo(() => {
    const defaultExercisesFilter: string[] = [];
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
                  isDefault: true,
                }) as exerciseList,
            )
            .filter((item) => defaultExercisesFilter.indexOf(item.uuid) === -1)
        : [];
    // Ordena alfabèticament pel nom
    return [...userExercises, ...defaultExercises].sort((a, b) =>
      a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
    );
  }, [
    defaultExercisesQuery.data,
    defaultExercisesQuery.isSuccess,
    userExercisesQuery.data,
    userExercisesQuery.isSuccess,
  ]);

  // Estat per controlar la selecció, càrrega, errors i cerca
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Desactiva els controls si hi ha càrrega o les consultes no han acabat
  const disableControls =
    isLoading ||
    userExercisesQuery.isLoading ||
    defaultExercisesQuery.isLoading;

  /**
   * Handler per afegir els exercicis seleccionats a l'entrenament.
   * Si l'exercici és per defecte, primer el crea com a exercici d'usuari.
   * Després afegeix tots els seleccionats a l'store de l'entrenament.
   */
  const addExerciseHandler = async () => {
    setIsLoading(true);
    setGlobalError(null);
    try {
      // Exercicis de l'usuari seleccionats
      const userExercisesToAdd = sortedExercises.filter(
        (item) => selectedExercises.includes(item.uuid) && !item.isDefault,
      );

      // Exercicis per defecte seleccionats
      const defaultExercisesToAdd = sortedExercises.filter(
        (item) => selectedExercises.includes(item.uuid) && item.isDefault,
      );

      // Per cada exercici per defecte, crea una còpia com a exercici d'usuari
      for (const exercise of defaultExercisesToAdd) {
        const exerciseUUID = uuidv4();
        await apiClient.post(
          "/user/exercises",
          {
            uuid: exerciseUUID,
            name: exercise.name,
            description: exercise.description,
            type: exercise.type,
            body_part: exercise.bodyPart,
            default_exercise_uuid: exercise.uuid,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        userExercisesToAdd.push({ ...exercise, uuid: exerciseUUID });
      }

      // Prepara els exercicis per afegir-los a l'entrenament (amb una sèrie per defecte)
      const exercisesToAdd: workoutExercise[] = userExercisesToAdd.map(
        (item) => ({
          exercise: item,
          sets: [{ weight: 0, reps: 0, type: "normal" }],
        }),
      );

      addExercises(exercisesToAdd);

      router.back(); // Torna enrere després d'afegir
    } catch (error: unknown) {
      setGlobalError(handleError(error));
    }
    setIsLoading(false);
  };

  return (
    <ThemedView className="flex-1">
      <Header title="Add exercise" />

      {/* Barra de cerca d'exercicis */}
      <View className="px-4 py-2">
        <Searchbar
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Search exercises..."
        />
      </View>

      {/* Mostra indicador de càrrega o la llista d'exercicis */}
      {disableControls ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={sortedExercises.filter(
            (exercise) =>
              !searchTerm ||
              exercise.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !==
                -1,
          )}
          keyExtractor={(item) =>
            `${item.isDefault ? "default" : "user"}-${item.uuid}`
          }
          renderItem={({ item }) => (
            <List.Item
              title={item.name}
              onPress={() =>
                item.uuid && selectedExercises.includes(item.uuid)
                  ? setSelectedExercises((state) =>
                      state.filter((value) => value !== item.uuid),
                    )
                  : setSelectedExercises((state) =>
                      item.uuid ? [...state, item.uuid] : state,
                    )
              }
              left={(props) =>
                item.uuid &&
                selectedExercises.includes(item.uuid) && (
                  <List.Icon {...props} icon="check" />
                )
              }
              style={{
                backgroundColor:
                  item.uuid && selectedExercises.includes(item.uuid)
                    ? theme.colors.primaryContainer
                    : "transparent",
              }}
            />
          )}
          ListEmptyComponent={<ExerciseListEmptyComponent />}
        />
      )}

      {/* Mostra els exercicis seleccionats i el botó per afegir-los */}
      {selectedExercises.length > 0 && (
        <View className="px-4 py-2 gap-2">
          <View className="flex-row gap-2 flex-wrap">
            {selectedExercises.map((exerciseId) => {
              const exercise = sortedExercises.filter(
                (item) => item.uuid === exerciseId,
              )[0];
              return <Chip key={exerciseId}>{exercise.name}</Chip>;
            })}
          </View>
          {globalError !== null && (
            <HelperText type="error">{globalError}</HelperText>
          )}
          <Button
            mode="contained"
            onPress={addExerciseHandler}
            disabled={disableControls}
          >
            {selectedExercises.length > 1
              ? `Add ${selectedExercises.length} exercises`
              : "Add exercise"}
          </Button>
        </View>
      )}
    </ThemedView>
  );
}

/**
 * Component que es mostra quan no hi ha exercicis disponibles.
 * @returns {JSX.Element} El component de llista buida.
 */
const ExerciseListEmptyComponent = () => {
  const theme = useTheme();

  return (
    <View className="flex-1 items-center gap-8 pt-16">
      <DumbellIcon size={96} color={theme.colors.onSurface} />
      <View className="gap-4 items-center">
        <Text variant="headlineLarge">No exercises found.</Text>
      </View>
    </View>
  );
};
