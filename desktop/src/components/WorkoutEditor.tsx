import { v4 as uuidv4 } from "uuid";
import AddIcon from "@mui/icons-material/Add";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DeleteIcon from "@mui/icons-material/Delete";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputBase,
  Link,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Select,
  type SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import {
  kgToLbs,
  kmToMiles,
  lbsToKg,
  milesToKm,
} from "../lib/unitTransformers";
import { useWorkoutStore } from "../store/workout-store";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/auth-store";
import SearchField from "./SearchField";

export default function WorkoutEditor() {
  const [weightUnitDialogShown, setWeightUnitDialogShown] =
    useState<boolean>(false);
  const [weightUnitDialogIndex, setWeightUnitDialogIndex] = useState<number>(0);

  const showWeightUnitDialogHandler = (exerciseIndex: number) => () => {
    setWeightUnitDialogIndex(exerciseIndex);
    setWeightUnitDialogShown(true);
  };

  const [addExercisesDialogShown, setAddExercisesDialogShown] =
    useState<boolean>(false);

  const addExercisesDialogHandler = () => {
    setAddExercisesDialogShown(true);
  };

  return (
    <Box>
      <WorkoutInformation />
      <WorkoutExercises
        showWeightUnitDialog={showWeightUnitDialogHandler}
        showAddExercisesDialogHandler={addExercisesDialogHandler}
      />
      <WeightUnitDialog
        shown={weightUnitDialogShown}
        exerciseIndex={weightUnitDialogIndex}
        onDismiss={() => {
          setWeightUnitDialogShown(false);
        }}
      />
      <AddExerciseDialog
        shown={addExercisesDialogShown}
        onDismiss={() => setAddExercisesDialogShown(false)}
      />
    </Box>
  );
}

const WorkoutInformation = () => {
  const { title, description, setName, setDescription } = useWorkoutStore(
    useShallow((state) => ({
      title: state.title,
      description: state.description,
      setName: state.setName,
      setDescription: state.setDescription,
    })),
  );

  return (
    <Box className="flex flex-col gap-2">
      <TextField
        label="Name"
        value={title}
        variant="outlined"
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        variant="outlined"
      />
    </Box>
  );
};

const WorkoutExercises = ({
  showWeightUnitDialog,
  showAddExercisesDialogHandler,
}: {
  showWeightUnitDialog: (exerciseIndex: number) => () => void;
  showAddExercisesDialogHandler: () => void;
}) => {
  const exercisesAmount = useWorkoutStore((state) => state.exercises.length);
  return (
    <Box className="flex flex-col gap-4">
      {Array.from({ length: exercisesAmount }, (_, i) => i).map(
        (item, index) => (
          <WorkoutExercise
            key={index}
            index={index}
            isFirst={index === 0}
            isLast={index === exercisesAmount - 1}
            showWeightUnitDialog={showWeightUnitDialog(item)}
          />
        ),
      )}

      <Button
        className="w-full"
        startIcon={<AddIcon />}
        onClick={showAddExercisesDialogHandler}
        variant="outlined"
      >
        Add exercise
      </Button>
    </Box>
  );
};

const WorkoutExercise = ({
  index: exerciseIndex,
  isFirst = false,
  isLast = false,
  showWeightUnitDialog,
}: {
  index: number;
  isFirst: boolean;
  isLast: boolean;
  showWeightUnitDialog: () => void;
}) => {
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

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const addSetButtonHandler = () => {
    addSet(exerciseIndex);
  };

  const removeExerciseHandler = () => {
    setAnchorEl(null);

    removeExercise(exerciseIndex);
  };

  const moveExerciseUpHandler = () => {
    setAnchorEl(null);

    moveExercise(exerciseIndex, exerciseIndex - 1);
  };

  const moveExerciseDownHandler = () => {
    setAnchorEl(null);

    moveExercise(exerciseIndex, exerciseIndex + 1);
  };

  return (
    <Box className="flex flex-col mt-2">
      <Box className="flex flex-row items-center pl-4 pr-2">
        <Typography variant="body1" className="flex-1">
          {exerciseName}
        </Typography>

        <IconButton onClick={handleClick}>
          <MoreVertIcon />
        </IconButton>

        <Menu
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          anchorEl={anchorEl}
        >
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              showWeightUnitDialog();
            }}
          >
            <ListItemIcon>
              <FitnessCenterIcon />
            </ListItemIcon>
            <ListItemText>Change weight unit</ListItemText>
          </MenuItem>

          {!(isFirst && isLast) && <Divider />}

          {!isFirst && (
            <MenuItem onClick={moveExerciseUpHandler}>
              <ListItemIcon>
                <ArrowUpwardIcon />
              </ListItemIcon>
              <ListItemText>Move exercise up</ListItemText>
            </MenuItem>
          )}

          {!isLast && (
            <MenuItem onClick={moveExerciseDownHandler}>
              <ListItemIcon>
                <ArrowDownwardIcon />
              </ListItemIcon>
              <ListItemText>Move exercise down</ListItemText>
            </MenuItem>
          )}

          <Divider />

          <MenuItem onClick={removeExerciseHandler}>
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText>Remove exercise</ListItemText>
          </MenuItem>
        </Menu>
      </Box>

      {Array.from({ length: setsAmount }, (_, i) => i).map((setIndex) => (
        <WorkoutSet
          key={setIndex}
          index={setIndex}
          exerciseIndex={exerciseIndex}
        />
      ))}

      <Button startIcon={<AddIcon />} onClick={addSetButtonHandler}>
        Add set
      </Button>
    </Box>
  );
};

const WorkoutSet = ({
  index,
  exerciseIndex,
}: {
  index: number;
  exerciseIndex: number;
}) => {
  const {
    removeSet,
    reps,
    updateSetReps,
    weight,
    updateSetWeight,
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
      setType: state.exercises[exerciseIndex].sets[index].type,
      updateSetType: state.updateSetType,
      weightUnit: state.exercises[exerciseIndex].weightUnit,
      restCountdownDuration:
        state.exercises[exerciseIndex].restCountdownDuration,
      exerciseType: state.exercises[exerciseIndex].exercise.type,
    })),
  );

  const selectedWeightUnit: WeightUnit = !weightUnit ? "metric" : weightUnit;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const removeSetHandler = () => {
    setAnchorEl(null);

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

  const setTypeChangeFactory = (t: exerciseSet["type"]) => () => {
    setAnchorEl(null);

    updateSetType(exerciseIndex, index, t);
  };

  return (
    <Box className="flex flex-1 flex-row items-center px-2 gap-2">
      <Button
        onClick={handleClick}
        className="w-12 px-2 py-2 font-bold rounded"
      >
        {setType === "normal" ? index + 1 : setType === "dropset" ? "D" : "F"}
      </Button>
      <Menu
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
      >
        <MenuItem
          selected={setType === "normal"}
          onClick={setTypeChangeFactory("normal")}
        >
          <ListItemText>Normal</ListItemText>
        </MenuItem>
        <MenuItem
          selected={setType === "dropset"}
          onClick={setTypeChangeFactory("dropset")}
        >
          <ListItemText>Dropset</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={setTypeChangeFactory("failture")}
          selected={setType === "failture"}
        >
          <ListItemText>Failture</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={removeSetHandler}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText>Remove set</ListItemText>
        </MenuItem>
      </Menu>

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
    </Box>
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
  const textInputRef = useRef<HTMLInputElement>(null);
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
    <InputBase
      className="text-center flex-1 font-bold rounded"
      sx={(theme) => ({
        paddingX: "15px",
        fontSize: theme.typography.body2.fontSize,
        "& .MuiInputBase-input": {
          textAlign: "center",
        },
        "& input[type=number]::-webkit-outer-spin-button": {
          "-webkit-appearance": "none",
          margin: 0,
          appearance: "none",
        },
        "& input[type=number]::-webkit-inner-spin-button": {
          "-webkit-appearance": "none",
          margin: 0,
          appearance: "none",
        },
      })}
      value={internalValue}
      onChange={(e) => updateValues(e.target.value)}
      type="number"
      onBlur={endEditing}
      ref={textInputRef}
      autoFocus
    />
  ) : (
    <Button onClick={startEditing} className="flex-1" color="inherit">
      {`${
        displayAsTime
          ? formatAsTime()
          : displayAsNegative && externalValue !== 0
            ? `-${Number(externalValue.toFixed(2)).toString()}`
            : Number(externalValue.toFixed(2)).toString()
      } ${unitText}`}
    </Button>
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

  const [value, setValue] = useState<string>("default");
  const elements = {
    default: "Use user's default weight unit",
    metric: "Metric (kg)",
    imperial: "Imperial (lbs)",
  };

  const confirmHandler = () => {
    updateExerciseWeightUnit(
      exerciseIndex,
      value as workoutExercise["weightUnit"] & "default",
    );
    onDismiss();
  };

  const valueUpdateHandler = (event: SelectChangeEvent) => {
    setValue(event.target.value);
  };

  return (
    <Dialog open={shown} onClose={onDismiss} fullWidth>
      <DialogTitle>Change weight unit</DialogTitle>
      <DialogContent>
        <Select
          value={value}
          onChange={valueUpdateHandler}
          variant="outlined"
          className="w-full"
        >
          {Object.keys(elements).map((key) => (
            <MenuItem key={key} value={key}>
              {elements[key as workoutExercise["weightUnit"] & "default"]}
            </MenuItem>
          ))}
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={onDismiss}>Cancel</Button>
        <Button onClick={confirmHandler}>Done</Button>
      </DialogActions>
    </Dialog>
  );
};

const AddExerciseDialog = ({
  shown,
  onDismiss,
}: { shown: boolean; onDismiss: () => void }) => {
  const addExercises = useWorkoutStore((state) => state.addExercises);
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
              userNote: item.user_note,
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

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const confirmHandler = (exerciseUuid: string) => async () => {
    setIsLoading(true);
    try {
      const exercise = sortedExercises.filter(
        (item) => item.uuid === exerciseUuid,
      )[0];

      if (exercise.isDefault) {
        const exerciseUUID = uuidv4();
        await apiClient.post(
          "/user/exercises",
          {
            uuid: exerciseUUID,
            name: exercise.name,
            description: exercise.description,
            type: exercise.type,
            body_part: exercise.bodyPart,
            default_exercise_uuid: exercise.uuid,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        // userExercisesToAdd.push({ ...exercise, uuid: exerciseUUID });
        addExercises([
          { exercise: { ...exercise, uuid: exerciseUUID }, sets: [] },
        ]);
      } else {
        addExercises([{ exercise: exercise, sets: [] }]);
      }

      onDismiss();
    } catch (error: unknown) {
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={shown} onClose={onDismiss} fullWidth>
      <DialogTitle>Add Exercise</DialogTitle>
      <DialogContent>
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
              <SearchField
                value={searchTerm}
                onValueChange={(event) => {
                  setSearchTerm(event.target.value);
                }}
                placeholder="Search exercises"
                className="mb-2"
              />
              {sortedExercises
                .filter(
                  (exercise) =>
                    !searchTerm ||
                    exercise.name
                      .trim()
                      .toLowerCase()
                      .indexOf(searchTerm.trim().toLowerCase()) !== -1,
                )
                .map((exercise) => (
                  <ListItemButton
                    key={exercise.uuid}
                    onClick={confirmHandler(exercise.uuid)}
                  >
                    <ListItemText
                      primary={exercise.name}
                      secondary={exercise.description}
                    />
                  </ListItemButton>
                ))}
            </>
          ) : (
            <Box className="flex flex-col items-center gap-2">
              <FitnessCenterIcon sx={{ width: 180, height: 180 }} />
              <Typography variant="h4">No exercises found...</Typography>
            </Box>
          ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onDismiss}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};
