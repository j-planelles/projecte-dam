import WorkoutEditor from "../../../components/pages/WorkoutEditor";
import { View } from "react-native";
import { Appbar, Button } from "react-native-paper";
import Header from "../../../components/ui/Header";
import { EditIcon, SaveIcon, SearchIcon } from "../../../components/Icons";
import { useState } from "react";
import { SAMPLE_WORKOUTS } from "../../../lib/sampleData";

export default function ViewTemplatePage() {
  const [editable, setEditable] = useState<boolean>(false);

  return (
    <View className="flex-1">
      <Header title="View Template">
        <Appbar.Action
          icon={({ color }) =>
            editable ? <SaveIcon color={color} /> : <EditIcon color={color} />
          }
          onPress={() => setEditable((state) => !state)}
        />
      </Header>
      <WorkoutEditor
        workout={SAMPLE_WORKOUTS[0]}
        editable={editable}
        timestamp={false}
        location={false}
        creator={false}
        completable={false}
      />
    </View>
  );
}
