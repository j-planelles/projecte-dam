import WorkoutEditor from "../../../components/pages/WorkoutEditor";
import { View } from "react-native";
import { Appbar, Button } from "react-native-paper";
import Header from "../../../components/ui/Header";
import { EditIcon, SaveIcon, SearchIcon } from "../../../components/Icons";
import { useState } from "react";
import { SAMPLE_WORKOUTS } from "../../../lib/sampleData";

export default function CreateTemplatePage() {
	return (
		<View className="flex-1">
			<Header title="Create Template">
				<Appbar.Action
					icon={({ color }) => <SaveIcon color={color} />}
					onPress={() => {}}
				/>
			</Header>
			{/* <WorkoutEditor */}
			{/*   workout={SAMPLE_WORKOUTS[0]} */}
			{/*   editable={true} */}
			{/*   timestamp={false} */}
			{/*   location={false} */}
			{/*   creator={false} */}
			{/*   completable={false} */}
			{/* /> */}
		</View>
	);
}
