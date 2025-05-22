import AddIcon from "@mui/icons-material/Add";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router";
import { useShallow } from "zustand/react/shallow";
import SearchField from "../../../components/SearchField";
import WorkoutCard from "../../../components/WorkoutCard";
import { useAuthStore } from "../../../store/auth-store";

/**
 * Pàgina de llistat de plantilles d'entrenament de l'usuari.
 * Permet buscar, crear i accedir a les plantilles existents.
 * Mostra un loader mentre es carrega, errors si n'hi ha, i un missatge si no hi ha plantilles.
 * @returns {JSX.Element} El component de la pàgina de llistat de plantilles.
 */
export default function TemplatesPage() {
  // Obté l'apiClient i el token d'autenticació de l'store d'usuari
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  // Consulta la llista de plantilles de l'usuari
  const { data, isLoading, isSuccess, error } = useQuery({
    queryKey: ["user", "/user/templates"],
    queryFn: async () =>
      await apiClient.get("/user/templates", {
        headers: { Authorization: `Bearer ${token}` },
      }),
  });

  // Estat per controlar la cerca i la visibilitat del quadre de cerca
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showSearchBox, setShowSearchBox] = useState<boolean>(false);

  return (
    <Container>
      <Box className="flex flex-1 flex-col gap-4 mb-2">
        {/* Loader mentre es carrega la llista */}
        {isLoading && (
          <Box className="flex items-center justify-center">
            <CircularProgress />
          </Box>
        )}

        {/* Missatge d'error si la consulta falla */}
        {error && <Typography color="error">{error.message}</Typography>}

        {/* Llista de plantilles si la consulta té èxit */}
        {isSuccess &&
          !!data &&
          (data.length > 0 ? (
            <>
              {/* Capçalera amb botons de cerca i creació */}
              <Box className="flex flex-row gap-4">
                <Typography variant="h6" className="flex-grow">
                  My Templates
                </Typography>
                <Button
                  variant={showSearchBox ? "filled" : "outlined"}
                  startIcon={<SearchIcon />}
                  onClick={() => setShowSearchBox((value) => !value)}
                >
                  Search
                </Button>
                <Link to="/app/templates/new">
                  <Button variant="outlined" startIcon={<AddIcon />}>
                    Create template
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
                  placeholder="Search templates"
                />
              )}

              {/* Llista de plantilles filtrada per la cerca */}
              {data
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
                .filter(
                  (workout) =>
                    !showSearchBox ||
                    !searchTerm ||
                    workout.title
                      .trim()
                      .toLowerCase()
                      .indexOf(searchTerm.trim().toLowerCase()) !== -1,
                )
                .map((workout) => (
                  <Link
                    key={workout.uuid}
                    to={`/app/templates/${workout.uuid}`}
                  >
                    <WorkoutCard workout={workout} showTimestamp={false} />
                  </Link>
                ))}
            </>
          ) : (
            // Missatge si no hi ha plantilles
            <Box className="flex flex-col items-center gap-2">
              <FitnessCenterIcon sx={{ width: 180, height: 180 }} />
              <Typography variant="h4">No templates found...</Typography>
              <Link to="/app/templates/new">
                <Button variant="outlined" startIcon={<AddIcon />}>
                  Create template
                </Button>
              </Link>
            </Box>
          ))}
      </Box>
    </Container>
  );
}
