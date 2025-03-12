import { useEffect, useRef, useState } from "react";
import {
  Text as NativeText,
  TextInput as NativeTextInput,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import {
  Button,
  Checkbox,
  Divider,
  Menu,
  Text,
  TextInput,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import { AddIcon, MoreVerticalIcon } from "../Icons";
import { Link } from "expo-router";

export default function WorkoutEditor({
  workout,
  editable = false,
  timestamp = true,
  location = true,
  creator = true,
  completable = true,
}: {
  workout: workout;
  editable?: boolean;
  timestamp?: boolean;
  location?: boolean;
  creator?: boolean;
  completable?: boolean;
}) {
  return (
    <ScrollView>
      <View className="pt-4 gap-2">
        <WorkoutInformation
          editable={editable}
          workout={workout}
          timestamp={timestamp}
          location={location}
          creator={creator}
        />
        <WorkoutExercises
          editable={editable}
          exercises={workout.exercises}
          completable={completable}
        />
      </View>
    </ScrollView>
  );
}

const WorkoutInformation = ({
  workout,
  editable,
  timestamp,
  location,
  creator,
}: {
  workout: workout;
  editable: boolean;
  timestamp: boolean;
  location: boolean;
  creator: boolean;
}) => {
  const timestampDate = new Date(workout.timestamp);
  const durationDate = new Date(workout.duration);
  const durationText = `${String(durationDate.getHours()).padStart(2, "0")}:${String(durationDate.getMinutes()).padStart(2, "0")}`;

  return (
    <View className="px-4 gap-2">
      {timestamp && editable && (
        <Text variant="titleMedium">{`Workout duration: ${durationText}`}</Text>
      )}

      {editable ? (
        <TextInput label="Name" value={workout.title} mode="outlined" />
      ) : (
        <View>
          <Text variant="titleLarge">{workout.title}</Text>
          {creator && <Text variant="titleSmall">by {workout.creator}</Text>}
        </View>
      )}
      {editable ? (
        <TextInput
          label="Description"
          value={workout.description}
          multiline
          mode="outlined"
        />
      ) : (
        <Text variant="bodyLarge">{workout.description}</Text>
      )}

      {timestamp && !editable && (
        <Text variant="titleMedium">
          {`${timestampDate.toLocaleString()} for ${durationText}`}
        </Text>
      )}

      {location &&
        (editable ? (
          <Link asChild href="/workout/ongoing/select-gym">
            <Button mode="outlined" className="text-left">
              {workout.gym}
            </Button>
          </Link>
        ) : (
          <Text variant="titleMedium">{workout.gym}</Text>
        ))}
    </View>
  );
};

const WorkoutExercises = ({
  exercises,
  editable,
  completable,
}: {
  exercises: workoutExercise[];
  editable: boolean;
  completable: boolean;
}) => {
  return (
    <>
      <Divider />
      {exercises.map((exercise, index) => (
        <WorkoutExercise
          key={index}
          editable={editable}
          exercise={exercise}
          completable={completable}
        />
      ))}

      {editable && (
        <Link asChild href="/workout/ongoing/add-exercise">
          <Button icon={({ color }) => <AddIcon color={color} />} mode="text">
            Add exercise
          </Button>
        </Link>
      )}
    </>
  );
};

const WorkoutExercise = ({
  exercise,
  editable,
  completable,
}: {
  exercise: workoutExercise;
  editable: boolean;
  completable: boolean;
}) => {
  const theme = useTheme();

  const [menuVisible, setMenuVisible] = useState<boolean>(false);

  return (
    <View>
      <View className="flex-1 flex-row items-center pl-4 pr-2">
        <Text variant="titleMedium" className="flex-1">
          {exercise.exercise.name}
        </Text>

        {editable && (
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <TouchableRipple onPress={() => setMenuVisible(true)}>
                <MoreVerticalIcon
                  color={theme.colors.onSurface}
                  className="p-2"
                />
              </TouchableRipple>
            }
          >
            <Menu.Item onPress={() => setMenuVisible(false)} title="Normal" />
            <Menu.Item onPress={() => setMenuVisible(false)} title="Dropset" />
            <Menu.Item onPress={() => setMenuVisible(false)} title="Failture" />
          </Menu>
        )}
      </View>

      {exercise.sets.map((set, index) => (
        <WorkoutSet
          key={index}
          editable={editable}
          set={set}
          index={index}
          completable={completable}
        />
      ))}

      {editable ? (
        <Button
          icon={({ color }) => <AddIcon color={color} />}
          mode="text"
          onPress={() => console.log("Pressed")}
        >
          Add set
        </Button>
      ) : (
        <Divider />
      )}
    </View>
  );
};

const WorkoutSet = ({
  set,
  editable,
  index,
  completable,
}: {
  set: exerciseSet;
  editable: boolean;
  index: number;
  completable: boolean;
}) => {
  const theme = useTheme();

  const [weight, setWeight] = useState<number>(0);
  const [reps, setReps] = useState<number>(0);

  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);

  return editable ? (
    <View
      className="flex-1 flex-row items-center px-2 gap-2"
      style={{
        backgroundColor: completed
          ? theme.colors.surfaceVariant
          : "transparent",
      }}
    >
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <TouchableRipple onPress={() => setMenuVisible(true)}>
            <Text
              variant="titleMedium"
              className="w-12 px-2 py-2 font-bold rounded"
              style={{ textAlign: "center" }}
            >
              {index + 1}
            </Text>
          </TouchableRipple>
        }
      >
        <Menu.Item onPress={() => setMenuVisible(false)} title="Normal" />
        <Menu.Item onPress={() => setMenuVisible(false)} title="Dropset" />
        <Menu.Item onPress={() => setMenuVisible(false)} title="Failture" />
      </Menu>

      <TouchableRipple
        onPress={() => {
          console.log("Pressed");
        }}
      >
        <Text
          variant="bodyMedium"
          className="w-24 py-2 rounded"
          style={{ textAlign: "center" }}
        >
          4 x 120kg
        </Text>
      </TouchableRipple>

      <WorkoutSetTextField value={weight} unit="kg" onTextChange={setWeight} />

      <WorkoutSetTextField value={reps} unit="reps" onTextChange={setReps} />

      {completable && (
        <Checkbox
          status={completed ? "checked" : "unchecked"}
          onPress={() => setCompleted((state) => !state)}
        />
      )}
    </View>
  ) : (
    <View className="flex-1 flex-row items-center py-2 px-4">
      <Text variant="titleMedium" className="w-12 px-4">
        {index + 1}
      </Text>
      <Text variant="bodyLarge" className="flex-1 px-2">
        {set.weight} kg
      </Text>
      <Text variant="bodyLarge" className="flex-1 px-2">
        {set.reps} reps
      </Text>
    </View>
  );
};

const WorkoutSetTextField = ({
  value,
  onTextChange,
  unit,
}: {
  value: number;
  onTextChange: React.Dispatch<React.SetStateAction<number>>;
  unit?: string;
}) => {
  const theme = useTheme();

  const textInputRef = useRef<NativeTextInput>(null);
  const [editing, setEditing] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      if (editing) {
        textInputRef.current?.focus();
      }
    }, 100);
  }, [editing]);

  return editing ? (
    <View className="flex-1">
      <NativeTextInput
        className="text-center px-2 py-2 font-bold rounded"
        value={value.toString()}
        onChangeText={(value) => onTextChange(Number(value))}
        keyboardType="numeric"
        style={{ backgroundColor: theme.colors.surfaceVariant }}
        onBlur={() => setEditing(false)}
        ref={textInputRef}
      />
    </View>
  ) : (
    <Pressable onPress={() => setEditing(true)} className="flex-1 py-2">
      <NativeText
        className="px-6 py-2 font-bold rounded"
        style={{
          backgroundColor: theme.colors.surfaceVariant,
          textAlign: "center",
        }}
      >
        {value} {unit}
      </NativeText>
    </Pressable>
  );
};
