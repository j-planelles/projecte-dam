import { Box, Typography } from "@mui/material";
import { kgToLbs, kmToMiles } from "../lib/unitTransformers";

export default function WorkoutViewer({
  workout,
  timestamp = true,
}: {
  workout: workout;
  timestamp?: boolean;
}) {
  return (
    <Box>
      <WorkoutInformation workout={workout} timestamp={timestamp} />
      <WorkoutExercises exercises={workout.exercises} />
    </Box>
  );
}

const WorkoutInformation = ({
  workout,
  timestamp,
}: {
  workout: workout;
  timestamp: boolean;
}) => {
  const timestampDate = new Date(workout.timestamp);
  const durationSeconds = Math.trunc(workout.duration % 60);
  const durationMinutes = Math.trunc(workout.duration / 60);
  const durationText = `${durationMinutes}:${String(durationSeconds).padStart(2, "0")}`;

  return (
    <Box className="flex flex-col gap-2">
      <Box>
        <Typography variant="h3">{workout.title}</Typography>
      </Box>

      {workout.description && (
        <Typography variant="h6">{workout.description}</Typography>
      )}

      <Box>
        {timestamp && (
          <Typography variant="body1">
            {`${timestampDate.toLocaleString()} for ${durationText}`}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

const WorkoutExercises = ({
  exercises,
}: {
  exercises: workoutExercise[];
}) => {
  return (
    <Box>
      {exercises.map((exercise, index) => (
        <WorkoutExercise key={index} exercise={exercise} />
      ))}
    </Box>
  );
};

const WorkoutExercise = ({
  exercise,
}: {
  exercise: workoutExercise;
}) => {
  return (
    <Box className="flex flex-col">
      <Typography className="py-2">{exercise.exercise.name}</Typography>

      {exercise.sets.length > 0 ? (
        exercise.sets.map((set, index) => (
          <WorkoutSet
            key={index}
            set={set}
            index={index}
            exerciseType={exercise.exercise.type}
            weightUnit={exercise.weightUnit}
          />
        ))
      ) : (
        <Typography
          className="flex-1 px-4"
          style={{ textAlign: "center" }}
          variant="body2"
        >
          Exercise without sets.
        </Typography>
      )}
    </Box>
  );
};

const formatAsTime = (externalValue: number) => {
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

const WorkoutSet = ({
  set,
  index,
  exerciseType,
  weightUnit = "metric",
}: {
  set: exerciseSet;
  index: number;
  exerciseType: exercise["type"];
  weightUnit?: WeightUnit;
}) => {
  return (
    <Box className="flex flex-1 flex-row items-center py-2">
      <Typography className="w-12 px-4" sx={{ color: "text.secondary" }}>
        {set.type === "normal" ? index + 1 : set.type === "dropset" ? "D" : "F"}
      </Typography>
      {exerciseType !== "duration" &&
        exerciseType !== "countdown" &&
        exerciseType !== "reps-only" && (
          <Typography className="flex-1 px-2">
            {exerciseType === "cardio"
              ? weightUnit === "imperial"
                ? `${Number(kmToMiles(set.weight).toFixed(2))} mi`
                : `${set.weight} km`
              : exerciseType === "assisted-bodyweight"
                ? "assisted-weight"
                : weightUnit === "imperial"
                  ? `${Number(kgToLbs(set.weight).toFixed(2))} lbs`
                  : `${set.weight} kg`}
          </Typography>
        )}
      <Typography className="flex-1 px-2">
        {exerciseType === "cardio" ||
        exerciseType === "duration" ||
        exerciseType === "countdown"
          ? formatAsTime(set.reps)
          : `${set.reps} reps`}
      </Typography>
    </Box>
  );
};
