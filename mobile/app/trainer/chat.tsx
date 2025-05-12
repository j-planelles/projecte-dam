import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from "react-native";
import { Searchbar, Text, useTheme } from "react-native-paper";
import { useShallow } from "zustand/react/shallow";
import { ChatIcon, PersonIcon, SendIcon } from "../../components/Icons";
import Header from "../../components/ui/Header";
import { ThemedView } from "../../components/ui/screen/Screen";
import { useAuthStore } from "../../store/auth-store";

export default function TrainerChatPage() {
  const queryClient = useQueryClient();
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );
  const { data } = useQuery({
    queryKey: ["user", "trainer", "/user/trainer/messages"],
    queryFn: async () =>
      await apiClient.get("/user/trainer/messages", {
        headers: { Authorization: `Bearer ${token}` },
      }),
  });
  const flatListRef = useRef<null | FlatList>(null);
  const [messageInput, setMessageInput] = useState<string>("");
  const [messages, setMessages] = useState<message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const scrollToEnd = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const refreshControlHandler = () => {
    setRefreshing(true);
    queryClient.invalidateQueries({
      queryKey: ["user", "trainer", "/user/trainer/messages"],
    });

    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleSubmit = async () => {
    if (messageInput) {
      setIsLoading(true);
      try {
        await apiClient.post("/user/trainer/messages", undefined, {
          queries: { content: messageInput },
          headers: { Authorization: `Bearer ${token}` },
        });

        setMessages((lastState) => [
          ...lastState,
          {
            content: messageInput,
            timestamp: Date.now(),
            sentByTrainer: false,
          },
        ]);

        setTimeout(scrollToEnd, 100);
        setMessageInput("");
      } catch (error: unknown) {
        console.error(error);
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (data) {
      setMessages(
        data.map(
          (item) =>
            ({
              content: item.content,
              timestamp: item.timestamp,
              sentByTrainer: item.is_sent_by_trainer,
            }) as message,
        ),
      );
    }
  }, [data]);

  return (
    <ThemedView className="flex-1">
      <Header title="Message Board" />
      <View className="flex-1">
        {!data ? (
          <ActivityIndicator />
        ) : (
          <>
            <FlatList
              data={messages}
              keyExtractor={(item) => item.timestamp}
              renderItem={({ item }) => <MessageBubble message={item} />}
              ref={flatListRef}
              onContentSizeChange={scrollToEnd}
              ListEmptyComponent={<MessagesListEmptyComponent />}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={refreshControlHandler}
                />
              }
            />
            <View className="px-4 py-4">
              <Searchbar
                placeholder="Type your message..."
                value={messageInput}
                onChangeText={setMessageInput}
                icon={(props) => <PersonIcon {...props} />}
                clearIcon={(props) => <SendIcon {...props} />}
                onClearIconPress={handleSubmit}
                returnKeyType="send"
                onPress={() => {
                  setTimeout(scrollToEnd, 100);
                }}
                onSubmitEditing={handleSubmit}
                editable={!isLoading}
              />
            </View>
          </>
        )}
      </View>
    </ThemedView>
  );
}

const MessageBubble = ({ message }: { message: message }) => {
  const theme = useTheme();
  return (
    <View
      className={`pt-2 px-4 flex-1 flex-row ${message.sentByTrainer ? "justify-start" : "justify-end"}`}
    >
      <View
        className={`px-4 py-2 w-auto rounded-t-3xl ${message.sentByTrainer ? "rounded-br-3xl rounded-bl-md" : "rounded-bl-3xl rounded-br-md"}`}
        style={{
          backgroundColor: message.sentByTrainer
            ? theme.colors.surfaceVariant
            : theme.colors.primaryContainer,
        }}
      >
        <Text
          style={{
            color: message.sentByTrainer
              ? theme.colors.onSurfaceVariant
              : theme.colors.onPrimaryContainer,
            textAlign: message.sentByTrainer ? "left" : "right",
          }}
          variant="bodyLarge"
        >
          {message.content}
        </Text>
      </View>
    </View>
  );
};

const MessagesListEmptyComponent = () => {
  const theme = useTheme();

  return (
    <View className="flex-1 items-center gap-8 pt-16">
      <ChatIcon size={96} color={theme.colors.onSurface} />
      <Text variant="headlineLarge">No messages...</Text>
    </View>
  );
};
