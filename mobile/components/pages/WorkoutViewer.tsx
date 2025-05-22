import { ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import { kgToLbs, kmToMiles } from "../../lib/unitTransformers";

/**
 * @interface WorkoutViewerProps
 * @description Propietats per al component `WorkoutViewer`.
 * @property {workout} workout - L'objecte de l'entrenament a visualitzar.
 * @property {boolean} [timestamp=true] - Si és `true` (per defecte), mostra la informació de data i durada de l'entrenament.
 */
interface WorkoutViewerProps {
  workout: workout; 
  timestamp?: boolean;
}

/**
 * @component WorkoutViewer
 * @description Component principal per mostrar els detalls d'un entrenament.
 * S'encarrega de renderitzar la informació general i la llista d'exercicis amb les seves sèries.
 *
 * @param {WorkoutViewerProps} props - Les propietats del component.
 * @returns {JSX.Element} El component WorkoutViewer renderitzat.
 */
export default function WorkoutViewer({
  workout,
  timestamp = true, 
}: WorkoutViewerProps): JSX.Element {
  return (
    <ScrollView>
      <View className="gap-4">
        <WorkoutInformation workout={workout} timestamp={timestamp} />
        <WorkoutExercises exercises={workout.exercises} />
      </View>
    </ScrollView>
  );
}

/**
 * @interface WorkoutInformationProps
 * @description Propietats per al component `WorkoutInformation`.
 * @property {workout} workout - L'objecte de l'entrenament del qual es mostrarà la informació.
 * @property {boolean} timestamp - Indica si s'ha de mostrar la data i la durada.
 */
interface WorkoutInformationProps {
  workout: workout;
  timestamp: boolean;
}

/**
 * @component WorkoutInformation
 * @description Subcomponent per mostrar la informació general d'un entrenament,
 * com el títol, la descripció, la data i la durada.
 * @param {WorkoutInformationProps} props - Les propietats del component.
 * @returns {JSX.Element} El component WorkoutInformation renderitzat.
 * @internal Aquest component és per a ús intern dins de `WorkoutViewer`.
 */
const WorkoutInformation = ({
  workout,
  timestamp,
}: WorkoutInformationProps): JSX.Element => {
  // Converteix el timestamp de l'entrenament a un objecte Date.
  const timestampDate = new Date(workout.timestamp);
  // Calcula els segons de la durada.
  const durationSeconds = Math.trunc(workout.duration % 60);
  // Calcula els minuts de la durada.
  const durationMinutes = Math.trunc(workout.duration / 60);
  // Formata la durada com MM:SS.
  const durationText = `${durationMinutes}:${String(durationSeconds).padStart(
    2,
    "0",
  )}`;

  return (
    <View className="px-4 gap-2">
      <View>
        <Text variant="titleLarge">{workout.title}</Text>
      </View>

      {workout.description && (
        <Text variant="bodyLarge">{workout.description}</Text>
      )}

      {/* Mostra la data i la durada si la propietat timestamp és true. */}
      {timestamp && (
        <Text>{`${timestampDate.toLocaleString()} for ${durationText}`}</Text>
      )}
    </View>
  );
};

/**
 * @interface WorkoutExercisesProps
 * @description Propietats per al component `WorkoutExercises`.
 * @property {workoutExercise[]} exercises - Un array d'objectes d'exercici de l'entrenament.
 */
interface WorkoutExercisesProps {
  exercises: workoutExercise[];
}

/**
 * @component WorkoutExercises
 * @description Subcomponent per renderitzar la llista d'exercicis d'un entrenament.
 * Itera sobre cada exercici i utilitza `WorkoutExercise` per mostrar-lo.
 * @param {WorkoutExercisesProps} props - Les propietats del component.
 * @returns {JSX.Element} El component WorkoutExercises renderitzat.
 * @internal Aquest component és per a ús intern dins de `WorkoutViewer`.
 */
const WorkoutExercises = ({
  exercises,
}: WorkoutExercisesProps): JSX.Element => {
  return (
    <View className="gap-4">
      {/* Itera sobre l'array d'exercicis i renderitza un component WorkoutExercise per a cadascun. */}
      {exercises.map((exercise, index) => (
        <WorkoutExercise key={`exercise-${index} - ${exercise.exercise.uuid}`} exercise={exercise} />
      ))}
    </View>
  );
};

/**
 * @interface WorkoutExerciseProps
 * @description Propietats per al component `WorkoutExercise`.
 * @property {workoutExercise} exercise - L'objecte d'exercici (amb les seves sèries) a mostrar.
 */
interface WorkoutExerciseProps {
  exercise: workoutExercise;
}

/**
 * @component WorkoutExercise
 * @description Subcomponent per mostrar un exercici individual dins de la llista d'exercicis.
 * Mostra el nom de l'exercici i les seves sèries associades.
 * @param {WorkoutExerciseProps} props - Les propietats del component.
 * @returns {JSX.Element} El component WorkoutExercise renderitzat.
 * @internal Aquest component és per a ús intern dins de `WorkoutExercises`.
 */
const WorkoutExercise = ({
  exercise,
}: WorkoutExerciseProps): JSX.Element => {
  return (
    <View className="gap-2">
      <View className="flex-1 flex-row items-center px-4">
        <Text variant="titleMedium" className="flex-1">
          {exercise.exercise.name}
        </Text>
      </View>

      {exercise.sets.length > 0 ? (
        // Si hi ha sèries, les itera i renderitza un component WorkoutSet per a cadascuna.
        exercise.sets.map((set, index) => (
          <WorkoutSet
            key={`set-${index}-${exercise.exercise.uuid}}`}
            set={set}
            index={index}
            exerciseType={exercise.exercise.type}
            weightUnit={exercise.weightUnit}
          />
        ))
      ) : (
        // Si no hi ha sèries, mostra un missatge indicant-ho.
        <Text
          className="flex-1 px-4"
          style={{ textAlign: "center" }}
          variant="bodySmall"
        >
          Exercise without sets.
        </Text>
      )}
    </View>
  );
};

/**
 * @function formatAsTime
 * @description Formata un valor numèric (que representa segons o una combinació de minuts i segons)
 * en una cadena de temps MM:SS.
 * Per exemple, si `externalValue` és 90 (segons), retorna "1:30".
 * Si `externalValue` és 130 (interpretat com 1 minut i 30 segons si és un format MMDDSS), retorna "1:30".
 * La lògica actual sembla interpretar `externalValue` com un nombre on els dos últims dígits són segons.
 * @param {number} externalValue - El valor numèric a formatar. S'espera que sigui un nombre enter.
 * @returns {string} El valor formatat com una cadena de temps "MM:SS".
 * @internal Aquesta funció és per a ús intern dins de `WorkoutSet`.
 */
const formatAsTime = (externalValue: number): string => {
  // Converteix el valor a cadena i elimina decimals.
  const formattedValue = Math.floor(externalValue).toString();
  // Extreu la part dels minuts (tots els dígits excepte els dos últims).
  const minutesPart =
    formattedValue.length >= 3
      ? formattedValue.substring(0, formattedValue.length - 2)
      : "0"; // Si té menys de 3 dígits, els minuts són 0.
  // Extreu la part dels segons (els dos últims dígits) i afegeix un zero al davant si és necessari.
  const secondsPart = formattedValue
    .substring(formattedValue.length - 2, formattedValue.length)
    .padStart(2, "0");

  return `${minutesPart}:${secondsPart}`;
};

/**
 * @interface WorkoutSetProps
 * @description Propietats per al component `WorkoutSet`.
 * @property {exerciseSet} set - L'objecte de la sèrie a mostrar.
 * @property {number} index - L'índex de la sèrie (basat en 0) dins de la llista de sèries de l'exercici.
 * @property {exercise["type"]} exerciseType - El tipus de l'exercici pare (ex: "barbell", "cardio", "duration").
 * @property {WeightUnit} [weightUnit="metric"] - La unitat de pes a utilitzar per mostrar el pes (per defecte "metric").
 */
interface WorkoutSetProps {
  set: exerciseSet;
  index: number;
  exerciseType: exercise["type"];
  weightUnit?: WeightUnit;
}

/**
 * @component WorkoutSet
 * @description Subcomponent per mostrar una sèrie individual d'un exercici.
 * Mostra el número de sèrie (o tipus), el pes/distància i les repeticions/temps,
 * adaptant la visualització segons el tipus d'exercici i la unitat de pes.
 * @param {WorkoutSetProps} props - Les propietats del component.
 * @returns {JSX.Element} El component WorkoutSet renderitzat.
 * @internal Aquest component és per a ús intern dins de `WorkoutExercise`.
 */
const WorkoutSet = ({
  set,
  index,
  exerciseType,
  weightUnit = "metric", // Unitat de pes per defecte és mètrica.
}: WorkoutSetProps): JSX.Element => {
  return (
    <View className="flex-1 flex-row items-center py-2 px-4">
      {/* Mostra el número de sèrie o un indicador per a tipus especials (Dropset, Fallada). */}
      <Text variant="bodyLarge" className="w-12 px-4">
        {set.type === "normal"
          ? index + 1 
          : set.type === "dropset"
            ? "D" 
            : "F"}
      </Text>

      {/* Condicionalment mostra el pes/distància si l'exercici no és només de durada, compte enrere o repeticions. */}
      {exerciseType !== "duration" &&
        exerciseType !== "countdown" &&
        exerciseType !== "reps-only" && (
          <Text variant="bodyLarge" className="flex-1 px-2">
            {exerciseType === "cardio" // Si l'exercici és de tipus cardio.
              ? weightUnit === "imperial" // Si la unitat de pes és imperial.
                ? `${Number(kmToMiles(set.weight).toFixed(2))} mi` // Converteix km a milles.
                : `${set.weight} km` // Mostra el pes (distància) en km.
              : exerciseType === "assisted-bodyweight" // Si l'exercici és de pes corporal assistit.
                ? "pes assistit" // Text per a pes assistit. `set.weight` podria ser el pes d'assistència.
                : weightUnit === "imperial" // Per a altres tipus d'exercici amb pes, si la unitat és imperial.
                  ? `${Number(kgToLbs(set.weight).toFixed(2))} lbs` // Converteix kg a lliures.
                  : `${set.weight} kg`}
          </Text>
        )}

      {/* Mostra les repeticions o el temps. */}
      <Text variant="bodyLarge" className="flex-1 px-2">
        {exerciseType === "cardio" || // Si l'exercici és de cardio, durada o compte enrere.
          exerciseType === "duration" ||
          exerciseType === "countdown"
          ? formatAsTime(set.reps) // Formata `set.reps` (que aquí representa temps) com MM:SS.
          : `${set.reps} reps`}
        {/* Per a altres tipus, mostra `set.reps` com a repeticions. */}
      </Text>
    </View>
  );
};