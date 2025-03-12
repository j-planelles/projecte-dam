import { Link, Stack, useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Button, Chip, MD3LightTheme } from "react-native-paper";
import { AddIcon, CheckIcon, NavigateNextIcon } from "../../components/Icons";
import { useEffect, useMemo, useState } from "react";
import { useUserRegistrationStore } from "../../store/registration-store";
import { useShallow } from "zustand/react/shallow";
import { useAuthStore } from "../../store/auth-store";
import Header from "../../components/ui/Header";

const MOCK_LIKES = [
  "CrossFit",
  "Weightlifting",
  "HIIT (High-Intensity Interval Training)",
  "Bodyweight Training",
  "Powerlifting",
  "Yoga",
  "Pilates",
  "Endurance Training",
  "Functional Training",
  "Mobility Work",
  "Strength Training",
  "Hypertrophy",
  "Olympic Lifting",
  "Kettlebell Workouts",
  "TRX Suspension Training",
  "Dance-Based Workouts",
  "Cycling",
  "Swimming",
  "Running",
  "Boot Camp",
  "Martial Arts",
  "Low-Impact Training",
  "Active Recovery",
  "Time-Efficient Workouts",
  "Mind-Body Connection",
  "Outdoor Adventures",
  "Team Sports",
  "Rehabilitation Focus",
  "Specialized Skills",
];

export default function RegisterLikesPage() {
  const router = useRouter();

  const { likes, addLike, removeLike, username } = useUserRegistrationStore(
    useShallow((state) => ({
      likes: state.likes,
      addLike: state.addLike,
      removeLike: state.removeLike,
      username: state.username // Temporal solution
    })),
  );
  const navigationDisabled = likes.length < 1;

  // Temporal solution
  const {setUsername, setToken} = useAuthStore(
    useShallow((state) => ({
      setUsername: state.setUsername,
      setToken: state.setToken
    })),
  );

  const checkClickHandler = (checkIndex: number) => {
    if (likes.includes(checkIndex)) {
      removeLike(checkIndex);
    } else {
      addLike(checkIndex);
    }
  };

  const handleSubmit = () => {
    console.log(likes.map((likeIndex) => MOCK_LIKES[likeIndex]))

    // Temporal solution
    setToken(username)
    setUsername(username)

    router.replace("/")
  }

  return (
    <View className="h-full">
      <Header title="Choose your likes"/>

      <ScrollView>
        <View className="flex-row flex-wrap p-4 gap-4">
          {MOCK_LIKES.map((item, index) => (
            <Chip
              key={index}
              icon={() =>
                likes.includes(index) ? (
                  <CheckIcon color={MD3LightTheme.colors.primary} />
                ) : (
                  <AddIcon color={MD3LightTheme.colors.primary} />
                )
              }
              selected={likes.includes(index)}
              showSelectedOverlay={true}
              onPress={() => checkClickHandler(index)}
            >
              {item}
            </Chip>
          ))}
        </View>
      </ScrollView>

      <View className="p-4 gap-4">
        {navigationDisabled && (
          <Text>Please select at least one interest.</Text>
        )}
        <Button
          className="w-full"
          icon={({color}) => (
            <NavigateNextIcon color={color} />
          )}
          disabled={navigationDisabled}
          mode="contained"
          onPress={handleSubmit}
        >
          Next
        </Button>
      </View>
    </View>
  );
}
