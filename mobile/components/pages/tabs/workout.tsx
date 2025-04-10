import { Link, useRouter } from "expo-router";
import { useShallow } from "zustand/react/shallow";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Button, Text, TouchableRipple } from "react-native-paper";
import { AddIcon, DumbellIcon } from "../../Icons";
import WorkoutCard from "../../ui/WorkoutCard";
import HomeTabsScreen from "../../ui/screen/HomeTabsScreen";
import { useWorkoutStore } from "../../../store/workout-store";
import { useAuthStore } from "../../../store/auth-store";
import { useQuery } from "@tanstack/react-query";

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
	const { apiClient, token } = useAuthStore(
		useShallow((state) => ({
			apiClient: state.apiClient,
			token: state.token,
		})),
	);
	const { data, isLoading, isSuccess, error } = useQuery({
		queryKey: ["user", "/user/templates"],
		queryFn: async () =>
			await apiClient.get("/user/templates", {
				headers: { Authorization: `Bearer ${token}` },
			}),
	});

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

			{isLoading && (
				<View>
					<ActivityIndicator size={"large"} />
				</View>
			)}
			{error && (
				<View>
					<Text>{error.message}</Text>
				</View>
			)}
			{isSuccess &&
				data
					.map(
						(data) =>
							({
								uuid: data.uuid,
								title: data.name,
								description: data.description,
								timestamp: data.instance?.timestamp_start || 0,
								duration: data.instance?.duration || 0,
								exercises: data.entries.map((entry) => ({
									restCountdownDuration: entry.rest_countdown_duration,
									weightUnit: entry.weight_unit,
									exercise: {
										uuid: entry.exercise.uuid,
										name: entry.exercise.name,
										description: entry.exercise.description,
										userNote: entry.exercise.user_note,
										bodyPart: entry.exercise.body_part,
										type: entry.exercise.type,
									},
									sets: entry.sets.map((set) => ({
										reps: set.reps,
										weight: set.weight,
									})),
								})),
							}) as workout,
					)
					.map((workout) => (
						<WorkoutCard
							key={workout.uuid}
							workout={workout}
							showTimestamp={false}
							showDescription={true}
							onPress={() =>
								router.push(`/workout/template-view/${workout.uuid}`)
							}
						/>
					))}
		</>
	);
};
