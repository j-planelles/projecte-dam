import { useState } from "react";
import { View } from "react-native";
import { Searchbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { FlatList } from "react-native";
import WorkoutCard from "../../components/ui/WorkoutCard";
import Header from "../../components/ui/Header";

const SAMPLE_WORKOUTS: workout[] = [
  {
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
    ],
  },
  {
    uuid: "efd04bdc-2997-4729-8442-5b9a106aa933",
    title: "Upper Body Strength",
    timestamp: 1697001600,
    duration: 75,
    gym: "Planet Fitness",
    creator: "John Doe",
    description: "Focus on building upper body strength and endurance",
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
          name: "Dumbbell Shoulder Press",
        },
        sets: [
          { reps: 10, weight: 30 },
          { reps: 8, weight: 30 },
          { reps: 6, weight: 30 },
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
    ],
  },
];

export default function CommunityTemplateSearchPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <View>
      <Header title="Search Templates" />
      <View className="gap-4 px-4 pt-4">
        <Searchbar
          placeholder="Search"
          value={searchTerm}
          onChangeText={setSearchTerm}
          className="flex-1"
        />

        <FlatList
          data={SAMPLE_WORKOUTS}
          keyExtractor={(item) => item.uuid}
          renderItem={({ item }) => (
            <WorkoutCard
              workout={item}
              className="mb-2"
              showDescription
              showCreator
              showTimestamp={false}
              onPress={() =>
                router.push(`/community/template-view/${item.uuid}`)
              }
            />
          )}
        />
      </View>
    </View>
  );
}
