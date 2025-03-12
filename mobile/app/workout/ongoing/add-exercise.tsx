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
import { SAMPLE_EXERCISES } from "../../../lib/sampleData";

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
