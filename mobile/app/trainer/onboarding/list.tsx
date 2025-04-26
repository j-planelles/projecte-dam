import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { Avatar, Button, HelperText, List, Text } from "react-native-paper";
import { useShallow } from "zustand/react/shallow";
import { NavigateNextIcon } from "../../../components/Icons";
import Header from "../../../components/ui/Header";
import { ThemedView } from "../../../components/ui/screen/Screen";
import { useAuthStore } from "../../../store/auth-store";

export default function TrainerOnboardingListPage() {
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );
  const { data, isLoading, isSuccess, error } = useQuery({
    queryKey: ["user", "trainer", "/user/trainer/search"],
    queryFn: async () =>
      await apiClient.get("/user/trainer/search", {
        headers: { Authorization: `Bearer ${token}` },
      }),
  });

  return (
    <ThemedView className="flex-1">
      <Header title="Choose your trainer" />

      {error && <HelperText type="error">{error.message}</HelperText>}

      {isLoading && <ActivityIndicator size="large" />}

      {isSuccess && <TrainerList data={data} />}
    </ThemedView>
  );
}

const TrainerList = ({ data }: { data: any }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [selectedTrainer, setSelectedTrainer] = useState<string>("");
  const navigationDisabled = selectedTrainer === "" || isLoading;

  const handleSubmit = async () => {
    setIsLoading(true);
    setQueryError(null);
    try {
      await apiClient.post("/user/trainer/request", undefined, {
        queries: { trainer_uuid: selectedTrainer },
        headers: { Authorization: `Bearer ${token}` },
      });
      queryClient.invalidateQueries({ queryKey: ["user", "trainer"] });
      router.push("/");
    } catch (error: any) {
      if (error instanceof AxiosError) {
        setQueryError(`${error?.request?.status} ${error?.request?.response}.`);
      } else {
        setQueryError(`${error?.message}`);
        console.error(error.message);
      }
    }
    setIsLoading(false);
  };
  return (
    <>
      <FlatList
        data={data}
        keyExtractor={(item) => item.uuid}
        renderItem={({ item }) => (
          <List.Item
            title={item.full_name}
            description={item.biography}
            left={() => (
              <View className="pl-4">
                {selectedTrainer === item.uuid ? (
                  <Avatar.Icon size={48} icon="check" />
                ) : (
                  <Avatar.Text
                    size={48}
                    label={item.full_name.charAt(0).toUpperCase()}
                  />
                )}
              </View>
            )}
            onPress={() =>
              selectedTrainer === item.uuid
                ? setSelectedTrainer("")
                : setSelectedTrainer(item.uuid)
            }
          />
        )}
      />

      <View className="p-4 gap-4">
        {navigationDisabled && <Text>Please select a trainer.</Text>}
        {queryError && <HelperText type="error">{queryError}</HelperText>}
        <Button
          className="w-full"
          icon={({ color }) => <NavigateNextIcon color={color} />}
          disabled={navigationDisabled}
          mode="contained"
          onPress={handleSubmit}
        >
          Next
        </Button>
      </View>
    </>
  );
};
