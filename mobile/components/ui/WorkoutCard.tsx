import { View, Text } from "react-native";
import { TouchableRipple, useTheme } from "react-native-paper";

export default function WorkoutCard({
  workout,
  onPress,
  className,
  showDescription = false,
  showCreator = false,
  showTimestamp = true,
}: {
  workout?: workout;
  onPress?: () => any;
  className?: string;
  showDescription?: boolean;
  showCreator?: boolean;
  showTimestamp?: boolean;
}) {
  const theme = useTheme();

  const title: string =
    workout === undefined ? "Afternoon Workout" : workout.title;

  const creator: string =
    workout === undefined ? "Jordi Planelles" : workout.creator;

  const timestampText: string =
    workout === undefined
      ? "Thursday 24th 2025, 5:30 PM @ Gym Vital"
      : parseTimestamp(workout.timestamp, workout.duration, workout.gym);

  const description: string =
    workout === undefined ? "Sample workout" : workout.description;

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
    <View
      className={`rounded ${className}`}
      style={{ backgroundColor: theme.colors.surfaceVariant }}
    >
      <TouchableRipple onPress={onPress}>
        <View className="p-4 gap-2">
          <View>
            <Text className="font-bold">{title}</Text>
            {showCreator && <Text>by {creator}</Text>}
          </View>
          {showTimestamp && <Text>{timestampText}</Text>}
          {showDescription && description && <Text>{description}</Text>}
          <View>
            {exercises.map((exercise, index) => (
              <Text key={index}>{exercise}</Text>
            ))}
          </View>
        </View>
      </TouchableRipple>
    </View>
  );
}

const parseTimestamp = (timestamp: number, duration: number, gym: string) => {
  const timestampDate = new Date(timestamp);
  const durationSeconds = Math.trunc(duration % 60);
  const durationMinutes = Math.trunc(duration / 60);
  const durationText = `${durationMinutes}:${String(durationSeconds).padStart(2, "0")}`;

  return `${timestampDate.toLocaleString()} for ${durationText} @ ${gym}`;
};

const parseExercises = (exercises: workoutExercise[]) => {
  if (exercises.length <= 4) {
    return exercises.map(
      (value) => `${value.sets.length}x ${value.exercise.name}`,
    );
  } else {
    return [
      ...exercises
        .slice(0, 3)
        .map((value) => `${value.sets.length}x ${value.exercise.name}`),
      `${exercises.slice(3).length} exercises more...`,
    ];
  }
};
