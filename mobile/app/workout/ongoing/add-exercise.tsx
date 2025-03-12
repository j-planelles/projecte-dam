import { FlatList, View } from "react-native";
import Header from "../../../components/ui/Header";
import {
  Appbar,
  Button,
  Chip,
  List,
  Searchbar,
  useTheme,
} from "react-native-paper";
import { FilterIcon } from "../../../components/Icons";
import { useState } from "react";

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
export default function OngoingWorkoutAddExercisePage() {
  const theme = useTheme();
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  return (
    <View className="flex-1">
      <Header title="Add exercise">
        <Appbar.Action icon={({ color }) => <FilterIcon color={color} />} />
      </Header>

      <View className="px-4 py-2">
        <Searchbar
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Search exercises..."
        />
      </View>

      <FlatList
        data={SAMPLE_EXERCISES}
        keyExtractor={(item) =>
          item.uuid ? item.uuid : Math.random().toString()
        }
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            onPress={() =>
              item.uuid && selectedExercises.includes(item.uuid)
                ? setSelectedExercises((state) =>
                    state.filter((value) => value !== item.uuid),
                  )
                : setSelectedExercises((state) =>
                    item.uuid ? [...state, item.uuid] : state,
                  )
            }
            left={(props) =>
              item.uuid &&
              selectedExercises.includes(item.uuid) && (
                <List.Icon {...props} icon="check" />
              )
            }
            style={{
              backgroundColor:
                item.uuid && selectedExercises.includes(item.uuid)
                  ? theme.colors.primaryContainer
                  : "transparent",
            }}
          />
        )}
      />

      {selectedExercises.length > 0 && (
        <View className="px-4 py-2 gap-2">
          <View className="flex-row gap-2 flex-wrap">
            {selectedExercises.map((exerciseId) => {
              const exercise = SAMPLE_EXERCISES.filter(
                (item) => item.uuid === exerciseId,
              )[0];
              return <Chip key={exerciseId}>{exercise.name}</Chip>;
            })}
          </View>
          <Button mode="contained">
            {selectedExercises.length > 1
              ? `Add ${selectedExercises.length} exercises`
              : "Add exercise"}
          </Button>
        </View>
      )}
    </View>
  );
}
