import { Link, useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import { Button, Text, TouchableRipple } from "react-native-paper";
import { AddIcon, DumbellIcon } from "../../Icons";
import WorkoutCard from "../../ui/WorkoutCard";
import HomeTabsScreen from "../../ui/screen/HomeTabsScreen";
import { useWorkoutStore } from "../../../store/workout-store";

export default function WorkoutTab() {
	const router = useRouter();
	const startEmptyWorkout = useWorkoutStore((state) => state.startEmptyWorkout);

	const startEmptyWorkoutHandler = () => {
		try {
			startEmptyWorkout();
			router.push("/workout/ongoing/");
		} catch (error: any) {
			if (error.message === "Ongoing workout") {
				router.push("/workout/ongoing/");
			}
		}
	};
	return (
		<HomeTabsScreen>
			<Text variant="headlineLarge">Workout</Text>

			<Button
				icon={({ color }) => <AddIcon color={color} />}
				mode="contained"
				onPress={startEmptyWorkoutHandler}
			>
				Start an empty workout
			</Button>
			<Link href="/workout/exercise-list" asChild>
				<Button
					icon={({ color }) => <DumbellIcon color={color} />}
					mode="contained-tonal"
				>
					Manage exercises
				</Button>
			</Link>

			<TemplatesList />
		</HomeTabsScreen>
	);
}

const TemplatesList = () => {
	const router = useRouter();

	return (
		<>
			<View className="flex-1 flex-row items-center">
				<Text className="flex-1 text-lg font-bold">Templates</Text>
				<TouchableRipple
					onPress={() => router.push("/workout/template-view/")}
					className="p-2"
				>
					<AddIcon />
				</TouchableRipple>
			</View>

			<WorkoutCard
				onPress={() => router.push(`/workout/template-view/carlos`)}
				showTimestamp={false}
				showDescription={true}
			/>
		</>
	);
};
