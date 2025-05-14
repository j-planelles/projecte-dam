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

export default function WorkoutEditor({
  showTimer = true,
  showCheckboxes = true,
}: { showTimer?: boolean; showCheckboxes?: boolean }) {
  const [weightUnitDialogShown, setWeightUnitDialogShown] =
    useState<boolean>(false);
  const [weightUnitDialogIndex, setWeightUnitDialogIndex] = useState<number>(0);

  const showWeightUnitDialogHandler = (exerciseIndex: number) => () => {
    setWeightUnitDialogIndex(exerciseIndex);
    setWeightUnitDialogShown(true);
  };

  const [restCountdownDialogShown, setRestCountdownDialogShown] =
    useState<boolean>(false);
  const [restCountdownDialogIndex, setRestCountdownDialogIndex] =
    useState<number>(0);

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

const WorkoutTimer = () => {
  const startTime = useWorkoutStore((state) => state.timestamp);
  const { formattedTime, start } = useTimer();

  useEffect(() => {
    start(startTime);
  }, [start, startTime]);

  return <Text variant="bodyMedium">{`Elapsed time: ${formattedTime}`}</Text>;
};

const WorkoutExercises = ({
  showCheckboxes,
  showWeightUnitDialog,
  showRestCountdownDurationDialog,
}: {
  showCheckboxes: boolean;
  showWeightUnitDialog: (exerciseIndex: number) => () => void;
  showRestCountdownDurationDialog: (exerciseIndex: number) => () => void;
}) => {
  const exercisesAmount = useWorkoutStore((state) => state.exercises.length);
  return (
    <>
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

  const [menuVisible, setMenuVisible] = useState<boolean>(false);

  const addSetButtonHandler = () => {
    addSet(exerciseIndex);
  };

  const removeExerciseHandler = () => {
    setMenuVisible(false);

    removeExercise(exerciseIndex);
  };

  const moveExerciseUpHandler = () => {
    setMenuVisible(false);

    moveExercise(exerciseIndex, exerciseIndex - 1);
  };

  const moveExerciseDownHandler = () => {
    setMenuVisible(false);

    moveExercise(exerciseIndex, exerciseIndex + 1);
  };

  const lastEntryQuery = useQuery({
    queryKey: ["user", "/user/exercise/last", exerciseUuid],
    queryFn: async () =>
      await apiClient.get("/user/exercises/:exercise_uuid/last", {
        headers: { Authorization: `Bearer ${token}` },
        params: { exercise_uuid: exerciseUuid },
      }),
    // staleTime: 30 * 60 * 1000, // 30 minuts
  });

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

  console.log(lastEntry);

  return (
    <View>
      <View className="flex-1 flex-row items-center pl-4 pr-2">
        <View className="flex-1 flex-row gap-2 items-center">
          <Text variant="titleMedium">{exerciseName}</Text>
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

        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
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
              setMenuVisible(false);
            }}
            title="Set rest countdown duration"
            leadingIcon={(props) => <TimerIcon {...props} />}
          />
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              showWeightUnitDialog();
            }}
            title="Change weight unit"
            leadingIcon={(props) => <DumbellIcon {...props} />}
          />
          {!(isFirst && isLast) && <Divider />}
          {!isFirst && (
            <Menu.Item
              onPress={moveExerciseUpHandler}
              title="Move exercise up"
              leadingIcon={(props) => <ArrowUpIcon {...props} />}
            />
          )}
          {!isLast && (
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

      {Array.from({ length: setsAmount }, (_, i) => i).map((setIndex) => (
        <WorkoutSet
          key={setIndex}
          index={setIndex}
          exerciseIndex={exerciseIndex}
          showCheckboxes={showCheckboxes}
          lastEntry={lastEntry}
        />
      ))}

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
  const enableLastSet = useSettingsStore((state) => state.enableLastSet);

  const { start: startRestCountdown } = useRestCountdownControl();

  const selectedWeightUnit: WeightUnit = !weightUnit ? "metric" : weightUnit;

  const [menuVisible, setMenuVisible] = useState<boolean>(false);

  const removeSetHandler = () => {
    setMenuVisible(false);

    removeSet(exerciseIndex, index);
  };

  const updateSetWeightHandler = (value: number) => {
    updateSetWeight(
      exerciseIndex,
      index,
      weightUnit === "imperial"
        ? exerciseType === "cardio"
          ? milesToKm(value)
          : lbsToKg(value)
        : value,
    );
  };

  const updateSetRepsHandler = (value: number) => {
    updateSetReps(exerciseIndex, index, value);
  };

  const toggleSetCompletionHandler = () => {
    if (!completed) {
      startRestCountdown(restCountdownDuration);
    }
    toggleSetCompletion(exerciseIndex, index);
  };

  const setTypeChangeFactory = (t: exerciseSet["type"]) => () => {
    setMenuVisible(false);

    updateSetType(exerciseIndex, index, t);
  };

  return (
    <View
      className="flex-1 flex-row items-center px-2 gap-2"
      style={{
        backgroundColor: completed
          ? theme.colors.primaryContainer
          : "transparent",
      }}
    >
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
                color: theme.colors.onPrimaryContainer,
              }}
            >
              {setType === "normal"
                ? index + 1
                : setType === "dropset"
                  ? "D"
                  : "F"}
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
                : "transparent",
          }}
        />
        <Menu.Item
          onPress={setTypeChangeFactory("dropset")}
          title="Dropset"
          style={{
            backgroundColor:
              setType === "dropset"
                ? theme.colors.surfaceVariant
                : "transparent",
          }}
        />
        <Menu.Item
          onPress={setTypeChangeFactory("failture")}
          title="Failture"
          style={{
            backgroundColor:
              setType === "failture"
                ? theme.colors.surfaceVariant
                : "transparent",
          }}
        />
        <Divider />
        <Menu.Item
          onPress={removeSetHandler}
          title="Remove set"
          leadingIcon={(props) => <TrashCanIcon {...props} />}
        />
      </Menu>

      {enableLastSet && (
        <LastExerciseButton
          setIndex={index}
          exerciseIndex={exerciseIndex}
          completed={!!completed}
          lastEntry={lastEntry}
        />
      )}

      {exerciseType !== "duration" &&
        exerciseType !== "countdown" &&
        exerciseType !== "reps-only" && (
          <WorkoutSetTextField
            value={
              weightUnit === "imperial"
                ? exerciseType === "cardio"
                  ? kmToMiles(weight)
                  : kgToLbs(weight)
                : weight
            }
            unit={
              exerciseType === "cardio"
                ? "distance"
                : exerciseType === "assisted-bodyweight"
                  ? "assisted-weight"
                  : "weight"
            }
            weightUnit={selectedWeightUnit}
            onTextChange={updateSetWeightHandler}
            completed={!!completed}
          />
        )}

      <WorkoutSetTextField
        value={reps}
        unit={
          exerciseType === "cardio" ||
          exerciseType === "duration" ||
          exerciseType === "countdown"
            ? "time"
            : "reps"
        }
        weightUnit={selectedWeightUnit}
        onTextChange={updateSetRepsHandler}
        completed={!!completed}
      />

      {showCheckboxes && (
        <Checkbox
          status={completed ? "checked" : "unchecked"}
          onPress={toggleSetCompletionHandler}
        />
      )}
    </View>
  );
};

type WorkoutFieldType =
  | "weight"
  | "assisted-weight"
  | "distance"
  | "reps"
  | "time";

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

  const textInputRef = useRef<NativeTextInput>(null);
  const [editing, setEditing] = useState<boolean>(false);

  const [internalValue, setInternalValue] = useState<string>("");

  const formatAsTime = () => {
    const formattedValue = Math.floor(externalValue).toString();
    const minutesPart =
      formattedValue.length >= 3
        ? formattedValue.substring(0, formattedValue.length - 2)
        : "0";
    const secondsPart = formattedValue
      .substring(formattedValue.length - 2, formattedValue.length)
      .padStart(2, "0");

    return `${minutesPart}:${secondsPart}`;
  };

  const isTimeCorrect = (value: string) => {
    if (value.length <= 2) {
      return Math.floor(Number(value)) < 60;
    }

    const flooredNumber = Math.floor(Number(value)).toString();
    const secondsPart = `${flooredNumber.charAt(flooredNumber.length - 2)}${flooredNumber.charAt(flooredNumber.length - 1)}`;

    return Number(secondsPart) < 60;
  };

  const updateValues = (value: string) => {
    if (value === "" || Number.isNaN(Number(value))) {
      externalOnTextChange(0);
      setInternalValue("0");
    } else {
      if (displayAsTime) {
        if (isTimeCorrect(value)) {
          externalOnTextChange(Math.floor(Number(value)));
        } else {
          externalOnTextChange(0);
        }
      } else {
        externalOnTextChange(Number(value));
      }

      if (value.length > 1 && value.charAt(0) === "0") {
        setInternalValue(Number(value).toString());
      } else {
        setInternalValue(value);
      }
    }
  };

  const startEditing = () => {
    setInternalValue(externalValue.toString());
    setEditing(true);
  };

  const endEditing = () => {
    setEditing(false);
  };

  const [unitText, displayAsTime, displayAsNegative] = useMemo(() => {
    if (unit === "weight") {
      return [weightUnit === "metric" ? "kg" : "lbs", false, false];
      // biome-ignore lint/style/noUselessElse: <explanation>
    } else if (unit === "assisted-weight") {
      return [weightUnit === "metric" ? "kg" : "lbs", false, true];
      // biome-ignore lint/style/noUselessElse: <explanation>
    } else if (unit === "distance") {
      return [weightUnit === "metric" ? "km" : "mi", false, false];
      // biome-ignore lint/style/noUselessElse: <explanation>
    } else if (unit === "reps") {
      return ["reps", false, false];
      // biome-ignore lint/style/noUselessElse: <explanation>
    } else {
      // Time
      return ["", true, false];
    }
  }, [unit, weightUnit]);

  useEffect(() => {
    setTimeout(() => {
      if (editing) {
        textInputRef.current?.focus();
      }
    }, 100);
  }, [editing]);

  return editing ? (
    <View className="flex-1">
      <NativeTextInput
        className="text-center px-2 py-2 font-bold rounded"
        value={internalValue}
        onChangeText={updateValues}
        keyboardType="numeric"
        style={{
          color: completed
            ? theme.colors.onPrimaryContainer
            : theme.colors.onSurface,
        }}
        onBlur={endEditing}
        ref={textInputRef}
      />
    </View>
  ) : (
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
        {`${
          displayAsTime
            ? formatAsTime()
            : displayAsNegative && externalValue !== 0
              ? `-${Number(externalValue.toFixed(2)).toString()}`
              : Number(externalValue.toFixed(2)).toString()
        } ${unitText}`}
      </NativeText>
    </Pressable>
  );
};

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

  const set = lastEntry?.sets
    ? setIndex < lastEntry.sets.length
      ? lastEntry.sets[setIndex]
      : null
    : undefined;

  const updateSetHandler = () => {
    if (set) {
      updateSetReps(exerciseIndex, setIndex, set?.reps);
      updateSetWeight(exerciseIndex, setIndex, set?.weight);
    }
  };

  return (
    <TouchableRipple onPress={updateSetHandler} disabled={completed || !set}>
      <Text
        variant="labelSmall"
        className="w-24 py-2"
        style={{
          textAlign: "center",
          color: completed
            ? theme.colors.onPrimaryContainer
            : theme.colors.onSurface,
          // backgroundColor: "red",
        }}
      >
        {set ? `${set.weight}x${set.reps}` : "-"}
      </Text>
    </TouchableRipple>
  );
};

const WeightUnitDialog = ({
  shown,
  exerciseIndex,
  onDismiss,
}: { shown: boolean; exerciseIndex: number; onDismiss: () => void }) => {
  const theme = useTheme();

  const updateExerciseWeightUnit = useWorkoutStore(
    (state) => state.updateExerciseWeightUnit,
  );

  const [value, setValue] = useState<number>(0);
  const elements = {
    default: "Use default weight unit",
    metric: "Metric (kg)",
    imperial: "Imperial (lbs)",
  };
  const values = Object.entries(elements).map((v) => v[1]);

  const confirmHandler = () => {
    updateExerciseWeightUnit(
      exerciseIndex,
      Object.keys(elements)[value] as workoutExercise["weightUnit"] & "default",
    );
    onDismiss();
  };

  const valueUpdateHandler = (value: string) => {
    setValue(values.indexOf(value));
  };

  return (
    <Portal>
      <Dialog visible={shown} onDismiss={onDismiss}>
        <Dialog.Title>Change weight unit</Dialog.Title>
        <Dialog.Content>
          <ExternalChoiceBox
            label="Weight Unit"
            elements={values}
            value={values[value]}
            setSelectedValue={valueUpdateHandler}
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

const RestCountdownCustomTimeDialog = ({
  shown,
  exerciseIndex,
  onDismiss,
}: { shown: boolean; exerciseIndex: number; onDismiss: () => void }) => {
  const { duration } = useRestCountdownControl();
  const { updateExerciseRestCountdownDuration, restCountdownDuration } =
    useWorkoutStore(
      useShallow((state) => ({
        updateExerciseRestCountdownDuration:
          state.updateExerciseRestCountdownDuration,
        restCountdownDuration:
          state.exercises[exerciseIndex]?.restCountdownDuration,
      })),
    );

  const [value, setValue] = useState<number>(
    restCountdownDuration ? restCountdownDuration : duration,
  );

  const confirmHandler = () => {
    updateExerciseRestCountdownDuration(exerciseIndex, value);
    onDismiss();
  };

  const defaultHandler = () => {
    updateExerciseRestCountdownDuration(exerciseIndex, "default");
    onDismiss();
  };

  return (
    <Portal>
      <Dialog visible={shown} onDismiss={onDismiss}>
        <Dialog.Title>Change rest countdown duration</Dialog.Title>
        <Dialog.Content>
          <View className="gap-4">
            <Text variant="labelLarge">
              {value > 0
                ? `Duration: ${value} seconds`
                : "Rest countdown disabled."}
            </Text>
            <View className="flex-row gap-4">
              <Button
                onPress={() =>
                  setValue((state) => {
                    const newDuration = state - 15;
                    return newDuration < 0 ? 0 : newDuration;
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
