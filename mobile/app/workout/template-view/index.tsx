import WorkoutEditor from "../../../components/pages/WorkoutEditor";
import { View } from "react-native";
import { Appbar, Button } from "react-native-paper";
import Header from "../../../components/ui/Header";
import { EditIcon, SaveIcon, SearchIcon } from "../../../components/Icons";
import { useState } from "react";

const SAMPLE_WORKOUT: workout = {
  uuid: "c1be768f-4455-4b1d-ac6c-2ddf82e2a137",
  title: "Full Body Strength Training",
  timestamp: 1697001600,
  duration: 90,
  gym: "Planet Fitness",
  creator: "John Doe",
  description:
    "A comprehensive full-body workout focusing on building strength and endurance",
  exercises: [
    {
      exercise: {
        name: "Bench Press",
      },
      sets: [
        { reps: 8, weight: 135 },
        { reps: 8, weight: 135 },
        { reps: 8, weight: 135 },
      ],
    },
    {
      exercise: {
        name: "Pull-ups",
      },
      sets: [
        { reps: 10, weight: 0 },
        { reps: 8, weight: 0 },
        { reps: 6, weight: 0 },
      ],
    },
    {
      exercise: {
        name: "Dumbbell Squat",
      },
      sets: [
        { reps: 12, weight: 40 },
        { reps: 10, weight: 40 },
        { reps: 8, weight: 40 },
      ],
    },
    {
      exercise: {
        name: "Deadlift",
      },
      sets: [
        { reps: 6, weight: 185 },
        { reps: 6, weight: 185 },
        { reps: 4, weight: 185 },
      ],
    },
    {
      exercise: {
        name: "Bicep Curl",
      },
      sets: [
        { reps: 12, weight: 20 },
        { reps: 10, weight: 20 },
        { reps: 8, weight: 20 },
      ],
    },
    {
      exercise: {
        name: "Tricep Dip",
      },
      sets: [
        { reps: 15, weight: 0 },
        { reps: 12, weight: 0 },
        { reps: 10, weight: 0 },
      ],
    },
    {
      exercise: {
        name: "Plank",
      },
      sets: [
        { reps: 60, weight: 0 },
        { reps: 60, weight: 0 },
      ],
    },
    {
      exercise: {
        name: "Tricep Dip",
      },
      sets: [
        { reps: 15, weight: 0 },
        { reps: 12, weight: 0 },
        { reps: 10, weight: 0 },
      ],
    },
  ],
};
export default function CreateTemplatePage() {
  return (
    <View className="flex-1">
      <Header title="Create Template">
        <Appbar.Action
          icon={({ color }) =>
            <SaveIcon color={color} />
          }
          onPress={() => {}}
        />
      </Header>
      <WorkoutEditor
        workout={SAMPLE_WORKOUT}
        editable={true}
        timestamp={false}
        location={false}
        creator={false}
        completable={false}
      />
    </View>
  );
}
