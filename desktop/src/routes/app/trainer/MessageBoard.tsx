import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  CircularProgress,
  Container,
  IconButton,
  InputBase,
  Snackbar,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { useShallow } from "zustand/react/shallow";
import { handleError } from "../../../lib/errorHandler";
import { useAuthStore } from "../../../store/auth-store";

/**
 * Pàgina de xat entre entrenador i usuari.
 * Mostra la llista de missatges i permet enviar-ne de nous.
 * @returns {JSX.Element} El component de la pàgina de xat d'entrenador.
 */
export default function TrainerMessageBoardPage() {
  const { "user-uuid": userUuid } = useParams();
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  // Consulta la llista de missatges entre entrenador i usuari
  const { data } = useQuery({
    queryKey: [
      "user",
      "trainer",
      userUuid,
      "/trainer/users/:user_uuid/messages",
    ],
    queryFn: async () =>
      await apiClient.get("/trainer/users/:user_uuid/messages", {
        params: { user_uuid: userUuid ? userUuid : "" },
        headers: { Authorization: `Bearer ${token}` },
      }),
  });

  // Estat local per gestionar missatges, input, càrrega i errors
  const [messages, setMessages] = useState<message[]>([]);
  const [messageInput, setMessageInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [queryError, setQueryError] = useState<string | null>(null);

  // Actualitza la llista de missatges quan arriben dades noves de l'API
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

  /**
   * Handler per enviar un missatge al xat.
   * Desa el missatge a l'API i l'afegeix a la llista local.
   */
  const handleSubmit = async () => {
    setQueryError(null);
    if (messageInput) {
      setIsLoading(true);
      try {
        await apiClient.post("/trainer/users/:user_uuid/messages", undefined, {
          params: { user_uuid: userUuid ? userUuid : "" },
          queries: { content: messageInput },
          headers: { Authorization: `Bearer ${token}` },
        });

        setMessages((lastState) => [
          ...lastState,
          {
            content: messageInput,
            timestamp: Date.now(),
            sentByTrainer: true,
          },
        ]);

        setMessageInput("");
      } catch (error: unknown) {
        setQueryError(handleError(error));
      }
      setIsLoading(false);
    }
  };

  return (
    <Container className="flex flex-1 flex-col h-full gap-2">
      {/* Mostra la llista de missatges o un missatge si no n'hi ha */}
      {data ? (
        <>
          {messages.length > 0 ? (
            <MessageList messages={messages} />
          ) : (
            <Box className="flex flex-1 justify-center">
              <Typography>No messages</Typography>
            </Box>
          )}
          {/* Input per escriure i enviar missatges */}
          <Box className="flex-none">
            <Box
              className="flex flex-grow px-4 py-2 rounded-full items-center"
              sx={{
                backgroundColor: "secondaryContainer.main",
                color: "onSecondaryContainer.main",
              }}
            >
              <InputBase
                value={messageInput}
                onChange={(event) => setMessageInput(event.target.value)}
                placeholder="Type a message..."
                className="flex-grow py-1 ml-2"
                disabled={isLoading}
              />
              {messageInput && (
                <>
                  <IconButton
                    onClick={() => setMessageInput("")}
                    disabled={isLoading}
                  >
                    <CloseIcon color="inherit" />
                  </IconButton>
                  <IconButton onClick={handleSubmit} disabled={isLoading}>
                    <SendIcon color="inherit" />
                  </IconButton>
                </>
              )}
            </Box>
          </Box>
        </>
      ) : (
        <Box className="flex items-center justify-center">
          <CircularProgress />
        </Box>
      )}
      {/* Snackbar per mostrar errors d'enviament */}
      <Snackbar
        open={!!queryError}
        onClose={() => setQueryError(null)}
        message={queryError}
      />
    </Container>
  );
}

/**
 * Llista de missatges del xat.
 * Fa scroll automàtic al final quan s'afegeix un missatge nou.
 * @param messages Llista de missatges a mostrar.
 */
const MessageList = ({ messages }: { messages: message[] }) => {
  const messagesRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Box ref={messagesRef} className="flex-1 overflow-scroll">
      {messages.map((message) => (
        <MessageBubble key={message.timestamp} message={message} />
      ))}
    </Box>
  );
};

/**
 * Bombolla de missatge individual.
 * Mostra el missatge alineat a la dreta o esquerra segons qui l'ha enviat.
 * @param message Missatge a mostrar.
 */
const MessageBubble = ({ message }: { message: message }) => {
  return (
    <Box
      className={`pt-2 px-4 flex flex-1 flex-row ${!message.sentByTrainer ? "justify-start" : "justify-end"}`}
    >
      <Box
        className={`px-4 py-2 w-auto rounded-t-3xl ${!message.sentByTrainer ? "rounded-br-3xl rounded-bl-md" : "rounded-bl-3xl rounded-br-md"}`}
        sx={{
          backgroundColor: !message.sentByTrainer
            ? "surfaceVariant.main"
            : "primaryContainer.main",
        }}
      >
        <Typography
          sx={{
            color: !message.sentByTrainer
              ? "onSurfaceVariant.main"
              : "onPrimaryContainer.main",
            textAlign: !message.sentByTrainer ? "left" : "right",
          }}
        >
          {message.content}
        </Typography>
      </Box>
    </Box>
  );
};
