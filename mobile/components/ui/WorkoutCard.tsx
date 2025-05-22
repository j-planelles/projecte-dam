import { View } from "react-native";
import { Card, Text } from "react-native-paper";

/**
 * @typedef WorkoutCardProps
 * @description Propietats per al component WorkoutCard.
 * @property {workout} [workout] - L'objecte de l'entrenament a mostrar. Si no es proporciona, es mostra contingut de marcador de posició.
 * @property {() => any} [onPress] - Funció que es crida quan es prem la targeta.
 * @property {string} [className] - Classes CSS addicionals per aplicar a l'element Card (útil amb NativeWind/Tailwind).
 * @property {boolean} [showDescription=false] - Si és `true`, mostra la descripció de l'entrenament. Per defecte és `false`.
 * @property {boolean} [showTimestamp=true] - Si és `true`, mostra la data i hora de l'entrenament. Per defecte és `true`.
 */
interface WorkoutCardProps {
  workout?: workout;
  onPress?: () => any;
  className?: string;
  showDescription?: boolean;
  showTimestamp?: boolean;
}

/**
 * @component WorkoutCard
 * @description Un component de targeta per mostrar un resum d'un entrenament.
 * Mostra el títol, la data/hora, la durada, i una llista d'exercicis.
 * Si no es proporciona un objecte `workout`, mostra dades de marcador de posició.
 *
 * @param {WorkoutCardProps} props - Les propietats del component.
 * @returns {JSX.Element} El component WorkoutCard renderitzat.
 */
export default function WorkoutCard({
  workout,
  onPress,
  className,
  showDescription = false,
  showTimestamp = true,
}: WorkoutCardProps): JSX.Element {
  // Determina el títol a mostrar: el de l'entrenament o un títol per defecte.
  const title: string =
    workout === undefined ? "Afternoon Workout" : workout.title;

  // Determina el text del timestamp: el de l'entrenament parsejat o un text per defecte.
  const timestampText: string =
    workout === undefined
      ? "Thursday 24th 2025, 5:30 PM"
      : parseTimestamp(workout.timestamp, workout.duration);

  // Determina la descripció a mostrar: la de l'entrenament o una per defecte.
  const description: string =
    workout === undefined ? "Sample workout" : workout.description;

  // Determina la llista d'exercicis a mostrar: els de l'entrenament o una llista per defecte.
  const exercises: string[] =
    workout === undefined
      ? [
          "3x Lat pulldown",
          "4x Bench press",
          "4x Arnold curl",
          "4 exercises more...",
        ]
      : parseExercises(workout.exercises);

  return (
    <Card
      className={`${className}`} // Aplica classes CSS externes si n'hi ha
      mode="outlined" // Estil de la targeta
      onPress={onPress} // Funció a executar en prémer la targeta
    >
      <Card.Content className="gap-2">
        {/* Secció del títol */}
        <View>
          <Text variant="titleMedium">{title}</Text>
        </View>

        {/* Mostra el timestamp si showTimestamp és true */}
        {showTimestamp && <Text>{timestampText}</Text>}

        {/* Mostra la descripció si showDescription és true i la descripció existeix */}
        {showDescription && description && <Text>{description}</Text>}

        {/* Secció de la llista d'exercicis */}
        <View>
          {exercises.map((exercise, index) => (
            <Text key={index}>{exercise}</Text> // Renderitza cada exercici en una línia de text
          ))}
        </View>
      </Card.Content>
    </Card>
  );
}

/**
 * @function parseTimestamp
 * @description Formata un timestamp i una durada en una cadena llegible per l'usuari.
 * @internal Aquesta funció és per a ús intern dins del mòdul WorkoutCard.
 * @param {number} timestamp - El timestamp de l'inici de l'entrenament en mil·lisegons.
 * @param {number} duration - La durada de l'entrenament en segons.
 * @returns {string} Una cadena formatada que representa la data, hora i durada de l'entrenament.
 *                   Exemple: "20/5/2025, 10:20:52 AM durant 60:00"
 */
const parseTimestamp = (timestamp: number, duration: number): string => {
  const timestampDate = new Date(timestamp); // Converteix el timestamp a objecte Date

  // Calcula els minuts i segons de la durada
  const durationSeconds = Math.trunc(duration % 60);
  const durationMinutes = Math.trunc(duration / 60);
  // Formata la durada com MM:SS
  const durationText = `${durationMinutes}:${String(durationSeconds).padStart(
    2,
    "0",
  )}`;

  // Retorna la data localitzada i la durada formatada
  return `${timestampDate.toLocaleString()} for ${durationText}`;
};

/**
 * @function parseExercises
 * @description Converteix una llista d'objectes d'exercici en una llista de cadenes de text per a visualització.
 * Si hi ha més de 4 exercicis, mostra els primers 3 i un missatge resum per a la resta.
 * @internal Aquesta funció és per a ús intern dins del mòdul WorkoutCard.
 * @param {workoutExercise[]} exercises - Un array d'objectes d'exercici de l'entrenament.
 * @returns {string[]} Un array de cadenes, on cada cadena representa un resum d'un exercici
 *                     (ex: "3x Press de banca") o un missatge de resum.
 */
const parseExercises = (exercises: workoutExercise[]): string[] => {
  // Si hi ha 4 o menys exercicis, els mapeja tots.
  if (exercises.length <= 4) {
    return exercises.map(
      (value) => `${value.sets.length}x ${value.exercise.name}`,
    );
  // biome-ignore lint/style/noUselessElse: <explanation>
  } else {
    // Si hi ha més de 4 exercicis, mostra els primers 3 i un recompte per a la resta.
    return [
      ...exercises // Pren els primers 3 exercicis
        .slice(0, 3)
        .map((value) => `${value.sets.length}x ${value.exercise.name}`),
      `${exercises.slice(3).length} exercises more...`, // Recompte per a la resta
    ];
  }
};
