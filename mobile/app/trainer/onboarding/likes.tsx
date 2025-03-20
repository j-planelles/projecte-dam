import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { Button, Chip, Text } from "react-native-paper";
import { useShallow } from "zustand/react/shallow";
import {
	AddIcon,
	CheckIcon,
	NavigateNextIcon,
} from "../../../components/Icons";
import Header from "../../../components/ui/Header";
import { useUserRegistrationStore } from "../../../store/registration-store";
import { ThemedView } from "../../../components/ui/screen/Screen";

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

export default function TrainerOnboardingLikesPage() {
	const router = useRouter();

	const { likes, addLike, removeLike } = useUserRegistrationStore(
		useShallow((state) => ({
			likes: state.likes,
			addLike: state.addLike,
			removeLike: state.removeLike,
		})),
	);
	const navigationDisabled = likes.length < 1;

	const checkClickHandler = (checkIndex: number) => {
		if (likes.includes(checkIndex)) {
			removeLike(checkIndex);
		} else {
			addLike(checkIndex);
		}
	};

	const handleSubmit = () => {
		console.log(likes.map((likeIndex) => MOCK_LIKES[likeIndex]));

		router.push("/trainer/onboarding/list");
	};

	return (
		<ThemedView className="h-full">
			<Header title="Review your interests" />

			<ScrollView>
				<View className="flex-row flex-wrap p-4 gap-4">
					{MOCK_LIKES.map((item, index) => (
						<Chip
							key={index}
							icon={({ color }) =>
								likes.includes(index) ? (
									<CheckIcon color={color} />
								) : (
									<AddIcon color={color} />
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
				<Text>
					Your interets will be used to help us search for your trainer.
				</Text>
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
		</ThemedView>
	);
}
