import { ScrollView, View } from "react-native";
import { Divider, Text } from "react-native-paper";

export default function WorkoutViewer({
  workout,
  timestamp = true,
  location = true,
  creator = true,
}: {
  workout: workout;
  timestamp?: boolean;
  location?: boolean;
  creator?: boolean;
}) {
  return (
    <ScrollView>
      <View className="gap-4">
        <WorkoutInformation
          workout={workout}
          timestamp={timestamp}
          location={location}
          creator={creator}
        />
        <WorkoutExercises exercises={workout.exercises} />
      </View>
    </ScrollView>
  );
}

const WorkoutInformation = ({
  workout,
  timestamp,
  location,
  creator,
}: {
  workout: workout;
  timestamp: boolean;
  location: boolean;
  creator: boolean;
}) => {
  const timestampDate = new Date(workout.timestamp);
  const durationSeconds = Math.trunc(workout.duration % 60);
  const durationMinutes = Math.trunc(workout.duration / 60);
  const durationText = `${durationMinutes}:${String(durationSeconds).padStart(2, "0")}`;

  return (
    <View className="px-4 gap-2">
      <View>
        <Text variant="titleLarge">{workout.title}</Text>
        {creator && <Text variant="titleSmall">by {workout.creator}</Text>}
      </View>

      {workout.description && (
        <Text variant="bodyLarge">{workout.description}</Text>
      )}

      {timestamp && (
        <Text>{`${timestampDate.toLocaleString()} for ${durationText}`}</Text>
      )}

      {location && workout.gym && <Text>{workout.gym}</Text>}
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
          <WorkoutSet key={index} set={set} index={index} />
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

const WorkoutSet = ({
  set,
  index,
}: {
  set: exerciseSet;
  index: number;
}) => {
  return (
    <View className="flex-1 flex-row items-center py-2 px-4">
      <Text variant="bodyLarge" className="w-12 px-4">
        {set.type === "normal" ? index + 1 : set.type === "dropset" ? "D" : "F"}
      </Text>
      <Text variant="bodyLarge" className="flex-1 px-2">
        {set.weight} kg
      </Text>
      <Text variant="bodyLarge" className="flex-1 px-2">
        {set.reps} reps
      </Text>
    </View>
  );
};
