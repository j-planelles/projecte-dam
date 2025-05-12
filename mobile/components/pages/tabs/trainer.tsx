import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Image, RefreshControl, View } from "react-native";
import { Avatar, Button, IconButton, Text, useTheme } from "react-native-paper";
import { useShallow } from "zustand/react/shallow";
import TrainerImage from "../../../assets/trainer-enroll.jpg";
import { useAuthStore } from "../../../store/auth-store";
import {
  DumbellIcon,
  MessagesIcon,
  MoreVerticalIcon,
  NavigateNextIcon,
} from "../../Icons";
import WorkoutCard from "../../ui/WorkoutCard";
import HomeTabsScreen from "../../ui/screen/HomeTabsScreen";

export default function TrainerTab() {
  const queryClient = useQueryClient();
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  const requestQuery = useQuery({
    queryKey: ["user", "trainer", "/user/trainer/status"],
    queryFn: async () =>
      await apiClient.get("/user/trainer/status", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    retry: false,
  });
  const infoQuery = useQuery({
    queryKey: ["user", "trainer", "/user/trainer/info"],
    queryFn: async () =>
      await apiClient.get("/user/trainer/info", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    retry: false,
  });

  const isLoading = infoQuery.isLoading || requestQuery.isLoading;
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const refreshControlHandler = () => {
    setRefreshing(true);
    queryClient.invalidateQueries({ queryKey: ["user", "trainer"] });

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  return (
    <HomeTabsScreen
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refreshControlHandler}
        />
      }
    >
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : infoQuery.isSuccess ? (
        <>
          <Text variant="headlineLarge">Personal Trianer</Text>
          <ProfilePictureHeader fullName={infoQuery.data.full_name} />
          <View className="flex-1 flex-row items-center">
            <Link href="/trainer/chat" asChild>
              <Button
                icon={({ color }) => <MessagesIcon color={color} />}
                mode="contained"
                className="flex-1"
              >
                Message Board
              </Button>
            </Link>
          </View>
          <TrainerTemplatesList />
        </>
      ) : (
        <>
          <Text variant="headlineLarge">Personal Trianer</Text>
          <Image
            source={TrainerImage}
            className="flex-1 w-full h-full rounded-[24px]"
            style={{ height: 200 }}
            resizeMode="cover"
          />
          <Text variant="bodySmall">Photo by Michael DeMoya on Unsplash</Text>
          <Text variant="bodyMedium">
            Unleash your potential and sculpt your dream body with a
            personalized fitness journey guided by our expert gym trainer
            service.
          </Text>
          {requestQuery.isSuccess ? (
            <>
              <ProfilePictureHeader fullName={requestQuery.data.full_name} />
              <View className="flex-row items-center gap-4 justify-center">
                <ActivityIndicator size="large" />
                <Text variant="titleSmall">
                  {requestQuery.data.full_name.split(" ")[0]} is reviewing your
                  application...
                </Text>
              </View>
            </>
          ) : (
            <Link asChild href="/trainer/onboarding/likes">
              <Button
                mode="contained"
                icon={({ color }) => <NavigateNextIcon color={color} />}
              >
                Enroll
              </Button>
            </Link>
          )}
        </>
      )}
    </HomeTabsScreen>
  );
}

const TrainerTemplatesList = () => {
  const theme = useTheme();
  const router = useRouter();
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );
  const { data, isLoading, isSuccess, error } = useQuery({
    queryKey: ["user", "trainer", "/user/trainer/recommendation"],
    queryFn: async () =>
      await apiClient.get("/user/trainer/recommendation", {
        headers: { Authorization: `Bearer ${token}` },
      }),
  });

  return (
    <>
      <Text className="flex-1 text-lg font-bold">Suggested by trainer</Text>

      {isLoading && (
        <View>
          <ActivityIndicator size={"large"} />
        </View>
      )}
      {error && (
        <View>
          <Text>{error.message}</Text>
        </View>
      )}
      {isSuccess &&
        (data.length > 0 ? (
          data
            .map(
              (data) =>
                ({
                  uuid: data.uuid,
                  title: data.name,
                  description: data.description,
                  timestamp: data.instance?.timestamp_start || 0,
                  duration: data.instance?.duration || 0,
                  exercises: data.entries.map((entry) => ({
                    restCountdownDuration: entry.rest_countdown_duration,
                    weightUnit: entry.weight_unit,
                    exercise: {
                      uuid: entry.exercise.uuid,
                      name: entry.exercise.name,
                      description: entry.exercise.description,
                      userNote: entry.exercise.user_note,
                      bodyPart: entry.exercise.body_part,
                      type: entry.exercise.type,
                    },
                    sets: entry.sets.map((set) => ({
                      reps: set.reps,
                      weight: set.weight,
                    })),
                  })),
                }) as workout,
            )
            .map((workout) => (
              <WorkoutCard
                key={workout.uuid}
                workout={workout}
                showTimestamp={false}
                showDescription={true}
                onPress={() =>
                  router.push(`/community/template-view/${workout.uuid}`)
                }
              />
            ))
        ) : (
          <View className="flex-1 items-center gap-8 pt-16">
            <DumbellIcon size={130} color={theme.colors.onSurface} />
            <View className="gap-4 items-center">
              <Text variant="headlineLarge">No templates found.</Text>
              <Text variant="bodyMedium">
                Wait for your trainer to recommend you a template.
              </Text>
            </View>
          </View>
        ))}
    </>
  );
};

const ProfilePictureHeader = ({ fullName }: { fullName: string }) => {
  const profilePicturePlaceholder = fullName.charAt(0).toUpperCase();

  return (
    <View className="flex-1 flex-row items-center gap-4">
      <Avatar.Text size={48} label={profilePicturePlaceholder} />
      <View className="flex-1">
        <Text className="text-xl font-bold">{fullName}</Text>
      </View>
      <Link asChild href="/settings/trainer">
        <IconButton
          icon={(props) => <MoreVerticalIcon {...props} />}
          style={{ margin: 0 }}
        />
      </Link>
    </View>
  );
};
