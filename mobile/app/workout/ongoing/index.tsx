import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import {
  Appbar,
  Button,
  Dialog,
  Divider,
  Menu,
  Portal,
  ProgressBar,
  Text,
  useTheme,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  CheckIcon,
  CloseIcon,
  DumbellIcon,
  MoreVerticalIcon,
  TimerIcon,
} from "../../../components/Icons";
import WorkoutEditor from "../../../components/pages/WorkoutEditor";
import Header from "../../../components/ui/Header";
import { ThemedView } from "../../../components/ui/screen/Screen";
import {
  useRestCountdown,
  useRestCountdownControl,
} from "../../../store/rest-timer-context";
import { useWorkoutStore } from "../../../store/workout-store";

export default function OngoingWorkoutPage() {
  const [timerDialogVisible, setTimerDialogVisible] = useState<boolean>(false);
  const [cancelWorkoutDialogVisible, setCancelWorkoutDialogVisible] =
    useState<boolean>(false);
  const [finishWorkoutDialogVisible, setFinishWorkoutDialogVisible] =
    useState<boolean>(false);

  return (
    <ThemedView className="flex-1">
      <HeaderComponent
        setTimerDialogVisible={setTimerDialogVisible}
        setCancelWorkoutDialogVisible={setCancelWorkoutDialogVisible}
        setFinishWorkoutDialogVisible={setFinishWorkoutDialogVisible}
      />
      <WorkoutEditor />
      <TimerDialog
        visible={timerDialogVisible}
        setVisible={setTimerDialogVisible}
      />
      <CancelWorkoutDialog
        visible={cancelWorkoutDialogVisible}
        setVisible={setCancelWorkoutDialogVisible}
      />
      <FinishWorkoutDialog
        visible={finishWorkoutDialogVisible}
        setVisible={setFinishWorkoutDialogVisible}
      />
    </ThemedView>
  );
}

const HeaderComponent = ({
  setTimerDialogVisible,
  setCancelWorkoutDialogVisible,
  setFinishWorkoutDialogVisible,
}: {
  setTimerDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setCancelWorkoutDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setFinishWorkoutDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { isRunning } = useRestCountdownControl();
  const [menuVisible, setMenuVisible] = useState<boolean>(false);

  return (
    <Header
      title=""
      style={{
        backgroundColor: isRunning && theme.colors.primaryContainer,
      }}
    >
      <Appbar.Action
        icon={({ color }) => (
          <TimerIcon color={isRunning ? theme.colors.primary : color} />
        )}
        onPress={() => setTimerDialogVisible(true)}
      />

      <RestCountdownText />
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
        <Menu.Item
          onPress={() => {
            setFinishWorkoutDialogVisible(true);
            setMenuVisible(false);
          }}
          title="Finish workout"
          leadingIcon={(props) => <CheckIcon {...props} />}
        />
        <Menu.Item
          onPress={() => {
            setCancelWorkoutDialogVisible(true);
            setMenuVisible(false);
          }}
          title="Cancel workout"
          leadingIcon={(props) => <CloseIcon {...props} />}
        />
        <Divider />
        <Menu.Item
          onPress={() => {
            router.push("/workout/exercise-list");
            setMenuVisible(false);
          }}
          title="Manage exercises"
          leadingIcon={(props) => <DumbellIcon {...props} />}
        />
      </Menu>
    </Header>
  );
};

const RestCountdownText = () => {
  const theme = useTheme();
  const { isRunning, formattedTime } = useRestCountdown();

  return (
    <Appbar.Content
      title={isRunning ? formattedTime : ""}
      color={isRunning ? theme.colors.primary : theme.colors.secondary}
    />
  );
};

const TimerDialog = ({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {
    isRunning,
    remainingTime,
    formattedTime,
    start,
    skip,
    duration,
    currentDuration,
    setDuration,
  } = useRestCountdown();

  const startButtonHandler = () => {
    if (isRunning) {
      skip();
      setVisible(false);
    } else {
      start();
    }
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={() => setVisible(false)}>
        <Dialog.Title>Rest Countdown</Dialog.Title>
        <Dialog.Content>
          {isRunning ? (
            <>
              <Text variant="headlineLarge">{formattedTime}</Text>
              <Text variant="bodyMedium">
                Duration: {currentDuration} seconds
              </Text>
              <ProgressBar
                animatedValue={remainingTime / currentDuration}
                className="pt-4"
              />
            </>
          ) : (
            <View className="gap-4">
              <Text variant="labelLarge">
                {duration > 0
                  ? `Duration: ${duration} seconds`
                  : "Rest countdown disabled."}
              </Text>
              <View className="flex-row gap-4">
                <Button
                  onPress={() =>
                    setDuration((state) => {
                      const newDuration = state - 15;
                      return newDuration < 0 ? 0 : newDuration;
                    })
                  }
                  className="flex-1"
                  mode="outlined"
                >
                  - 15s
                </Button>
                <Button
                  onPress={() => setDuration((state) => state + 15)}
                  className="flex-1"
                  mode="outlined"
                >
                  + 15s
                </Button>
              </View>
            </View>
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setVisible(false)}>Close</Button>
          {duration > 0 && (
            <Button onPress={startButtonHandler}>
              {isRunning ? "Skip" : "Start"}
            </Button>
          )}
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const CancelWorkoutDialog = ({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const cancelWorkout = useWorkoutStore((state) => state.cancelWorkout);
  const router = useRouter();

  const cancelWorkoutHandler = () => {
    cancelWorkout();
    setVisible(false);
    router.back();
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={() => setVisible(false)}>
        <Dialog.Content>
          <Text variant="bodyMedium">
            Are you sure you want to cancel the current workout?
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setVisible(false)}>No</Button>
          <Button onPress={cancelWorkoutHandler}>Yes</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const FinishWorkoutDialog = ({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();

  const cancelWorkoutHandler = () => {
    setVisible(false);
    router.replace("/workout/ongoing/finish");
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={() => setVisible(false)}>
        <Dialog.Content>
          <Text variant="bodyMedium">
            Are you sure you want to finish the current workout?
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setVisible(false)}>No</Button>
          <Button onPress={cancelWorkoutHandler}>Yes</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};
