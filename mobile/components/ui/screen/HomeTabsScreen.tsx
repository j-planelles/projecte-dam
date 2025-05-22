import { Link } from "expo-router";
import { type RefreshControlProps, ScrollView, View } from "react-native";
import { Text, TouchableRipple, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowForwardIcon } from "../../Icons";
import { BasicView } from "./Screen";
import { useWorkoutStore } from "../../../store/workout-store";
import { useTimer } from "../../../lib/hooks/useTimer";
import { useEffect } from "react";

/**
 * @interface HomeTabsScreenProps
 * @description Propietats per al component `HomeTabsScreen`.
 * @property {React.ReactNode} children - El contingut principal que es renderitzarà dins del `ScrollView`.
 * @property {React.ReactElement<RefreshControlProps, string | React.JSXElementConstructor<any>> | undefined} [refreshControl] - Un element `RefreshControl` opcional per a la funcionalitat de "estirar per refrescar".
 */
interface HomeTabsScreenProps {
  children: React.ReactNode;
  refreshControl?: React.ReactElement<
    RefreshControlProps,
    string | React.JSXElementConstructor<any>
  >;
}

/**
 * @component HomeTabsScreen
 * @description Un component que serveix com a contenidor per al contingut de les pestanyes d'inici.
 * Inclou un `ScrollView` per al contingut desplaçable, ajusta l'espaiat superior segons l'àrea segura
 * del dispositiu i mostra un botó d'entrenament en curs si n'hi ha un actiu.
 *
 * @param {HomeTabsScreenProps} props - Les propietats del component.
 * @returns {JSX.Element} El component HomeTabsScreen renderitzat.
 */
export default function HomeTabsScreen({
  children,
  refreshControl,
}: HomeTabsScreenProps): JSX.Element {
  const insets = useSafeAreaInsets();
  // Accedeix a l'estat de l'entrenament per saber si n'hi ha un en curs.
  const ongoingWorkout = useWorkoutStore((state) => state.isOngoingWorkout);

  return (
    <View className="flex-1" style={{ paddingTop: insets.top }}>
      {/* ScrollView per permetre el desplaçament del contingut.
          Accepta un `refreshControl` opcional per a la funcionalitat "estirar per refrescar". */}
      <ScrollView refreshControl={refreshControl}>
        <BasicView>{children}</BasicView>
      </ScrollView>
      {ongoingWorkout && <OngoingWorkoutButton />}
    </View>
  );
}

/**
 * @component OngoingWorkoutButton
 * @description Un botó que es mostra a la part inferior de la pantalla quan hi ha un entrenament en curs.
 * Mostra el temps transcorregut de l'entrenament, el nombre d'exercicis i permet navegar
 * a la pantalla de l'entrenament en curs en ser premut.
 * Aquest component no rep propietats directament, sinó que obté les dades necessàries
 * de l'store de Zustand (`useWorkoutStore`) i del hook `useTimer`.
 *
 * @returns {JSX.Element | null} El component del botó d'entrenament en curs, o `null` si no hi ha cap entrenament en curs (encara que la lògica de visibilitat és al component pare).
 */
const OngoingWorkoutButton = (): JSX.Element => {
  // Hook per accedir al tema actual de React Native Paper (per als colors).
  const theme = useTheme();

  // Obté el nombre d'exercicis de l'entrenament en curs des de l'store.
  const exerciseAmount = useWorkoutStore((state) => state.exercises.length);

  // Obté el timestamp d'inici de l'entrenament en curs des de l'store.
  const startTime = useWorkoutStore((state) => state.timestamp);
  // Hook del cronòmetre per obtenir el temps formatat i la funció per iniciar-lo.
  const { formattedTime, start } = useTimer();

  // Efecte per iniciar el cronòmetre quan el component es munta o quan `startTime` canvia.
  // Això assegura que el cronòmetre comenci a comptar des del moment en què va començar l'entrenament.
  useEffect(() => {
    start(startTime);
  }, [start, startTime]);

  return (
    <Link asChild href="/workout/ongoing/">
      <TouchableRipple
        rippleColor={theme.colors.primary}
        style={{ backgroundColor: theme.colors.primaryContainer }}
      >
        <View className="p-4 flex-row items-center">
          <View className="flex-1">
            <Text
              variant="titleLarge"
              style={{ color: theme.colors.onPrimaryContainer }}
            >
              Ongoing Workout
            </Text>
            <Text
              variant="titleMedium"
              style={{ color: theme.colors.onPrimaryContainer }}
            >
              {formattedTime} - {exerciseAmount} exercises
            </Text>
          </View>

          <ArrowForwardIcon color={theme.colors.onPrimaryContainer} size={32} />
        </View>
      </TouchableRipple>
    </Link>
  );
};