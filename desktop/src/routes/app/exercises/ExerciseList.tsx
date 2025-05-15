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

export default function ExerciseListPage() {
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );
  const userExercisesQuery = useQuery({
    queryKey: ["user", "/user/exercises"],
    queryFn: async () =>
      await apiClient.get("/user/exercises", {
        headers: { Authorization: `Bearer ${token}` },
      }),
  });
  const defaultExercisesQuery = useQuery({
    queryKey: ["user", "/default-exercises"],
    queryFn: async () =>
      await apiClient.get("/default-exercises", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    staleTime: 2 * 60 * 60 * 1000, // 2 hores
  });

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
    return [...userExercises, ...defaultExercises].sort((a, b) =>
      a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
    );
  }, [
    defaultExercisesQuery.data,
    defaultExercisesQuery.isSuccess,
    userExercisesQuery.data,
    userExercisesQuery.isSuccess,
  ]);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showSearchBox, setShowSearchBox] = useState<boolean>(false);

  return (
    <Container>
      {(userExercisesQuery.isLoading || defaultExercisesQuery.isLoading) && (
        <Box className="flex items-center justify-center">
          <CircularProgress />
        </Box>
      )}
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
      {!!sortedExercises &&
        (sortedExercises.length > 0 ? (
          <>
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
