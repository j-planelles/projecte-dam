import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Button, HelperText } from "react-native-paper";
import { useShallow } from "zustand/react/shallow";
import WorkoutViewer from "../../../components/pages/WorkoutViewer";
import Header from "../../../components/ui/Header";
import { ThemedView } from "../../../components/ui/screen/Screen";
import { useAuthStore } from "../../../store/auth-store";

export default function ViewWorkoutPage() {
	const { uuid } = useLocalSearchParams();
	const { apiClient, token } = useAuthStore(
		useShallow((state) => ({
			apiClient: state.apiClient,
			token: state.token,
		})),
	);
	const { data, isLoading, isSuccess, error } = useQuery({
		queryKey: ["user", "/user/workouts", uuid],
		queryFn: async () =>
			await apiClient.get("/user/workouts/:workout_uuid", {
				params: { workout_uuid: uuid.toString() },
				headers: { Authorization: `Bearer ${token}` },
			}),
	});

	const workout = useMemo(
		() =>
			({
				uuid: data?.uuid,
				title: data?.name,
				description: data?.description,
				timestamp: data?.instance?.timestamp_start || 0,
				duration: data?.instance?.duration || 0,
				exercises: data?.entries.map((entry) => ({
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
						type: set.set_type,
					})),
				})),
			}) as workout,
		[data],
	);

	return (
		<ThemedView className="flex-1">
			<Header title="View Workout" />
			{isLoading && (
				<View className="flex-1 justify-center">
					<ActivityIndicator size={"large"} />
				</View>
			)}
			{error && <Text>{error.message}</Text>}
			{isSuccess && (
				<>
					<WorkoutViewer workout={workout} creator={false} />

					<View className="p-4">
						<SaveAsTemplateButton workout={workout} />
					</View>
				</>
			)}
		</ThemedView>
	);
}

const SaveAsTemplateButton = ({ workout }: { workout: workout }) => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { apiClient, token } = useAuthStore(
		useShallow((state) => ({
			apiClient: state.apiClient,
			token: state.token,
		})),
	);

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [queryError, setQueryError] = useState<string | null>(null);

	const saveAsTemplateHandler = async () => {
		setIsLoading(true);
		setQueryError(null);
		try {
			const response = await apiClient.post(
				"/user/templates",
				{
					uuid: workout.uuid,
					name: workout.title,
					description: workout.description,
					entries: workout.exercises.map((exercise) => ({
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
							set_type: set.type,
						})),
					})),
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				},
			);
			queryClient.invalidateQueries({ queryKey: ["user", "/user/templates"] });
			router.push(`/workout/template-view/${response.uuid}`);
		} catch (error: any) {
			if (error instanceof AxiosError) {
				setQueryError(`${error?.request?.status} ${error?.request?.response}.`);
			} else {
				setQueryError(`${error?.message}`);
				console.error(error.message);
			}
		}
		setIsLoading(false);
	};

	return (
		<>
			<HelperText type="error">{queryError}</HelperText>
			<Button
				mode="contained"
				disabled={isLoading}
				onPress={saveAsTemplateHandler}
			>
				Save as template
			</Button>
		</>
	);
};
