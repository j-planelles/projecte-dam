import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { Appbar, IconButton, TextInput } from "react-native-paper";
import { SaveIcon } from "../../../components/Icons";
import ChoiceBox from "../../../components/ui/ChoiceBox";
import Header from "../../../components/ui/Header";

export default function ExerciseEditPage() {
  const { uuid } = useLocalSearchParams();
  const router = useRouter();

  const [exerciseName, setExerciseName] = useState("");
  const [exerciseDescription, setExerciseDescription] = useState("");

  return (
    <>
      <Header
        title={uuid === undefined ? "Create exercise" : "Modify exercise"}
      >
        <Appbar.Action icon={({ color }) => <SaveIcon color={color} />} />
      </Header>

      <View className="gap-4 px-2">
        <TextInput
          mode="outlined"
          label="Name"
          placeholder="Chest Press"
          value={exerciseName}
          onChangeText={setExerciseName}
        />

        <ChoiceBox
          label="Type"
          elements={["Barbell", "Dumbbell"]}
          mode="outlined"
        />
        <ChoiceBox
          label="Body Part"
          elements={["Chest", "Arms", "Back"]}
          mode="outlined"
        />

        <TextInput
          mode="outlined"
          label="Description"
          value={exerciseDescription}
          onChangeText={setExerciseDescription}
          multiline
        />
      </View>
    </>
  );
}
