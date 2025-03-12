import { useEffect, useRef, useState } from "react";
import { FlatList, View } from "react-native";
import { Searchbar, Text, useTheme } from "react-native-paper";
import { PersonIcon, SendIcon } from "../../components/Icons";
import Header from "../../components/ui/Header";
import { SAMPLE_MESSAGES } from "../../lib/sampleData";

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
		scrollToEnd();
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
