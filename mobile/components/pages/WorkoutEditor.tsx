import { useEffect, useMemo, useRef, useState } from "react";
import {
  Text as NativeText,
  TextInput as NativeTextInput,
  Pressable,
  ScrollView,
  View,
} from "react-native";
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
import {
  AddIcon,
  ArrowDownIcon,
  ArrowDropDownIcon,
  ArrowUpIcon,
  DumbellIcon,
  MoreVerticalIcon,
  TimerIcon,
  TrashCanIcon,
} from "../Icons";
import { Link } from "expo-router";
import { useWorkoutStore } from "../../store/workout-store";
import { useShallow } from "zustand/react/shallow";
import ChoiceBox, { ExternalChoiceBox } from "../ui/ChoiceBox";
import {
  kgToLbs,
  kmToMiles,
  lbsToKg,
  milesToKm,
} from "../../lib/unitTransformers";
import { useTimer } from "../../lib/hooks/useTimer";
import { useRestCountdownControl } from "../../store/rest-timer-context";

export default function WorkoutEditor() {
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
      <ScrollView>
        <View className="gap-2">
          <WorkoutInformation />
          <WorkoutExercises
            showWeightUnitDialog={showWeightUnitDialogHandler}
            showRestCountdownDurationDialog={showRestCountdownDialogHandler}
          />
        </View>
      </ScrollView>
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

const WorkoutInformation = () => {
  const { title, description, gym, setName, setDescription } = useWorkoutStore(
    useShallow((state) => ({
      title: state.title,
      description: state.description,
      gym: state.gym,
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

      <WorkoutTimer />

      <Link asChild href="/workout/ongoing/select-gym">
        <Button mode="outlined" className="text-left">
          {gym}
        </Button>
      </Link>
    </View>
  );
};

const WorkoutTimer = () => {
  const startTime = useWorkoutStore((state) => state.timestamp);
  const { formattedTime, start } = useTimer();

  useEffect(() => {
    start(startTime);
  }, [start, startTime]);

  return <Text variant="titleMedium">{`Elapsed time: ${formattedTime}`}</Text>;
};

const WorkoutExercises = ({
  showWeightUnitDialog,
  showRestCountdownDurationDialog,
}: {
  showWeightUnitDialog: (exerciseIndex: number) => () => void;
  showRestCountdownDurationDialog: (exerciseIndex: number) => () => void;
}) => {
  const exercisesAmount = useWorkoutStore((state) => state.exercises.length);
  return (
    <>
      <Divider />
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
          />
        ),
      )}

      <Link asChild href="/workout/ongoing/add-exercise">
        <Button icon={({ color }) => <AddIcon color={color} />} mode="text">
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
}: {
  index: number;
  isFirst: boolean;
  isLast: boolean;
  showWeightUnitDialog: () => void;
  showRestCountdownDurationDialog: () => void;
}) => {
  const theme = useTheme();

  const { exerciseName, setsAmount, addSet, removeExercise, moveExercise } =
    useWorkoutStore(
      useShallow((state) => ({
        exerciseName: state.exercises[exerciseIndex].exercise.name,
        setsAmount: state.exercises[exerciseIndex].sets.length,
        addSet: state.addSet,
        removeExercise: state.removeExercise,
        moveExercise: state.moveExercise,
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

  return (
    <View>
      <View className="flex-1 flex-row items-center pl-4 pr-2">
        <Text variant="titleMedium" className="flex-1">
          {exerciseName}
        </Text>

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
}: {
  index: number;
  exerciseIndex: number;
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

  const { start: startRestCountdown } = useRestCountdownControl();

  // TODO: Read default weight unit from settings conext when undefined
  const selectedWeightUnit: WeightUnit =
    weightUnit === undefined ? "metric" : weightUnit;

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
          ? theme.colors.surfaceVariant
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
              style={{ textAlign: "center" }}
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

      <TouchableRipple
        onPress={() => {
          console.log("Pressed");
        }}
      >
        <Text
          variant="bodyMedium"
          className="w-24 py-2 rounded"
          style={{ textAlign: "center" }}
        >
          -
        </Text>
      </TouchableRipple>

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
      />

      <Checkbox
        status={completed ? "checked" : "unchecked"}
        onPress={toggleSetCompletionHandler}
      />
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
}: {
  value: number;
  onTextChange: (number: number) => void;
  unit: WorkoutFieldType;
  weightUnit: WeightUnit;
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
    setInternalValue(value);

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
      return [weightUnit === "metric" ? "km" : "m", false, false];
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
        style={{ backgroundColor: theme.colors.surfaceVariant }}
        onBlur={endEditing}
        ref={textInputRef}
      />
    </View>
  ) : (
    <Pressable onPress={startEditing} className="flex-1 py-2">
      <NativeText
        className="px-6 py-2 font-bold rounded"
        style={{
          backgroundColor: theme.colors.surfaceVariant,
          textAlign: "center",
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

const WeightUnitDialog = ({
  shown,
  exerciseIndex,
  onDismiss,
}: { shown: boolean; exerciseIndex: number; onDismiss: () => void }) => {
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
