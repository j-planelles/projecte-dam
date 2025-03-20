import { Paint, useFont } from "@shopify/react-native-skia";
import { Link, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Avatar, Button, MD3LightTheme } from "react-native-paper";
import { Bar, CartesianChart } from "victory-native";
import roboto from "../../../assets/fonts/Roboto-Regular.ttf";
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
import { SAMPLE_WORKOUTS } from "../../../lib/sampleData";

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

			<Link href="/workout/history-list" asChild>
				<Button mode="text">View all</Button>
			</Link>
		</HomeTabsScreen>
	);
}

const ProfilePictureHeader = () => {
	return (
		<View className="flex-1 flex-row items-center gap-4">
			<Avatar.Text size={48} label="J" />
			<View className="flex-1">
				<Text className="text-xl font-bold">Jordi Planelles Pérez</Text>
				<View className="flex-row gap-2">
					<CompactChip>100 workouts</CompactChip>
					<CompactChip>3 this week</CompactChip>
				</View>
			</View>
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

	return (
		<>
			{SAMPLE_WORKOUTS.map((workout) => (
				<WorkoutCard
					key={workout.uuid}
					workout={workout}
					onPress={() => router.push(`/workout/workout-view/${workout.uuid}`)}
				/>
			))}
		</>
	);
};
