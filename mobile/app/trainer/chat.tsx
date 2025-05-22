import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from "react-native";
import { Portal, Searchbar, Snackbar, Text, useTheme } from "react-native-paper";
import { useShallow } from "zustand/react/shallow";
import { ChatIcon, PersonIcon, SendIcon } from "../../components/Icons";
import Header from "../../components/ui/Header";
import { ThemedView } from "../../components/ui/screen/Screen";
import { handleError } from "../../lib/errorHandler";
import { useAuthStore } from "../../store/auth-store";

/**
 * Pàgina de xat amb l'entrenador.
 * Mostra el tauler de missatges, permet enviar missatges i refrescar la conversa.
 * @returns {JSX.Element} El component de la pàgina de xat amb l'entrenador.
 */
export default function TrainerChatPage() {
  const queryClient = useQueryClient();
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  // Consulta la llista de missatges amb l'entrenador
  const { data } = useQuery({
    queryKey: ["user", "trainer", "/user/trainer/messages"],
    queryFn: async () =>
      await apiClient.get("/user/trainer/messages", {
        headers: { Authorization: `Bearer ${token}` },
      }),
  });

  // Referència per fer scroll automàtic al final de la llista
  const flatListRef = useRef<null | FlatList>(null);

  // Estat per controlar el missatge a enviar, la llista de missatges, la càrrega i errors
  const [messageInput, setMessageInput] = useState<string>("");
  const [messages, setMessages] = useState<message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [queryError, setQueryError] = useState<string | null>(null);

  // Funció per fer scroll al final de la llista de missatges
  const scrollToEnd = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  // Estat i handler per refrescar la llista de missatges manualment
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

  /**
   * Handler per enviar un missatge al xat.
   * Desa el missatge a l'API i l'afegeix a la llista local.
   */
  const handleSubmit = async () => {
    setQueryError(null);
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
        setQueryError(handleError(error));
      }
      setIsLoading(false);
    }
  };

  /**
   * Actualitza la llista de missatges quan arriben dades noves de l'API.
   */
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
        {/* Mostra un indicador de càrrega si no hi ha dades */}
        {!data ? (
          <ActivityIndicator />
        ) : (
          <>
            {/* Llista de missatges */}
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
            {/* Input per escriure i enviar missatges */}
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
      {/* Snackbar per mostrar errors d'enviament */}
      <Portal>
        <Snackbar visible={!!queryError} onDismiss={() => setQueryError(null)}>
          {queryError}
        </Snackbar>
      </Portal>
    </ThemedView>
  );
}

/**
 * Bombolla de missatge individual.
 * Mostra el missatge alineat a la dreta o esquerra segons qui l'ha enviat.
 * @param message Missatge a mostrar.
 * @returns {JSX.Element} El component de bombolla de missatge.
 */
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

/**
 * Component que es mostra quan no hi ha missatges al xat.
 * @returns {JSX.Element} El component de llista buida.
 */
const MessagesListEmptyComponent = () => {
  const theme = useTheme();

  return (
    <View className="flex-1 items-center gap-8 pt-16">
      <ChatIcon size={96} color={theme.colors.onSurface} />
      <Text variant="headlineLarge">No messages...</Text>
    </View>
  );
};
