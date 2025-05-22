import { Paint, useFont } from "@shopify/react-native-skia";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, RefreshControl, View } from "react-native";
import {
  Avatar,
  Button,
  Chip,
  IconButton,
  Text,
  useTheme,
} from "react-native-paper";
import { Bar, CartesianChart } from "victory-native";
import { useShallow } from "zustand/react/shallow";
import roboto from "../../../assets/fonts/Roboto-Regular.ttf";
import { useAuthStore } from "../../../store/auth-store";
import { useWorkoutStore } from "../../../store/workout-store";
import { AddIcon, DumbellIcon, SettingsIcon } from "../../Icons";
import HomeTabsScreen from "../../ui/screen/HomeTabsScreen";
import WorkoutCard from "../../ui/WorkoutCard";

/**
 * Component principal de la pàgina d'inici.
 * Mostra la informació del perfil, un gràfic d'entrenaments per setmana i l'historial d'entrenaments.
 * @returns {JSX.Element} El component de la pàgina d'inici.
 */
export default function HomePage() {
  const queryClient = useQueryClient(); // Client per interactuar amb les consultes de React Query
  const [refreshing, setRefreshing] = useState<boolean>(false); // Estat per controlar l'indicador de refresc

  /**
   * Gestiona l'acció de refrescar la pàgina.
   * Invalida les consultes rellevants per tornar a carregar les dades.
   */
  const refreshControlHandler = () => {
    setRefreshing(true);
    // Invalida les consultes de perfil, entrenaments i estadístiques de l'usuari
    queryClient.invalidateQueries({ queryKey: ["user", "/auth/profile"] });
    queryClient.invalidateQueries({ queryKey: ["user", "/user/workouts"] });
    queryClient.invalidateQueries({ queryKey: ["user", "/user/stats"] });

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
      <ProfilePictureHeader />

      <WorkoutsChart />

      <Text variant="titleMedium">History</Text>

      <WorkoutsList />
    </HomeTabsScreen>
  );
}

/**
 * Component que mostra la capçalera amb la imatge de perfil i el nom d'usuari.
 * @returns {JSX.Element} El component de la capçalera del perfil.
 */
const ProfilePictureHeader = () => {
  const theme = useTheme();

  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  // Consulta per obtenir les dades del perfil de l'usuari
  const { data, isLoading, error } = useQuery({
    queryKey: ["user", "/auth/profile"],
    queryFn: async () =>
      await apiClient.get("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      }),
  });

  return (
    <View className="flex-1 flex-col min-h-20">
      {/* Mostra un indicador de càrrega mentre s'obtenen les dades */}
      {isLoading && (
        <View className="flex-1">
          <ActivityIndicator size="large" />
        </View>
      )}
      {/* Mostra les dades del perfil si la càrrega ha finalitzat amb èxit */}
      {data && (
        <View className="flex-1 flex-row items-center gap-4">
          <Avatar.Text
            size={52}
            label={data ? data?.full_name.charAt(0).toUpperCase() : ""} // Inicial del nom complet
          />
          <View className="flex-1 gap-1">
            <Text variant="titleMedium">{data?.full_name}</Text>
            <Text
              variant="labelMedium"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              {data?.username}
            </Text>
          </View>
          {/* Enllaç a la pàgina de configuració */}
          <Link asChild href="/settings/">
            <IconButton
              icon={(props) => <SettingsIcon {...props} />}
              style={{ margin: 0 }}
            />
          </Link>
        </View>
      )}
      {/* Mostra un missatge d'error si la càrrega falla */}
      {error && (
        <View className="flex-1 p-2">
          <Text>Failed to load user data.</Text>
        </View>
      )}
    </View>
  );
};

/**
 * Calcula el primer dia de la setmana per a un nombre determinat de setmanes enrere.
 * @param {number} delta - El desplaçament de la setmana actual (0 per la setmana actual, 1 per la setmana anterior, etc.).
 * @param {number} amount - El nombre total de setmanes que es consideren per al càlcul del desplaçament.
 * @returns {Date} Un objecte Date que representa el primer dia (dilluns) de la setmana calculada.
 */
function getFirstDaysOfWeek(delta: number, amount: number): Date {
  const today = new Date(); // Data actual

  // Calcula el primer dia (dilluns) d'aquesta setmana
  const dayOfWeek = today.getDay() === 0 ? 6 : today.getDay() - 1; // Diumenge (0) es converteix a 6, la resta es resten 1
  const firstDayOfThisWeek = new Date(today);
  firstDayOfThisWeek.setDate(today.getDate() - dayOfWeek);
  firstDayOfThisWeek.setHours(0, 0, 0, 0); // Normalitza a l'inici del dia

  // Calcula el primer dia de la setmana desitjada restant 'delta' setmanes des de 'amount' setmanes enrere
  const d = new Date(firstDayOfThisWeek);
  d.setDate(firstDayOfThisWeek.getDate() - (amount - 1 - delta) * 7); // Resta el nombre correcte de setmanes

  return d;
}

/**
 * Component que mostra un gràfic del nombre d'entrenaments per setmana.
 * @returns {JSX.Element} El component del gràfic d'entrenaments.
 */
const WorkoutsChart = () => {
  const theme = useTheme();
  const font = useFont(roboto, 12);
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  // Consulta per obtenir les estadístiques d'entrenaments de l'usuari
  const { data, isSuccess } = useQuery({
    queryKey: ["user", "/user/stats"], // Clau única per a la consulta
    queryFn: async () =>
      await apiClient.get("/user/stats", {
        // Petició GET al backend
        headers: { Authorization: `Bearer ${token}` }, // Capçalera d'autorització
      }),
  });

  // Memoritza i transforma les dades per al gràfic
  const chartData = useMemo(
    () =>
      // Si hi ha dades, mapeja els entrenaments per setmana a l'estructura necessària per al gràfic
      data?.workouts_per_week
        ?.toReversed() // Inverteix l'array per mostrar les setmanes més recents primer
        .map((item: number, index: number) => ({
          weekDelta: index, // Índex de la setmana (0 = més recent)
          workouts: item, // Nombre d'entrenaments
        })) ||
      // Si no hi ha dades, crea un array de valors per defecte (8 setmanes amb 0 entrenaments)
      Array.from({ length: 8 }, (_, i) => ({
        weekDelta: i,
        workouts: 0,
      })),
    [data], // Es recalcula quan canvien les dades de la consulta
  );

  // Memoritza els valors per a les etiquetes de l'eix X del gràfic
  const xTickValues = useMemo(
    () => chartData.map((dataPoint) => dataPoint.weekDelta),
    [chartData], // Es recalcula quan canvien les dades del gràfic
  );

  // Troba el valor màxim d'entrenaments per ajustar el domini Y del gràfic
  const maxYValue = Math.max(
    1, // Assegura que el domini Y sigui almenys 1 per evitar problemes amb 0
    ...chartData.map((dataPoint) => dataPoint.workouts),
  );

  return (
    <>
      <Text variant="titleMedium">Workouts per Week</Text>

      <View style={{ height: 150 }}>
        {font && ( // Renderitza el gràfic només si la font s'ha carregat
          <CartesianChart
            data={chartData} // Dades del gràfic
            xKey={"weekDelta"} // Clau per a l'eix X
            yKeys={["workouts"]} // Claus per a l'eix Y
            domainPadding={{ left: 20, right: 20, top: 10 }} // Encoixinat del domini
            domain={{
              y: [0, maxYValue], // Domini de l'eix Y (de 0 al màxim d'entrenaments)
            }}
            axisOptions={{
              font: font, // Font per a les etiquetes dels eixos
              tickValues: xTickValues, // Valors per a les marques de l'eix X
              formatXLabel: (value) => {
                // Funció per formatar les etiquetes de l'eix X (mostra dia/mes)
                const date = getFirstDaysOfWeek(value, chartData.length);
                const day = date.getDate().toString().padStart(2, "0");
                const month = (date.getMonth() + 1).toString().padStart(2, "0");
                return `${day}/${month}`;
              },
              formatYLabel: (label) =>
                // Funció per formatar les etiquetes de l'eix Y (només enters)
                Number.isInteger(label) && isSuccess && label <= maxYValue
                  ? label.toString()
                  : "",
              labelColor: theme.colors.onSurface, // Color de les etiquetes
              lineColor: theme.colors.onSurfaceDisabled, // Color de les línies dels eixos
              labelOffset: { x: 0, y: 0 },
              tickCount: Math.min(chartData.length, 8), // Nombre màxim de marques a l'eix X
            }}
          >
            {/* Funció per renderitzar les barres del gràfic */}
            {({ points, chartBounds }) => (
              <Bar
                chartBounds={chartBounds}
                points={points.workouts} // Punts per a les barres d'entrenaments
              >
                <Paint color={theme.colors.secondary} />
              </Bar>
            )}
          </CartesianChart>
        )}
      </View>

      <View className="flex-row gap-2">
        {/* Mostra estadístiques resumides si la càrrega ha estat exitosa */}
        {isSuccess ? (
          <>
            <Chip>{data.workouts} workouts</Chip>
            <Chip>{data.workouts_last_week} this week</Chip>
          </>
        ) : (
          // Mostra un indicador de càrrega si les dades encara no estan disponibles
          <View className="flex-1 justify-center">
            <ActivityIndicator size={"small"} />
          </View>
        )}
      </View>
    </>
  );
};

/**
 * Component que mostra una llista de l'historial d'entrenaments de l'usuari.
 * @returns {JSX.Element} El component de la llista d'entrenaments.
 */
const WorkoutsList = () => {
  const theme = useTheme();
  const router = useRouter();
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  // Consulta per obtenir la llista d'entrenaments de l'usuari
  const { data, isLoading, isSuccess, error } = useQuery({
    queryKey: ["user", "/user/workouts"], // Clau única per a la consulta
    queryFn: async () =>
      await apiClient.get("/user/workouts", {
        headers: { Authorization: `Bearer ${token}` },
        queries: { limit: 15 },
      }),
  });

  return (
    <>
      {/* Mostra un indicador de càrrega mentre s'obtenen les dades */}
      {isLoading && (
        <View>
          <ActivityIndicator size={"large"} />
        </View>
      )}
      {/* Mostra un missatge d'error si la càrrega falla */}
      {error && (
        <View>
          <Text>{error.message}</Text>
        </View>
      )}
      {/* Si la càrrega és exitosa, processa i mostra les dades */}
      {isSuccess &&
        (data.length > 0 ? ( // Comprova si hi ha entrenaments per mostrar
          <View className="gap-4 mb-4">
            {/* Mapeja les dades rebudes a l'estructura del component WorkoutCard */}
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
              .map((workout) => (
                <WorkoutCard
                  key={workout.uuid}
                  workout={workout}
                  onPress={() =>
                    // Navega a la vista detallada de l'entrenament en prémer
                    router.push(`/workout/workout-view/${workout.uuid}`)
                  }
                />
              ))}

            {/* Mostra un botó "View all" si hi ha més de 5 entrenaments (lògica de paginació implícita) */}
            {data.length >= 5 && ( // Compara amb el límit de la consulta
              <Link href="/workout/history-list" asChild>
                <Button mode="text">View all</Button>
              </Link>
            )}
          </View>
        ) : (
          // Mostra un missatge si no es troben entrenaments
          <View className="flex-col items-center gap-2">
            <DumbellIcon size={90} color={theme.colors.onSurface} />
            <Text variant="headlineMedium">No workouts found.</Text>
            <StartWorkoutButton />
          </View>
        ))}
    </>
  );
};

/**
 * Component de botó per iniciar un nou entrenament buit.
 * @returns {JSX.Element} El component del botó.
 */
const StartWorkoutButton = () => {
  const router = useRouter();
  const { startEmptyWorkout, isOngoingWorkout } = useWorkoutStore(
    useShallow((state) => ({
      startEmptyWorkout: state.startEmptyWorkout,
      isOngoingWorkout: state.isOngoingWorkout,
    })),
  );

  /** Gestiona l'inici d'un nou entrenament. */
  const workoutStartHandler = () => {
    startEmptyWorkout();
    router.push("/workout/ongoing/");
  };

  return (
    <Button
      icon={(props) => <AddIcon {...props} />} // Icona del botó
      mode="outlined"
      disabled={isOngoingWorkout} // Deshabilita el botó si ja hi ha un entrenament en curs
      onPress={workoutStartHandler} // Acció en prémer el botó
    >
      Start an empty workout
    </Button>
  );
};

