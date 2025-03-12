import { Link, Stack, useRouter } from "expo-router";
import { FlatList, Pressable, View } from "react-native";
import { Appbar, IconButton, List } from "react-native-paper";
import { AddIcon } from "../../components/Icons";
import Header from "../../components/ui/Header";

const SAMPLE_EXERCISES: exercise[] = [
  { uuid: "123e4567-e89b-12d3-a456-426614174000", name: "Bench Press" },
  { uuid: "123e4567-e89b-12d3-a456-426614174001", name: "Squats" },
  { uuid: "123e4567-e89b-12d3-a456-426614174002", name: "Lunges" },
  { uuid: "123e4567-e89b-12d3-a456-426614174003", name: "Deadlifts" },
  { uuid: "123e4567-e89b-12d3-a456-426614174004", name: "Bicep Curls" },
  { uuid: "123e4567-e89b-12d3-a456-426614174005", name: "Tricep Dips" },
  { uuid: "123e4567-e89b-12d3-a456-426614174006", name: "Shoulder Press" },
  { uuid: "123e4567-e89b-12d3-a456-426614174007", name: "Leg Press" },
  { uuid: "123e4567-e89b-12d3-a456-426614174008", name: "Chest Fly" },
  { uuid: "123e4567-e89b-12d3-a456-426614174009", name: "Lat Pulldowns" },
  { uuid: "123e4567-e89b-12d3-a456-426614174010", name: "Rowing Exercise" },
  { uuid: "123e4567-e89b-12d3-a456-426614174011", name: "Shoulder Rotations" },
  { uuid: "123e4567-e89b-12d3-a456-426614174012", name: "Wrist Curls" },
  { uuid: "123e4567-e89b-12d3-a456-426614174013", name: "Calf Raises" },
  { uuid: "123e4567-e89b-12d3-a456-426614174014", name: "Russian Twists" },
  { uuid: "123e4567-e89b-12d3-a456-426614174015", name: "Leg Extensions" },
  { uuid: "123e4567-e89b-12d3-a456-426614174016", name: "Leg Curls" },
  { uuid: "123e4567-e89b-12d3-a456-426614174017", name: "Chest Press" },
  { uuid: "123e4567-e89b-12d3-a456-426614174018", name: "Seated Row" },
  { uuid: "123e4567-e89b-12d3-a456-426614174019", name: "Face Pulls" },
];

export default function ExerciseListPage() {
  const router = useRouter();

  return (
    <View className="flex-1">
      <Header title="Manage Exercises">
        <Appbar.Action
          icon={({ color }) => <AddIcon color={color} />}
          onPress={() => {
            router.push("/workout/exercise-edit/");
          }}
        />
      </Header>
        <FlatList
          data={SAMPLE_EXERCISES}
          keyExtractor={(item) =>
            item.uuid === undefined ? Math.random().toString() : item.uuid
          }
          renderItem={({ item }) => (
            <Link asChild href={`/workout/exercise-edit/${item.uuid}`}>
              <List.Item title={item.name} />
            </Link>
          )}
        />
    </View>
  );
}
