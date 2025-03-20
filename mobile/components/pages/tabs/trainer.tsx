import { Link, useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import { Avatar, Button, Text } from "react-native-paper";
import { MessagesIcon, MoreVerticalIcon, NavigateNextIcon } from "../../Icons";
import WorkoutCard from "../../ui/WorkoutCard";
import HomeTabsScreen from "../../ui/screen/HomeTabsScreen";

export default function TrainerTab() {
	const IS_TRIANER_ONBOARDED = true;
	const TRAINER_AWKNOLEDGED = true;

	return (
		<HomeTabsScreen>
			{IS_TRIANER_ONBOARDED && TRAINER_AWKNOLEDGED ? (
				<>
					<Text variant="headlineLarge">Personal Trianer</Text>
					<ProfilePictureHeader />
					<View className="flex-1 flex-row items-center">
						<Link href="/trainer/chat" asChild>
							<Button
								icon={({ color }) => <MessagesIcon color={color} />}
								mode="contained"
								className="flex-1"
							>
								Chat with Jordi
							</Button>
						</Link>
					</View>
					<TrainerTemplatesList />
				</>
			) : (
				<>
					<Text variant="headlineLarge">Personal Trianer</Text>
					<Text variant="bodyMedium">
						Unleash your potential and sculpt your dream body with a
						personalized fitness journey guided by our expert gym trainer
						service.
					</Text>
					{IS_TRIANER_ONBOARDED ? (
						<>
							<ProfilePictureHeader />
							<View className="flex-row items-center gap-4 justify-center">
								<ActivityIndicator size="large" />
								<Text variant="titleSmall">
									Jordi is reviewing your application...
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
	const router = useRouter();
	return (
		<>
			<Text className="flex-1 text-lg font-bold">Suggested by trainer</Text>

			<WorkoutCard
				onPress={() => router.push(`/community/template-view/antoino`)}
			/>
		</>
	);
};

const ProfilePictureHeader = () => {
	return (
		<View className="flex-1 flex-row items-center gap-4">
			<Avatar.Text size={48} label="J" />
			<View className="flex-1">
				<Text className="text-xl font-bold">Jordi Planelles Pérez</Text>
			</View>
			<Link asChild href="/settings/trainer">
				<Pressable>
					<MoreVerticalIcon />
				</Pressable>
			</Link>
		</View>
	);
};
