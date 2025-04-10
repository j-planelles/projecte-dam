import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Appbar, Button, Text } from "react-native-paper";
import { useShallow } from "zustand/react/shallow";
import { EditIcon, SaveIcon } from "../../../components/Icons";
import WorkoutViewer from "../../../components/pages/WorkoutViewer";
import Header from "../../../components/ui/Header";
import { ThemedView } from "../../../components/ui/screen/Screen";
import { useAuthStore } from "../../../store/auth-store";

export default function ViewTemplatePage() {
	const { uuid } = useLocalSearchParams();
	const { apiClient, token } = useAuthStore(
		useShallow((state) => ({
			apiClient: state.apiClient,
			token: state.token,
		})),
	);
	const { data, isLoading, isSuccess, error } = useQuery({
		queryKey: ["user", "/user/templates", uuid],
		queryFn: async () =>
			await apiClient.get("/user/templates/:template_uuid", {
				params: { template_uuid: uuid.toString() },
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
					})),
				})),
			}) as workout,
		[data],
	);
	const [editable, setEditable] = useState<boolean>(false);

	return (
		<ThemedView className="flex-1">
			<Header title="View Template">
				<Appbar.Action
					icon={({ color }) =>
						editable ? <SaveIcon color={color} /> : <EditIcon color={color} />
					}
					onPress={() => setEditable((state) => !state)}
				/>
			</Header>
			{isLoading && (
				<View className="flex-1 justify-center">
					<ActivityIndicator size={"large"} />
				</View>
			)}
			{error && <Text>{error.message}</Text>}
			{isSuccess && (
				<>
					<WorkoutViewer
						workout={workout}
						creator={false}
						timestamp={false}
						location={false}
					/>

					<View className="p-4">
						<Button mode="contained">Start workout</Button>
					</View>
				</>
			)}
		</ThemedView>
	);
}
