import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Text as NativeText,
  TextInput as NativeTextInput,
  Pressable,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import {
  Button,
  Checkbox,
  Dialog,
  Divider,
  Menu,
  Portal,
  Text,
  TextInput,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import { useShallow } from "zustand/react/shallow";
import { useTimer } from "../../lib/hooks/useTimer";
import {
  kgToLbs,
  kmToMiles,
  lbsToKg,
  milesToKm,
} from "../../lib/unitTransformers";
import { useAuthStore } from "../../store/auth-store";
import { useRestCountdownControl } from "../../store/rest-timer-context";
import { useSettingsStore } from "../../store/settings-store";
import { useWorkoutStore } from "../../store/workout-store";
import {
  AddIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  DumbellIcon,
  MoreVerticalIcon,
  TimerIcon,
  TrashCanIcon,
} from "../Icons";
import { ExternalChoiceBox } from "../ui/ChoiceBox";

/**
 * Component principal per editar un entrenament.
 * Gestiona la visualització de la informació de l'entrenament, els exercicis i els diàlegs per a la configuració.
 * @param {object} props - Propietats del component.
 * @param {boolean} [props.showTimer=true] - Indica si s'ha de mostrar el temporitzador de l'entrenament.
 * @param {boolean} [props.showCheckboxes=true] - Indica si s'han de mostrar les caselles de selecció per completar sèries.
 * @returns {JSX.Element} El component editor d'entrenaments.
 */
export default function WorkoutEditor({
  showTimer = true,
  showCheckboxes = true,
}: { showTimer?: boolean; showCheckboxes?: boolean }) {
  // Estat per controlar la visibilitat del diàleg d'unitat de pes
  const [weightUnitDialogShown, setWeightUnitDialogShown] =
    useState<boolean>(false);
  // Estat per emmagatzemar l'índex de l'exercici pel diàleg d'unitat de pes
  const [weightUnitDialogIndex, setWeightUnitDialogIndex] = useState<number>(0);

  /**
   * Funció per mostrar el diàleg de selecció d'unitat de pes per a un exercici específic.
   * Aquesta genera una altra funció pel índex de l'exercici especific.
   * @param {number} exerciseIndex - L'índex de l'exercici.
   * @returns {() => void} Una funció que, quan es crida, mostra el diàleg.
   */
  const showWeightUnitDialogHandler = (exerciseIndex: number) => () => {
    setWeightUnitDialogIndex(exerciseIndex);
    setWeightUnitDialogShown(true);
  };

  // Estat per controlar la visibilitat del diàleg de temps de descans
  const [restCountdownDialogShown, setRestCountdownDialogShown] =
    useState<boolean>(false);
  // Estat per emmagatzemar l'índex de l'exercici pel diàleg de temps de descans
  const [restCountdownDialogIndex, setRestCountdownDialogIndex] =
    useState<number>(0);

  /**
   * Funció per mostrar el diàleg de configuració del temps de descans per a un exercici específic.
   * @param {number} exerciseIndex - L'índex de l'exercici.
   * @returns {() => void} Una funció que, quan es crida, mostra el diàleg.
   */
  const showRestCountdownDialogHandler = (exerciseIndex: number) => () => {
    setRestCountdownDialogIndex(exerciseIndex);
    setRestCountdownDialogShown(true);
  };

  return (
    <>
      <KeyboardAwareScrollView bottomOffset={50}>
        <View className="gap-2 pb-8">
          <WorkoutInformation showTimer={showTimer} />
          <WorkoutExercises
            showCheckboxes={showCheckboxes}
            showWeightUnitDialog={showWeightUnitDialogHandler}
            showRestCountdownDurationDialog={showRestCountdownDialogHandler}
          />
        </View>
      </KeyboardAwareScrollView>
      <WeightUnitDialog
        shown={weightUnitDialogShown}
        exerciseIndex={weightUnitDialogIndex}
        onDismiss={() => {
          setWeightUnitDialogShown(false);
        }}
      />
      <RestCountdownCustomTimeDialog
        shown={restCountdownDialogShown}
        exerciseIndex={restCountdownDialogIndex}
        onDismiss={() => {
          setRestCountdownDialogShown(false);
        }}
      />
    </>
  );
}

/**
 * Component per mostrar i editar la informació bàsica de l'entrenament (nom, descripció) i el temporitzador.
 * @param {object} props - Propietats del component.
 * @param {boolean} props.showTimer - Indica si s'ha de mostrar el temporitzador.
 * @returns {JSX.Element} El component d'informació de l'entrenament.
 */
const WorkoutInformation = ({ showTimer }: { showTimer: boolean }) => {
  const { title, description, setName, setDescription } = useWorkoutStore(
    useShallow((state) => ({
      title: state.title,
      description: state.description,
      setName: state.setName,
      setDescription: state.setDescription,
    })),
  );

  return (
    <View className="px-4 gap-2">
      <TextInput
        label="Name"
        value={title}
        mode="outlined"
        onChangeText={setName}
      />
      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        mode="outlined"
      />

      {showTimer && <WorkoutTimer />}
    </View>
  );
};

/**
 * Component que mostra el temps transcorregut de l'entrenament.
 * @returns {JSX.Element} El component del temporitzador de l'entrenament.
 */
const WorkoutTimer = () => {
  // Obté el timestamp d'inici de l'entrenament des del store
  const startTime = useWorkoutStore((state) => state.timestamp);
  const { formattedTime, start } = useTimer();

  // Inicia el temporitzador quan el component es munta o quan canvia l'hora d'inici
  useEffect(() => {
    start(startTime);
  }, [start, startTime]);

  return <Text variant="bodyMedium">{`Elapsed time: ${formattedTime}`}</Text>;
};

/**
 * Component que llista els exercicis de l'entrenament.
 * @param {object} props - Propietats del component.
 * @param {boolean} props.showCheckboxes - Indica si s'han de mostrar les caselles de selecció per completar sèries.
 * @param {(exerciseIndex: number) => () => void} props.showWeightUnitDialog - Funció per mostrar el diàleg d'unitat de pes.
 * @param {(exerciseIndex: number) => () => void} props.showRestCountdownDurationDialog - Funció per mostrar el diàleg de temps de descans.
 * @returns {JSX.Element} El component de llista d'exercicis.
 */
const WorkoutExercises = ({
  showCheckboxes,
  showWeightUnitDialog,
  showRestCountdownDurationDialog,
}: {
  showCheckboxes: boolean;
  showWeightUnitDialog: (exerciseIndex: number) => () => void;
  showRestCountdownDurationDialog: (exerciseIndex: number) => () => void;
}) => {
  // Obté la quantitat d'exercicis des del store
  const exercisesAmount = useWorkoutStore((state) => state.exercises.length);
  return (
    <>
      {/* Itera sobre la quantitat d'exercicis per renderitzar cada un */}
      {Array.from({ length: exercisesAmount }, (_, i) => i).map(
        (item, index) => (
          <WorkoutExercise
            key={index}
            index={index}
            isFirst={index === 0}
            isLast={index === exercisesAmount - 1}
            showWeightUnitDialog={showWeightUnitDialog(item)}
            showRestCountdownDurationDialog={showRestCountdownDurationDialog(
              item,
            )}
            showCheckboxes={showCheckboxes}
          />
        ),
      )}

      {/* Botó per afegir un nou exercici */}
      <Link asChild href="/workout/ongoing/add-exercise">
        <Button
          icon={({ color }) => <AddIcon color={color} />}
          mode="outlined"
          className="mx-4 mt-2"
        >
          Add exercise
        </Button>
      </Link>
    </>
  );
};

/**
 * Component que representa un únic exercici dins de l'entrenament.
 * Mostra el nom de l'exercici, les seves sèries i un menú d'opcions.
 * @param {object} props - Propietats del component.
 * @param {number} props.index - Índex de l'exercici a la llista d'exercicis de l'entrenament.
 * @param {boolean} [props.isFirst=false] - Indica si aquest exercici és el primer de la llista.
 * @param {boolean} [props.isLast=false] - Indica si aquest exercici és l'últim de la llista.
 * @param {() => void} props.showWeightUnitDialog - Funció per mostrar el diàleg de canvi d'unitat de pes.
 * @param {() => void} props.showRestCountdownDurationDialog - Funció per mostrar el diàleg de canvi de durada del descans.
 * @param {boolean} props.showCheckboxes - Indica si s'han de mostrar les caselles de selecció per completar sèries.
 * @returns {JSX.Element} El component d'un exercici.
 */
const WorkoutExercise = ({
  index: exerciseIndex,
  isFirst = false,
  isLast = false,
  showWeightUnitDialog,
  showRestCountdownDurationDialog,
  showCheckboxes,
}: {
  index: number;
  isFirst: boolean;
  isLast: boolean;
  showWeightUnitDialog: () => void;
  showRestCountdownDurationDialog: () => void;
  showCheckboxes: boolean;
}) => {
  const theme = useTheme();
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  const {
    exerciseName,
    exerciseUuid,
    setsAmount,
    addSet,
    removeExercise,
    moveExercise,
    restCountdownDuration,
  } = useWorkoutStore(
    useShallow((state) => ({
      exerciseName: state.exercises[exerciseIndex].exercise.name,
      exerciseUuid: state.exercises[exerciseIndex].exercise.uuid,
      setsAmount: state.exercises[exerciseIndex].sets.length,
      addSet: state.addSet,
      removeExercise: state.removeExercise,
      moveExercise: state.moveExercise,
      restCountdownDuration:
        state.exercises[exerciseIndex].restCountdownDuration,
    })),
  );

  // Estat per controlar la visibilitat del menú d'opcions de l'exercici
  const [menuVisible, setMenuVisible] = useState<boolean>(false);

  /** Afegeix una nova sèrie a l'exercici actual. */
  const addSetButtonHandler = () => {
    addSet(exerciseIndex);
  };

  /** Elimina l'exercici actual de l'entrenament. */
  const removeExerciseHandler = () => {
    setMenuVisible(false); // Tanca el menú
    removeExercise(exerciseIndex);
  };

  /** Mou l'exercici actual una posició cap amunt a la llista. */
  const moveExerciseUpHandler = () => {
    setMenuVisible(false); // Tanca el menú
    moveExercise(exerciseIndex, exerciseIndex - 1);
  };

  /** Mou l'exercici actual una posició cap avall a la llista. */
  const moveExerciseDownHandler = () => {
    setMenuVisible(false); // Tanca el menú
    moveExercise(exerciseIndex, exerciseIndex + 1);
  };

  // Query per obtenir l'última entrada registrada per a aquest exercici
  const lastEntryQuery = useQuery({
    queryKey: ["user", "/user/exercise/last", exerciseUuid],
    queryFn: async () =>
      await apiClient.get("/user/exercises/:exercise_uuid/last", {
        headers: { Authorization: `Bearer ${token}` },
        params: { exercise_uuid: exerciseUuid },
      }),
  });

  // Memoritza i transforma les dades de l'última entrada
  const lastEntry = useMemo(
    () =>
      ({
        restCountdownDuration: lastEntryQuery.data?.rest_countdown_duration,
        weightUnit: lastEntryQuery.data?.weight_unit,
        exercise: {
          uuid: lastEntryQuery.data?.exercise.uuid,
          name: lastEntryQuery.data?.exercise.name,
          description: lastEntryQuery.data?.exercise.description,
          bodyPart: lastEntryQuery.data?.exercise.body_part,
          type: lastEntryQuery.data?.exercise.type,
        },
        sets: lastEntryQuery.data?.sets.map((set) => ({
          reps: set.reps,
          weight: set.weight,
          type: set.set_type,
        })),
      }) as workoutExercise,
    [lastEntryQuery.data],
  );

  return (
    <View>
      <View className="flex-1 flex-row items-center pl-4 pr-2">
        <View className="flex-1 flex-row gap-2 items-center">
          <Text variant="titleMedium">{exerciseName}</Text>
          {/* Mostra la durada del descans si està definida */}
          {restCountdownDuration && (
            <>
              <TimerIcon color={theme.colors.onSurfaceDisabled} size={20} />
              <Text
                variant="labelSmall"
                style={{ color: theme.colors.onSurfaceDisabled }}
              >
                {restCountdownDuration}s
              </Text>
            </>
          )}
        </View>

        {/* Menú d'opcions per a l'exercici */}
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)} // Tanca el menú en prémer fora
          anchor={
            <TouchableRipple onPress={() => setMenuVisible(true)}>
              <MoreVerticalIcon
                color={theme.colors.onSurface}
                className="p-2"
              />
            </TouchableRipple>
          }
        >
          <Menu.Item
            onPress={() => {
              showRestCountdownDurationDialog();
              setMenuVisible(false); // Tanca el menú
            }}
            title="Set rest countdown duration"
            leadingIcon={(props) => <TimerIcon {...props} />}
          />
          <Menu.Item
            onPress={() => {
              setMenuVisible(false); // Tanca el menú
              showWeightUnitDialog();
            }}
            title="Change weight unit"
            leadingIcon={(props) => <DumbellIcon {...props} />}
          />
          {!(isFirst && isLast) && <Divider />}
          {!isFirst && ( // Mostra l'opció de moure cap amunt si no és el primer
            <Menu.Item
              onPress={moveExerciseUpHandler}
              title="Move exercise up"
              leadingIcon={(props) => <ArrowUpIcon {...props} />}
            />
          )}
          {!isLast && ( // Mostra l'opció de moure cap avall si no és l'últim
            <Menu.Item
              onPress={moveExerciseDownHandler}
              title="Move exercise down"
              leadingIcon={(props) => <ArrowDownIcon {...props} />}
            />
          )}
          <Divider />
          <Menu.Item
            onPress={removeExerciseHandler}
            title="Remove exercise"
            leadingIcon={(props) => <TrashCanIcon {...props} />}
          />
        </Menu>
      </View>

      {/* Renderitza cada sèrie de l'exercici */}
      {Array.from({ length: setsAmount }, (_, i) => i).map((setIndex) => (
        <WorkoutSet
          key={setIndex}
          index={setIndex}
          exerciseIndex={exerciseIndex}
          showCheckboxes={showCheckboxes}
          lastEntry={lastEntry}
        />
      ))}

      {/* Botó per afegir una nova sèrie */}
      <Button
        icon={({ color }) => <AddIcon color={color} />}
        mode="text"
        onPress={addSetButtonHandler}
      >
        Add set
      </Button>
    </View>
  );
};

/**
 * Component que representa una única sèrie d'un exercici.
 * Permet editar repeticions, pes, tipus de sèrie i marcar-la com a completada.
 * @param {object} props - Propietats del component.
 * @param {number} props.index - Índex de la sèrie dins de l'exercici.
 * @param {number} props.exerciseIndex - Índex de l'exercici pare.
 * @param {boolean} props.showCheckboxes - Indica si s'ha de mostrar la casella de selecció.
 * @param {workoutExercise} [props.lastEntry] - Dades de l'última vegada que es va realitzar l'exercici.
 * @returns {JSX.Element} El component d'una sèrie.
 */
const WorkoutSet = ({
  index,
  exerciseIndex,
  showCheckboxes,
  lastEntry,
}: {
  index: number;
  exerciseIndex: number;
  showCheckboxes: boolean;
  lastEntry?: workoutExercise;
}) => {
  const theme = useTheme();

  const {
    removeSet,
    reps,
    updateSetReps,
    weight,
    updateSetWeight,
    completed,
    toggleSetCompletion,
    setType,
    updateSetType,
    weightUnit,
    restCountdownDuration,
    exerciseType,
  } = useWorkoutStore(
    useShallow((state) => ({
      removeSet: state.removeSet,
      reps: state.exercises[exerciseIndex].sets[index].reps,
      updateSetReps: state.updateSetReps,
      weight: state.exercises[exerciseIndex].sets[index].weight,
      updateSetWeight: state.updateSetWeight,
      completed: state.exercises[exerciseIndex].sets[index].complete,
      toggleSetCompletion: state.toggleSetCompletion,
      setType: state.exercises[exerciseIndex].sets[index].type,
      updateSetType: state.updateSetType,
      weightUnit: state.exercises[exerciseIndex].weightUnit,
      restCountdownDuration:
        state.exercises[exerciseIndex].restCountdownDuration,
      exerciseType: state.exercises[exerciseIndex].exercise.type,
    })),
  );
  // Comprova si la funcionalitat de "última sèrie" està activada a la configuració
  const enableLastSet = useSettingsStore((state) => state.enableLastSet);

  // Hook per controlar el compte enrere del descans
  const { start: startRestCountdown } = useRestCountdownControl();

  const selectedWeightUnit: WeightUnit = !weightUnit ? "metric" : weightUnit;

  // Estat per controlar la visibilitat del menú de tipus de sèrie
  const [menuVisible, setMenuVisible] = useState<boolean>(false);

  /** Elimina la sèrie actual. */
  const removeSetHandler = () => {
    setMenuVisible(false); // Tanca el menú
    removeSet(exerciseIndex, index);
  };

  /**
   * Actualitza el pes de la sèrie, convertint-lo si cal segons la unitat imperial.
   * @param {number} value - El nou valor del pes.
   */
  const updateSetWeightHandler = (value: number) => {
    updateSetWeight(
      exerciseIndex,
      index,
      selectedWeightUnit === "imperial" // Comprova si la unitat és imperial
        ? exerciseType === "cardio" // Si és cardio, converteix milles a km
          ? milesToKm(value)
          : lbsToKg(value) // Si no ho és, converteix lliures a kg
        : value, // Si no és imperial, utilitza el valor directament
    );
  };

  /**
   * Actualitza les repeticions de la sèrie.
   * @param {number} value - El nou valor de les repeticions.
   */
  const updateSetRepsHandler = (value: number) => {
    updateSetReps(exerciseIndex, index, value);
  };

  /** Commuta l'estat de completat de la sèrie i inicia el compte enrere si s'activa. */
  const toggleSetCompletionHandler = () => {
    if (!completed) {
      startRestCountdown(restCountdownDuration);
    }
    toggleSetCompletion(exerciseIndex, index);
  };

  /**
   * Factoria de funcions per canviar el tipus de la sèrie.
   * @param {exerciseSet["type"]} t - El nou tipus de sèrie.
   * @returns {() => void} Una funció que actualitza el tipus de sèrie.
   */
  const setTypeChangeFactory = (t: exerciseSet["type"]) => () => {
    setMenuVisible(false); // Tanca el menú
    updateSetType(exerciseIndex, index, t);
  };

  return (
    <View
      className="flex-1 flex-row items-center px-2 gap-2"
      style={{
        // Canvia el color de fons si la sèrie està completada
        backgroundColor: completed
          ? theme.colors.primaryContainer
          : "transparent",
      }}
    >
      {/* Menú per seleccionar el tipus de sèrie (Normal, Dropset, Fallada) */}
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <TouchableRipple onPress={() => setMenuVisible(true)}>
            <Text
              variant="titleMedium"
              className="w-12 px-2 py-2 font-bold rounded"
              style={{
                textAlign: "center",
                color: theme.colors.onPrimaryContainer, // Color del text del tipus de sèrie
              }}
            >
              {/* Mostra l'identificador del tipus de sèrie */}
              {setType === "normal"
                ? index + 1 // Número de sèrie per a 'normal'
                : setType === "dropset"
                  ? "D" // 'D' per a 'dropset'
                  : "F"}
              {/* 'F' per a 'failture' */}
            </Text>
          </TouchableRipple>
        }
      >
        <Menu.Item
          onPress={setTypeChangeFactory("normal")}
          title="Normal"
          style={{
            backgroundColor:
              setType === "normal"
                ? theme.colors.surfaceVariant
                : "transparent", // Ressalta l'opció seleccionada
          }}
        />
        <Menu.Item
          onPress={setTypeChangeFactory("dropset")}
          title="Dropset"
          style={{
            backgroundColor:
              setType === "dropset"
                ? theme.colors.surfaceVariant
                : "transparent", // Ressalta l'opció seleccionada
          }}
        />
        <Menu.Item
          onPress={setTypeChangeFactory("failture")}
          title="Failture"
          style={{
            backgroundColor:
              setType === "failture"
                ? theme.colors.surfaceVariant
                : "transparent", // Ressalta l'opció seleccionada
          }}
        />
        <Divider />
        <Menu.Item
          onPress={removeSetHandler}
          title="Remove set"
          leadingIcon={(props) => <TrashCanIcon {...props} />}
        />
      </Menu>

      {/* Mostra el botó de "última vegada" si està activat i hi ha dades */}
      {enableLastSet && (
        <LastExerciseButton
          setIndex={index}
          exerciseIndex={exerciseIndex}
          completed={!!completed}
          lastEntry={lastEntry}
        />
      )}

      {/* Mostra el camp de pes/distància si el tipus d'exercici ho requereix */}
      {exerciseType !== "duration" &&
        exerciseType !== "countdown" &&
        exerciseType !== "reps-only" && (
          <WorkoutSetTextField
            value={
              // Converteix el valor si la unitat és imperial
              selectedWeightUnit === "imperial"
                ? exerciseType === "cardio"
                  ? kmToMiles(weight) // km a milles per a cardio
                  : kgToLbs(weight) // kg a lliures per a altres
                : weight // Valor directe si és mètric
            }
            unit={
              // Determina el tipus d'unitat (pes, distància, etc.)
              exerciseType === "cardio"
                ? "distance"
                : exerciseType === "assisted-bodyweight"
                  ? "assisted-weight"
                  : "weight"
            }
            weightUnit={selectedWeightUnit} // Passa la unitat de pes seleccionada
            onTextChange={updateSetWeightHandler} // Funció per actualitzar el pes
            completed={!!completed} // Passa l'estat de completat
          />
        )}

      {/* Camp per a repeticions o temps */}
      <WorkoutSetTextField
        value={reps} // Valor de repeticions/temps
        unit={
          // Determina si la unitat és temps o repeticions
          exerciseType === "cardio" ||
            exerciseType === "duration" ||
            exerciseType === "countdown"
            ? "time" // Unitat de temps
            : "reps" // Unitat de repeticions
        }
        weightUnit={selectedWeightUnit} // Passa la unitat de pes (rellevant per formatació si fos necessari)
        onTextChange={updateSetRepsHandler} // Funció per actualitzar repeticions/temps
        completed={!!completed} // Passa l'estat de completat
      />

      {/* Mostra la casella de selecció si està activada */}
      {showCheckboxes && (
        <Checkbox
          status={completed ? "checked" : "unchecked"}
          onPress={toggleSetCompletionHandler}
        />
      )}
    </View>
  );
};

/**
 * Tipus per als camps d'entrada d'una sèrie (pes, repeticions, temps, etc.).
 * @typedef {"weight" | "assisted-weight" | "distance" | "reps" | "time"} WorkoutFieldType
 */
type WorkoutFieldType =
  | "weight"
  | "assisted-weight"
  | "distance"
  | "reps"
  | "time";

/**
 * Component de camp de text personalitzat per a les entrades de les sèries (pes, repeticions, temps).
 * Gestiona l'edició i el format del valor.
 * @param {object} props - Propietats del component.
 * @param {number} props.value - Valor numèric del camp.
 * @param {(number: number) => void} props.onTextChange - Funció per actualitzar el valor.
 * @param {WorkoutFieldType} props.unit - Tipus d'unitat del camp (pes, reps, temps, etc.).
 * @param {WeightUnit} props.weightUnit - Sistema d'unitat de pes actual (mètric/imperial).
 * @param {boolean} props.completed - Indica si la sèrie associada està completada.
 * @returns {JSX.Element} El component de camp de text.
 */
const WorkoutSetTextField = ({
  value: externalValue,
  onTextChange: externalOnTextChange,
  unit,
  weightUnit,
  completed,
}: {
  value: number;
  onTextChange: (number: number) => void;
  unit: WorkoutFieldType;
  weightUnit: WeightUnit;
  completed: boolean;
}) => {
  const theme = useTheme();

  const textInputRef = useRef<NativeTextInput>(null); // Referència al camp de text de React Native
  const [editing, setEditing] = useState<boolean>(false); // Estat per controlar si s'està editant

  const [internalValue, setInternalValue] = useState<string>(""); // Valor intern del camp com a string

  /** Formata el valor numèric com a temps (MM:SS). */
  const formatAsTime = () => {
    const formattedValue = Math.floor(externalValue).toString();
    const minutesPart =
      formattedValue.length >= 3
        ? formattedValue.substring(0, formattedValue.length - 2)
        : "0";
    const secondsPart = formattedValue
      .substring(formattedValue.length - 2, formattedValue.length)
      .padStart(2, "0"); // Assegura dos dígits per als segons

    return `${minutesPart}:${secondsPart}`;
  };

  /**
     * Comprova si el valor de temps introduït és correcte (segons < 60).
     * @param {string} value - El valor de temps com a string (ex: "130" per 1:30).
     * @returns {boolean} True si el temps és correcte.
     */
  const isTimeCorrect = (value: string) => {
    if (value.length <= 2) {
      return Math.floor(Number(value)) < 60; // Segons han de ser < 60
    }

    const flooredNumber = Math.floor(Number(value)).toString();
    const secondsPart = `${flooredNumber.charAt(flooredNumber.length - 2)}${flooredNumber.charAt(flooredNumber.length - 1)}`;

    return Number(secondsPart) < 60; // Comprova els dos últims dígits com a segons
  };

  /**
   * Actualitza el valor intern i extern del camp.
   * @param {string} value - El nou valor del text introduït.
   */
  const updateValues = (value: string) => {
    if (value === "" || Number.isNaN(Number(value))) {
      // Si el valor és buit o no és un número, estableix a 0
      externalOnTextChange(0);
      setInternalValue("0");
    } else {
      if (displayAsTime) {
        // Si es mostra com a temps, valida el format
        if (isTimeCorrect(value)) {
          externalOnTextChange(Math.floor(Number(value)));
        } else {
          externalOnTextChange(0); // Valor incorrecte, estableix a 0
        }
      } else {
        // Si no és temps, converteix a número
        externalOnTextChange(Number(value));
      }

      // Evita zeros a l'esquerra innecessaris (ex: "05" -> "5")
      if (value.length > 1 && value.charAt(0) === "0" && value.charAt(1) !== ".") {
        setInternalValue(Number(value).toString());
      } else {
        setInternalValue(value);
      }
    }
  };

  /** Inicia el mode d'edició del camp. */
  const startEditing = () => {
    setInternalValue(externalValue.toString()); // Inicialitza el valor intern amb l'extern
    setEditing(true);
  };

  /** Finalitza el mode d'edició del camp. */
  const endEditing = () => {
    setEditing(false);
  };

  // Memoritza la unitat de text, si s'ha de mostrar com a temps o com a negatiu
  const [unitText, displayAsTime, displayAsNegative] = useMemo(() => {
    if (unit === "weight") {
      return [weightUnit === "metric" ? "kg" : "lbs", false, false];
      // biome-ignore lint/style/noUselessElse: <explanation>
    } else if (unit === "assisted-weight") {
      // Pes assistit pot ser negatiu
      return [weightUnit === "metric" ? "kg" : "lbs", false, true];
      // biome-ignore lint/style/noUselessElse: <explanation>
    } else if (unit === "distance") {
      return [weightUnit === "metric" ? "km" : "mi", false, false];
      // biome-ignore lint/style/noUselessElse: <explanation>
    } else if (unit === "reps") {
      return ["reps", false, false];
      // biome-ignore lint/style/noUselessElse: <explanation>
    } else {
      // Per defecte, és temps
      return ["", true, false];
    }
  }, [unit, weightUnit]);

  // Efecte per enfocar el camp de text quan s'entra en mode d'edició
  useEffect(() => {
    setTimeout(() => {
      if (editing) {
        textInputRef.current?.focus();
      }
    }, 100); // Petit retard per assegurar que el camp és visible
  }, [editing]);

  return editing ? ( // Si s'està editant, mostra el TextInput natiu
    <View className="flex-1">
      <NativeTextInput
        className="text-center px-2 py-2 font-bold rounded"
        value={internalValue}
        onChangeText={updateValues}
        keyboardType="numeric" // Teclat numèric
        style={{
          color: completed
            ? theme.colors.onPrimaryContainer
            : theme.colors.onSurface,
        }}
        onBlur={endEditing} // Finalitza l'edició en perdre el focus
        ref={textInputRef}
      />
    </View>
  ) : (
    // Si no s'està editant, mostra el text formatat clicable
    <Pressable onPress={startEditing} className="flex-1 py-2">
      <NativeText
        className="px-6 py-2 font-bold rounded"
        style={{
          textAlign: "center",
          color: completed
            ? theme.colors.onPrimaryContainer
            : theme.colors.onSurface,
        }}
      >
        {/* Formata el text segons si és temps, negatiu, o un número normal */}
        {`${displayAsTime
            ? formatAsTime()
            : displayAsNegative && externalValue !== 0
              ? `-${Number(externalValue.toFixed(2)).toString()}` // Mostra negatiu
              : Number(externalValue.toFixed(2)).toString()
          } ${unitText}`}
      </NativeText>
    </Pressable>
  );
};

/**
 * Botó que mostra les dades (pes x repeticions) de la mateixa sèrie de l'última vegada que es va fer l'exercici.
 * Permet copiar aquestes dades a la sèrie actual.
 * @param {object} props - Propietats del component.
 * @param {boolean} props.completed - Indica si la sèrie actual està completada.
 * @param {number} props.exerciseIndex - Índex de l'exercici pare.
 * @param {number} props.setIndex - Índex de la sèrie actual.
 * @param {workoutExercise} [props.lastEntry] - Dades de l'última vegada que es va realitzar l'exercici.
 * @returns {JSX.Element | null} El botó o null si no hi ha dades.
 */
const LastExerciseButton = ({
  completed,
  exerciseIndex,
  setIndex,
  lastEntry,
}: {
  completed: boolean;
  setIndex: number;
  exerciseIndex: number;
  lastEntry?: workoutExercise;
}) => {
  const theme = useTheme();
  const { updateSetReps, updateSetWeight } = useWorkoutStore(
    useShallow((state) => ({
      updateSetReps: state.updateSetReps,
      updateSetWeight: state.updateSetWeight,
    })),
  );

  // Troba la sèrie corresponent de l'última entrada, si existeix
  const set = lastEntry?.sets
    ? setIndex < lastEntry.sets.length
      ? lastEntry.sets[setIndex]
      : null // Si l'índex actual és major que les sèries anteriors, no hi ha dada
    : undefined; // Si no hi ha 'lastEntry.sets', és indefinit

  /** Actualitza la sèrie actual amb les dades de l'última entrada. */
  const updateSetHandler = () => {
    if (set) {
      updateSetReps(exerciseIndex, setIndex, set?.reps);
      updateSetWeight(exerciseIndex, setIndex, set?.weight);
    }
  };

  return (
    <TouchableRipple
      onPress={updateSetHandler}
      disabled={completed || !set} // Deshabilita si la sèrie està completada o no hi ha dades de l'última vegada
    >
      <Text
        variant="labelSmall"
        className="w-24 py-2"
        style={{
          textAlign: "center",
          color: completed // Canvia el color del text si la sèrie està completada
            ? theme.colors.onPrimaryContainer
            : theme.colors.onSurface,
        }}
      >
        {/* Mostra "pes x reps" o "-" si no hi ha dades */}
        {set ? `${set.weight}x${set.reps}` : "-"}
      </Text>
    </TouchableRipple>
  );
};

/**
 * Diàleg per canviar la unitat de pes d'un exercici (per defecte, mètric, imperial).
 * @param {object} props - Propietats del component.
 * @param {boolean} props.shown - Indica si el diàleg és visible.
 * @param {number} props.exerciseIndex - Índex de l'exercici per al qual es canvia la unitat.
 * @param {() => void} props.onDismiss - Funció a cridar quan es tanca el diàleg.
 * @returns {JSX.Element} El component del diàleg.
 */
const WeightUnitDialog = ({
  shown,
  exerciseIndex,
  onDismiss,
}: { shown: boolean; exerciseIndex: number; onDismiss: () => void }) => {
  const theme = useTheme(); // Hook per accedir al tema

  // Funció per actualitzar la unitat de pes de l'exercici a l'store
  const updateExerciseWeightUnit = useWorkoutStore(
    (state) => state.updateExerciseWeightUnit,
  );

  // Estat per al valor seleccionat al diàleg (índex de l'opció)
  const [value, setValue] = useState<number>(0);
  // Opcions disponibles per a la unitat de pes
  const elements = {
    default: "Use default weight unit",
    metric: "Metric (kg)",
    imperial: "Imperial (lbs)",
  };
  const values = Object.entries(elements).map((v) => v[1]); // Array de textos de les opcions

  /** Confirma la selecció i actualitza la unitat de pes. */
  const confirmHandler = () => {
    updateExerciseWeightUnit(
      exerciseIndex,
      Object.keys(elements)[value] as workoutExercise["weightUnit"] & "default",
    );
    onDismiss(); // Tanca el diàleg
  };

  /**
   * Actualitza l'estat del valor seleccionat basat en el text de l'opció.
   * @param {string} selectedValueText - El text de l'opció seleccionada.
   */
  const valueUpdateHandler = (selectedValueText: string) => {
    setValue(values.indexOf(selectedValueText)); // Troba l'índex del text seleccionat
  };

  return (
    <Portal>
      <Dialog visible={shown} onDismiss={onDismiss}>
        <Dialog.Title>Change weight unit</Dialog.Title>
        <Dialog.Content>
          <ExternalChoiceBox
            label="Weight Unit"
            elements={values} // Passa els textos de les opcions
            value={values[value]} // Valor actual seleccionat (text)
            setSelectedValue={valueUpdateHandler} // Funció per actualitzar la selecció
            mode="outlined"
            style={{ backgroundColor: theme.colors.elevation.level3 }}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancel</Button>
          <Button onPress={confirmHandler}>Done</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

/**
 * Diàleg per personalitzar la durada del compte enrere de descans per a un exercici.
 * @param {object} props - Propietats del component.
 * @param {boolean} props.shown - Indica si el diàleg és visible.
 * @param {number} props.exerciseIndex - Índex de l'exercici.
 * @param {() => void} props.onDismiss - Funció a cridar quan es tanca el diàleg.
 * @returns {JSX.Element} El component del diàleg.
 */
const RestCountdownCustomTimeDialog = ({
  shown,
  exerciseIndex,
  onDismiss,
}: { shown: boolean; exerciseIndex: number; onDismiss: () => void }) => {
  // Obté la durada de descans per defecte del context
  const { duration } = useRestCountdownControl();
  // Obté funcions i dades del workout store relacionades amb el descans
  const { updateExerciseRestCountdownDuration, restCountdownDuration } =
    useWorkoutStore(
      useShallow((state) => ({
        updateExerciseRestCountdownDuration:
          state.updateExerciseRestCountdownDuration,
        // Durada de descans específica de l'exercici, si n'hi ha
        restCountdownDuration:
          state.exercises[exerciseIndex]?.restCountdownDuration,
      })),
    );

  // Estat per al valor de la durada del descans, inicialitzat amb la durada de l'exercici o la per defecte
  const [value, setValue] = useState<number>(
    restCountdownDuration ? restCountdownDuration : duration,
  );

  /** Confirma la nova durada i l'actualitza a l'store. */
  const confirmHandler = () => {
    updateExerciseRestCountdownDuration(exerciseIndex, value);
    onDismiss(); // Tanca el diàleg
  };

  /** Estableix la durada del descans al valor per defecte. */
  const defaultHandler = () => {
    updateExerciseRestCountdownDuration(exerciseIndex, "default");
    onDismiss(); // Tanca el diàleg
  };

  return (
    <Portal>
      <Dialog visible={shown} onDismiss={onDismiss}>
        <Dialog.Title>Change rest countdown duration</Dialog.Title>
        <Dialog.Content>
          <View className="gap-4">
            <Text variant="labelLarge">
              {/* Mostra la durada seleccionada o un missatge si està desactivat */}
              {value > 0
                ? `Duration: ${value} seconds`
                : "Rest countdown disabled."}
            </Text>
            <View className="flex-row gap-4">
              {/* Botons per decrementar/incrementar la durada */}
              <Button
                onPress={() =>
                  setValue((state) => {
                    const newDuration = state - 15;
                    return newDuration < 0 ? 0 : newDuration; // Mínim 0
                  })
                }
                className="flex-1"
                mode="outlined"
              >
                - 15s
              </Button>
              <Button
                onPress={() => setValue((state) => state + 15)}
                className="flex-1"
                mode="outlined"
              >
                + 15s
              </Button>
            </View>
            {/* Botó per restaurar el valor per defecte */}
            <Button onPress={defaultHandler} mode="outlined">
              Use default value ({duration} s)
            </Button>
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancel</Button>
          <Button onPress={confirmHandler}>Confirm</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};