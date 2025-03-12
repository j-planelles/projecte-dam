import { useEffect, useRef, useState } from "react";
import { FlatList, View } from "react-native";
import { Searchbar, Text, useTheme } from "react-native-paper";
import { PersonIcon, SendIcon } from "../../components/Icons";
import Header from "../../components/ui/Header";

const SAMPLE_MESSAGES: message[] = [
  {
    uuid: "123e4567-e89b-12d3-a456-426655440000",
    text: "Hello, how are you?",
    sentByTrainer: true,
  },
  {
    uuid: "123e4567-e89b-12d3-a456-426655440001",
    text: "I'm good, thanks!",
    sentByTrainer: false,
  },
  {
    uuid: "123e4567-e89b-12d3-a456-426655440002",
    text: "What's up?",
    sentByTrainer: true,
  },
  {
    uuid: "123e4567-e89b-12d3-a456-426655440003",
    text: "Not much, just chillin'",
    sentByTrainer: false,
  },
  {
    uuid: "123e4567-e89b-12d3-a456-426655440004",
    text: "That sounds cool",
    sentByTrainer: true,
  },
  {
    uuid: "123e4567-e89b-12d3-a456-426655440005",
    text: "Yeah, it is",
    sentByTrainer: false,
  },
  {
    uuid: "123e4567-e89b-12d3-a456-426655440006",
    text: "Do you want to meet up?",
    sentByTrainer: true,
  },
  {
    uuid: "123e4567-e89b-12d3-a456-426655440007",
    text: "Maybe later",
    sentByTrainer: false,
  },
  {
    uuid: "123e4567-e89b-12d3-a456-426655440008",
    text: "Okay, sounds good",
    sentByTrainer: true,
  },
  {
    uuid: "123e4567-e89b-12d3-a456-426655440009",
    text: "I'll talk to you later",
    sentByTrainer: false,
  },
  {
    uuid: "123e4567-e89b-12d3-a456-426655440010",
    text: "Later!",
    sentByTrainer: true,
  },
  {
    uuid: "123e4567-e89b-12d3-a456-426655440011",
    text: "Hey, what's up?",
    sentByTrainer: false,
  },
  {
    uuid: "123e4567-e89b-12d3-a456-426655440012",
    text: "Not much, just got back from a run",
    sentByTrainer: true,
  },
  {
    uuid: "123e4567-e89b-12d3-a456-426655440013",
    text: "Nice! How was it?",
    sentByTrainer: false,
  },
  {
    uuid: "123e4567-e89b-12d3-a456-426655440014",
    text: "It was good, I needed the exercise",
    sentByTrainer: true,
  },
  {
    uuid: "123e4567-e89b-12d3-a456-426655440015",
    text: "Yeah, exercise is important",
    sentByTrainer: false,
  },
  {
    uuid: "123e4567-e89b-12d3-a456-426655440016",
    text: "Definitely, I feel more energized now",
    sentByTrainer: true,
  },
  {
    uuid: "123e4567-e89b-12d3-a456-426655440017",
    text: "That's great to hear",
    sentByTrainer: false,
  },
  {
    uuid: "123e4567-e89b-12d3-a456-426655440018",
    text: "Yeah, I'm feeling good",
    sentByTrainer: true,
  },
  {
    uuid: "123e4567-e89b-12d3-a456-426655440019",
    text: "I'm glad to hear that",
    sentByTrainer: false,
  },
  {
    uuid: "126e4567-e89b-12d3-a456-426655440019",
    text: "I'm glad to hear that",
    sentByTrainer: false,
  },
];

export default function TrainerChatPage() {
  const flatListRef = useRef<null | FlatList>(null);
  const [messageInput, setMessageInput] = useState<string>("");

  const scrollToEnd = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  const handleSubmit = () => {
    scrollToEnd();
    console.log(messageInput);
    setMessageInput("");
  };

  useEffect(() => {
    scrollToEnd()
  }, [flatListRef]);

  return (
    <View className="flex-1">
      <Header title="Trainer Chat" />
      <View className="flex-1">
        <FlatList
          data={SAMPLE_MESSAGES}
          keyExtractor={(item) => item.uuid}
          renderItem={({ item }) => <MessageBubble message={item} />}
          ref={flatListRef}
        />
        <View className="px-4 py-4">
          <Searchbar
            placeholder="Message Jordi..."
            value={messageInput}
            onChangeText={setMessageInput}
            icon={({ color }) => <PersonIcon color={color} />}
            clearIcon={({ color }) => <SendIcon color={color} />}
            onClearIconPress={handleSubmit}
            returnKeyType="send"
            onPress={() => {
              setTimeout(scrollToEnd, 100);
            }}
            onSubmitEditing={handleSubmit}
          />
        </View>
      </View>
    </View>
  );
}

const MessageBubble = ({ message }: { message: message }) => {
  const theme = useTheme();
  return (
    <View className="pt-4 px-4">
      <View
        className={`px-4 py-2 rounded-t-3xl ${message.sentByTrainer ? "rounded-br-3xl rounded-bl-md" : "rounded-bl-3xl rounded-br-md"}`}
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
          {message.text}
        </Text>
      </View>
    </View>
  );
};
