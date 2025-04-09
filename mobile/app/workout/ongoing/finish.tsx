import Header from "../../../components/ui/Header";
import { ThemedView } from "../../../components/ui/screen/Screen";
import { useWorkoutStore } from "../../../store/workout-store";
import { useShallow } from "zustand/react/shallow";
import WorkoutViewer from "../../../components/pages/WorkoutViewer";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../../store/auth-store";
import { ActivityIndicator, View } from "react-native";
import { Text } from "react-native-paper";
import { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";

export default function FinishWorkoutPage() {
	const queryClient = useQueryClient();
	const { apiClient, token } = useAuthStore(
		useShallow((state) => ({
			apiClient: state.apiClient,
			token: state.token,
		})),
	);
	const cancelWorkout = useWorkoutStore((state) => state.cancelWorkout);
	const workoutStore = useWorkoutStore(
		useShallow((state) => ({
			uuid: state.uuid,
			title: state.title,
			timestamp: state.timestamp,
			gym: state.gym,
			description: state.description,
			exercises: state.exercises,
		})),
	);

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [globalError, setGlobalError] = useState<string | null>("NOT STARTED");

	const now = new Date() as unknown as number;
	const duration = (now - workoutStore.timestamp) / 1000;

	const workoutData = { ...workoutStore, duration: duration };

	const postData = async () => {
		setIsLoading(true);
		setGlobalError("");
		try {
			await apiClient.post(
				"/user/workouts",
				{
					uuid: workoutStore.uuid,
					name: workoutStore.title,
					description: workoutStore.description,
					instance: {
						timestamp_start: Math.trunc(workoutStore.timestamp),
						duration: Math.trunc(duration),
					},
					entries: workoutStore.exercises.map((exercise) => ({
						rest_countdown_duration: exercise.restCountdownDuration,
						weight_unit: exercise.weightUnit,
						exercise: {
							uuid: exercise.exercise.uuid,
							name: exercise.exercise.name,
							description: exercise.exercise.description,
							user_note: exercise.exercise.userNote,
							body_part: exercise.exercise.bodyPart,
							type: exercise.exercise.type,
						},
						sets: exercise.sets.map((set) => ({
							reps: set.reps,
							weight: set.weight,
						})),
					})),
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				},
			);
			cancelWorkout();
			queryClient.invalidateQueries({ queryKey: ["user", "/user/workouts"] });
		} catch (error: any) {
			if (error instanceof AxiosError) {
				setGlobalError(
					`${error?.request?.status} ${error?.request?.response}.`,
				);
			} else {
				setGlobalError(`${error?.message}`);
				console.error(error.message);
			}
		}
		setIsLoading(false);
	};

	useEffect(() => {
		postData();
	}, []);

	return (
		<ThemedView className="flex-1">
			<Header title="Finished workout" />

			<View className="flex-row px-4 pb-4 gap-4 justify-center">
				{isLoading && (
					<>
						<ActivityIndicator />
						<Text variant="bodyLarge">Workout saved successfully!</Text>
					</>
				)}
				{!isLoading && !globalError && (
					<Text variant="bodyLarge">Workout saved successfully!</Text>
				)}
				{!isLoading && globalError && (
					<Text variant="bodyLarge">{globalError}</Text>
				)}
			</View>

			<WorkoutViewer workout={workoutData} creator={false} />
		</ThemedView>
	);
}
