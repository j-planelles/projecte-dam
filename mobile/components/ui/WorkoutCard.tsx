import { View } from "react-native";
import { Text, Card, useTheme } from "react-native-paper";

export default function WorkoutCard({
  workout,
  onPress,
  className,
  showDescription = false,
  showTimestamp = true,
}: {
  workout?: workout;
  onPress?: () => any;
  className?: string;
  showDescription?: boolean;
  showTimestamp?: boolean;
}) {
  const theme = useTheme();

  const title: string =
    workout === undefined ? "Afternoon Workout" : workout.title;

  const timestampText: string =
    workout === undefined
      ? "Thursday 24th 2025, 5:30 PM"
      : parseTimestamp(workout.timestamp, workout.duration);

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
    <Card className={`${className}`} mode="outlined" onPress={onPress}>
      <Card.Content className="gap-2">
        <View>
          <Text variant="titleMedium">{title}</Text>
        </View>
        {showTimestamp && <Text>{timestampText}</Text>}
        {showDescription && description && <Text>{description}</Text>}
        <View>
          {exercises.map((exercise, index) => (
            <Text key={index}>{exercise}</Text>
          ))}
        </View>
      </Card.Content>
    </Card>
  );
}

const parseTimestamp = (timestamp: number, duration: number) => {
  const timestampDate = new Date(timestamp);
  const durationSeconds = Math.trunc(duration % 60);
  const durationMinutes = Math.trunc(duration / 60);
  const durationText = `${durationMinutes}:${String(durationSeconds).padStart(2, "0")}`;

  return `${timestampDate.toLocaleString()} for ${durationText}`;
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
