import AddIcon from "@mui/icons-material/Add";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import { useShallow } from "zustand/react/shallow";
import SearchField from "../../../components/SearchField";
import { useAuthStore } from "../../../store/auth-store";

/**
 * Pàgina de llistat d'exercicis de l'usuari.
 * Mostra exercicis propis i per defecte, permet buscar, crear i editar exercicis.
 * Mostra un loader mentre es carrega, errors si n'hi ha, i un missatge si no hi ha exercicis.
 * @returns {JSX.Element} El component de la pàgina de llistat d'exercicis.
 */
export default function ExerciseListPage() {
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

  // Estat per controlar la cerca i la visibilitat del quadre de cerca
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showSearchBox, setShowSearchBox] = useState<boolean>(false);

  return (
    <Container>
      {/* Loader mentre es carrega la llista */}
      {(userExercisesQuery.isLoading || defaultExercisesQuery.isLoading) && (
        <Box className="flex items-center justify-center">
          <CircularProgress />
        </Box>
      )}

      {/* Missatge d'error si la consulta falla */}
      {userExercisesQuery.error && (
        <Typography color="error">
          {userExercisesQuery.error.message}
        </Typography>
      )}
      {defaultExercisesQuery.error && (
        <Typography color="error">
          {defaultExercisesQuery.error.message}
        </Typography>
      )}

      {/* Llista d'exercicis si n'hi ha */}
      {!!sortedExercises &&
        (sortedExercises.length > 0 ? (
          <>
            {/* Capçalera amb botons de cerca i creació */}
            <Box className="flex flex-row gap-4 mb-2">
              <Typography variant="h6" className="flex-grow">
                My Exercises
              </Typography>
              <Button
                variant={showSearchBox ? "filled" : "outlined"}
                startIcon={<SearchIcon />}
                onClick={() => setShowSearchBox((value) => !value)}
              >
                Search
              </Button>
              <Link to="/app/exercises/new">
                <Button variant="outlined" startIcon={<AddIcon />}>
                  Create exercise
                </Button>
              </Link>
            </Box>
            {/* Quadre de cerca */}
            {showSearchBox && (
              <SearchField
                value={searchTerm}
                onValueChange={(event) => {
                  setSearchTerm(event.target.value);
                }}
                placeholder="Search exercises"
                className="mb-2"
              />
            )}
            {/* Llista d'exercicis filtrada per la cerca */}
            {sortedExercises
              .filter(
                (exercise) =>
                  !showSearchBox ||
                  !searchTerm ||
                  exercise.name
                    .trim()
                    .toLowerCase()
                    .indexOf(searchTerm.trim().toLowerCase()) !== -1,
              )
              .map((exercise) => (
                <Link
                  key={exercise.uuid}
                  to={
                    exercise.isDefault
                      ? `/app/exercises/new?defaultExerciseUuid=${exercise.uuid}`
                      : `/app/exercises/${exercise.uuid}`
                  }
                >
                  <ListItemButton>
                    <ListItemText
                      primary={exercise.name}
                      secondary={exercise.description}
                    />
                  </ListItemButton>
                </Link>
              ))}
          </>
        ) : (
          // Missatge si no hi ha exercicis
          <Box className="flex flex-col items-center gap-2">
            <FitnessCenterIcon sx={{ width: 180, height: 180 }} />
            <Typography variant="h4">No exercises found...</Typography>
            <Link to="/app/exercises/new">
              <Button variant="outlined" startIcon={<AddIcon />}>
                Create exercise
              </Button>
            </Link>
          </Box>
        ))}
    </Container>
  );
}
