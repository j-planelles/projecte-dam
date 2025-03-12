import { View } from "react-native";
import Header from "../../../components/ui/Header";
import WorkoutEditor from "../../../components/pages/WorkoutEditor";
import {
  Button,
  Appbar,
  Dialog,
  Portal,
  Text,
  useTheme,
  Menu,
  Divider,
} from "react-native-paper";
import { CheckIcon, CloseIcon, DumbellIcon, MoreVerticalIcon, TimerIcon } from "../../../components/Icons";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SAMPLE_WORKOUT: workout = {
  uuid: "c1be768f-4455-4b1d-ac6c-2ddf82e2a137",
  title: "Afternoon Workout",
  timestamp: 1697001600,
  duration: 90,
  gym: "Planet Fitness",
  creator: "John Doe",
  description: "",
  exercises: [
    {
      exercise: {
        name: "Bench Press",
      },
      sets: [
        { reps: 8, weight: 135 },
        { reps: 8, weight: 135 },
        { reps: 8, weight: 135 },
      ],
    },
  ],
};

export default function OngoingWorkoutPage() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const [timerDialogVisible, setTimerDialogVisible] = useState<boolean>(false);
  const [timerActive, setTimerActive] = useState<boolean>(false);

  const [menuVisible, setMenuVisible] = useState<boolean>(false);

  return (
    <View className="flex-1">
      <Header title="" style={{backgroundColor: timerActive && theme.colors.primaryContainer}}>
        <Appbar.Action
          icon={({ color }) => (
            <TimerIcon color={timerActive ? theme.colors.primary : color} />
          )}
          onPress={() => setTimerDialogVisible(true)}
        />

        <Appbar.Content
          title={timerActive ? "2:24" : ""}
          color={timerActive ? theme.colors.primary : theme.colors.secondary}
          onPress={() => timerActive && setTimerDialogVisible(true)}
        />

        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Appbar.Action
              icon={({ color }) => <MoreVerticalIcon color={color} />}
              onPress={() => setMenuVisible(true)}
            />
          }
          statusBarHeight={insets.top}
        >
          <Menu.Item onPress={() => {}} title="Finish workout" leadingIcon={(props) => <CheckIcon { ...props } />}/>
          <Menu.Item onPress={() => {}} title="Cancel workout"  leadingIcon={(props) => <CloseIcon { ...props } />}/>
          <Divider />
          <Menu.Item onPress={() => {}} title="Manage exercises"  leadingIcon={(props) => <DumbellIcon { ...props } />}/>
        </Menu>
      </Header>

      <WorkoutEditor workout={SAMPLE_WORKOUT} editable={true} />
      <Portal>
        <TimerDialog
          visible={timerDialogVisible}
          setVisible={setTimerDialogVisible}
          active={timerActive}
          setActive={setTimerActive}
        />
      </Portal>
    </View>
  );
}

const TimerDialog = ({
  visible,
  setVisible,
  active,
  setActive,
}: {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <Dialog visible={visible} onDismiss={() => setVisible(false)}>
      <Dialog.Title>Rest Timer</Dialog.Title>
      <Dialog.Content>
        <Text variant="bodyMedium">This is simple dialog</Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={() => setVisible(false)}>Cancel</Button>
        <Button
          onPress={() => {
            setActive((state) => !state);
            setVisible(false);
          }}
        >
          Start
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};
