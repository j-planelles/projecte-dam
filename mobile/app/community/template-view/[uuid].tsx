import WorkoutEditor from "../../../components/pages/WorkoutEditor";
import { View } from "react-native";
import { Appbar, Button } from "react-native-paper";
import Header from "../../../components/ui/Header";
import { EditIcon, SaveIcon, SearchIcon } from "../../../components/Icons";
import { useState } from "react";
import { useRouter } from "expo-router";
import { SAMPLE_WORKOUTS } from "../../../lib/sampleData";

export default function ViewCommunityTemplatePage() {
  const router = useRouter();

  return (
    <View className="flex-1">
      <Header title="View Community Template" />
      <WorkoutEditor
        workout={SAMPLE_WORKOUTS[0]}
        editable={false}
        timestamp={false}
        location={false}
        completable={false}
      />

      <View className="p-4">
        <Button
          mode="contained"
          onPress={() => router.replace("/workout/template-view/antoino")}
        >
          Save template
        </Button>
      </View>
    </View>
  );
}
