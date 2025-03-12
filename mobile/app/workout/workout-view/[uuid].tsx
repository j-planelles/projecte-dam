import WorkoutEditor from "../../../components/pages/WorkoutEditor";
import { View } from "react-native";
import { Button } from "react-native-paper";
import Header from "../../../components/ui/Header";
import { SAMPLE_WORKOUTS } from "../../../lib/sampleData";

export default function ViewWorkoutPage() {
  return (
    <View className="flex-1">
      <Header title="View Workout" />
      <WorkoutEditor workout={SAMPLE_WORKOUTS[0]} />

      <View className="p-4">
        <Button mode="contained">Save as template</Button>
      </View>
    </View>
  );
}
