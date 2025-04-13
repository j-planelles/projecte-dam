import { Paint, useFont } from "@shopify/react-native-skia";
import { Link, useRouter } from "expo-router";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { Avatar, Button, MD3LightTheme } from "react-native-paper";
import { Bar, CartesianChart } from "victory-native";
import { useShallow } from "zustand/react/shallow";
import roboto from "../../../assets/fonts/Roboto-Regular.ttf";
import { useAuthStore } from "../../../store/auth-store";
import {
	CalendarIcon,
	CloseIcon,
	InformationIcon,
	SettingsIcon,
} from "../../Icons";
import CompactChip from "../../ui/CompactChip";
import InfoCard from "../../ui/InfoCard";
import HomeTabsScreen from "../../ui/screen/HomeTabsScreen";
import WorkoutCard from "../../ui/WorkoutCard";
import { useQuery } from "@tanstack/react-query";

export default function HomePage() {
	return (
		<HomeTabsScreen>
			<ProfilePictureHeader />

			<InfoCard
				left={<InformationIcon />}
				right={
					<Pressable
						onPress={() => {
							console.log("Pressed");
						}}
					>
						<CloseIcon />
					</Pressable>
				}
			>
				{`A wrapper for views that should respond to touches. Provides a material "ink ripple" interaction effect for supported platforms (>= Android Lollipop). On unsupported platforms, it falls back to a highlight effect.`}
			</InfoCard>

			<WorkoutsChart />

			<Text className="text-lg font-bold">History</Text>

			<WorkoutsList />
		</HomeTabsScreen>
	);
}

const ProfilePictureHeader = () => {
	const { apiClient, token } = useAuthStore(
		useShallow((state) => ({
			apiClient: state.apiClient,
			token: state.token,
		})),
	);
	const { data, isLoading, error } = useQuery({
		queryKey: ["user", "/auth/profile"],
		queryFn: async () =>
			await apiClient.get("/auth/profile", {
				headers: { Authorization: `Bearer ${token}` },
			}),
	});
	return (
		<View className="flex-1 flex-row items-center gap-4 min-h-20">
			{error && (
				<View className="flex-1">
					<Text>Failed to load user data.</Text>
				</View>
			)}
			{isLoading && (
				<View className="flex-1">
					<ActivityIndicator size="large" />
				</View>
			)}
			{data && (
				<>
					<Avatar.Text
						size={52}
						label={data ? data?.full_name.charAt(0).toUpperCase() : ""}
					/>
					<View className="flex-1 gap-1">
						<Text className="text-xl font-bold">{data?.full_name}</Text>
						<View className="flex-row gap-2">
							<CompactChip>100 workouts</CompactChip>
							<CompactChip>3 this week</CompactChip>
						</View>
					</View>
				</>
			)}
			<Link asChild href="/settings/">
				<Pressable>
					<SettingsIcon />
				</Pressable>
			</Link>
		</View>
	);
};

const WorkoutsChart = () => {
	const font = useFont(roboto, 12);
	const DATA = Array.from({ length: 8 }, (_, i) => ({
		weekDelta: i,
		workouts: Math.floor(Math.random() * 6) + 1,
	}));

	return (
		<>
			<View className="flex-1 flex-row items-center">
				<Text className="flex-1 text-lg font-bold">Workouts per week</Text>
				<Link href="/" asChild>
					<Pressable>
						<CalendarIcon />
					</Pressable>
				</Link>
			</View>

			<View style={{ height: 150 }}>
				<CartesianChart
					data={DATA}
					xKey={"weekDelta"}
					yKeys={["workouts"]}
					domainPadding={{ left: 30, right: 30, top: 10 }}
					domain={{
						y: [
							0,
							DATA.map((data) => data.workouts).reduce((x, y) =>
								Math.max(x, y),
							),
						],
					}}
					axisOptions={{
						font: font,
						formatXLabel: (value) => value.toString(),
					}}
				>
					{({ points, chartBounds }) => (
						<Bar chartBounds={chartBounds} points={points.workouts}>
							<Paint color={MD3LightTheme.colors.primary} />
						</Bar>
					)}
				</CartesianChart>
			</View>
		</>
	);
};

const WorkoutsList = () => {
	const router = useRouter();
	const { apiClient, token } = useAuthStore(
		useShallow((state) => ({
			apiClient: state.apiClient,
			token: state.token,
		})),
	);
	const { data, isLoading, isSuccess, error } = useQuery({
		queryKey: ["user", "/user/workouts"],
		queryFn: async () =>
			await apiClient.get("/user/workouts", {
				headers: { Authorization: `Bearer ${token}` },
			}),
	});

	return (
		<>
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
			{isSuccess && (
				<>
					{data
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
								onPress={() =>
									router.push(`/workout/workout-view/${workout.uuid}`)
								}
							/>
						))}

					<Link href="/workout/history-list" asChild>
						<Button mode="text">View all</Button>
					</Link>
				</>
			)}
		</>
	);
};
