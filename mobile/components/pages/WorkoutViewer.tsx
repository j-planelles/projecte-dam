import { ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import { kgToLbs, kmToMiles } from "../../lib/unitTransformers";

export default function WorkoutViewer({
  workout,
  timestamp = true,
}: {
  workout: workout;
  timestamp?: boolean;
}) {
  return (
    <ScrollView>
      <View className="gap-4">
        <WorkoutInformation workout={workout} timestamp={timestamp} />
        <WorkoutExercises exercises={workout.exercises} />
      </View>
    </ScrollView>
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
    <View className="px-4 gap-2">
      <View>
        <Text variant="titleLarge">{workout.title}</Text>
      </View>

      {workout.description && (
        <Text variant="bodyLarge">{workout.description}</Text>
      )}

      {timestamp && (
        <Text>{`${timestampDate.toLocaleString()} for ${durationText}`}</Text>
      )}
    </View>
  );
};

const WorkoutExercises = ({
  exercises,
}: {
  exercises: workoutExercise[];
}) => {
  return (
    <View className="gap-4">
      {exercises.map((exercise, index) => (
        <WorkoutExercise key={index} exercise={exercise} />
      ))}
    </View>
  );
};

const WorkoutExercise = ({
  exercise,
}: {
  exercise: workoutExercise;
}) => {
  return (
    <View className="gap-2">
      <View className="flex-1 flex-row items-center px-4">
        <Text variant="titleMedium" className="flex-1">
          {exercise.exercise.name}
        </Text>
      </View>

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
    <View className="flex-1 flex-row items-center py-2 px-4">
      <Text variant="bodyLarge" className="w-12 px-4">
        {set.type === "normal" ? index + 1 : set.type === "dropset" ? "D" : "F"}
      </Text>
      {exerciseType !== "duration" &&
        exerciseType !== "countdown" &&
        exerciseType !== "reps-only" && (
          <Text variant="bodyLarge" className="flex-1 px-2">
            {exerciseType === "cardio"
              ? weightUnit === "imperial"
                ? `${Number(kmToMiles(set.weight).toFixed(2))} mi`
                : `${set.weight} km`
              : exerciseType === "assisted-bodyweight"
                ? "assisted-weight"
                : weightUnit === "imperial"
                  ? `${Number(kgToLbs(set.weight).toFixed(2))} lbs`
                  : `${set.weight} kg`}
          </Text>
        )}
      <Text variant="bodyLarge" className="flex-1 px-2">
        {exerciseType === "cardio" ||
        exerciseType === "duration" ||
        exerciseType === "countdown"
          ? formatAsTime(set.reps)
          : `${set.reps} reps`}
      </Text>
    </View>
  );
};
