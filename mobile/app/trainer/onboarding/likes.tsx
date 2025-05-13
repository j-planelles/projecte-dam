import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { Button, Chip, HelperText, Text } from "react-native-paper";
import { useShallow } from "zustand/react/shallow";
import {
  AddIcon,
  CheckIcon,
  NavigateNextIcon,
} from "../../../components/Icons";
import Header from "../../../components/ui/Header";
import { ThemedView } from "../../../components/ui/screen/Screen";
import { useAuthStore } from "../../../store/auth-store";

export default function TrainerOnboardingLikesPage() {
  const router = useRouter();
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );
  const { data, isSuccess } = useQuery({
    queryKey: ["user", "/user/trainer/interests"],
    queryFn: async () =>
      await apiClient.get("/user/trainer/interests", {
        headers: { Authorization: `Bearer ${token}` },
      }),
  });

  const [likes, setLikes] = useState<string[]>([]);
  const navigationDisabled = likes.length < 1;

  const addLike = (newItem: string) => {
    setLikes((state) => [...state, newItem]);
  };

  const removeLike = (newItem: string) => {
    setLikes((state) => state.filter((item) => item !== newItem));
  };

  useEffect(() => {
    if (data) {
      setLikes(data.filter((item) => item.selected).map((item) => item.uuid));
    }
  }, [data]);

  const checkClickHandler = (newItem: string) => {
    if (likes.includes(newItem)) {
      removeLike(newItem);
    } else {
      addLike(newItem);
    }
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [queryError, setQueryError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    setQueryError(null);
    try {
      await apiClient.post("/user/trainer/interests", likes, {
        headers: { Authorization: `Bearer ${token}` },
      });

      router.push("/trainer/onboarding/list");
    } catch (error: unknown) {
      setQueryError(error?.message);
    }
    setIsLoading(false);
  };

  return (
    <ThemedView className="h-full">
      <Header title="Review your interests" />

      <ScrollView>
        <View className="flex-row flex-wrap p-4 gap-4">
          {isSuccess ? (
            data.map((item) => (
              <Chip
                key={item.uuid}
                icon={({ color }) =>
                  likes.includes(item.uuid) ? (
                    <CheckIcon color={color} />
                  ) : (
                    <AddIcon color={color} />
                  )
                }
                selected={likes.includes(item.uuid)}
                showSelectedOverlay={true}
                onPress={() => checkClickHandler(item.uuid)}
              >
                {item.name}
              </Chip>
            ))
          ) : (
            <View className="flex-1 justify-center">
              <ActivityIndicator size={"large"} />
            </View>
          )}
        </View>
      </ScrollView>

      <View className="p-4 gap-4">
        {queryError && <HelperText type="error">{queryError}</HelperText>}
        {navigationDisabled && (
          <Text>Please select at least one interest.</Text>
        )}
        <Text>
          Your interets will be used to help us search for your trainer.
        </Text>
        <Button
          className="w-full"
          icon={({ color }) => <NavigateNextIcon color={color} />}
          disabled={navigationDisabled || isLoading}
          mode="contained"
          onPress={handleSubmit}
        >
          Next
        </Button>
      </View>
    </ThemedView>
  );
}
