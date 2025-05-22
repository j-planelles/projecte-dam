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

/**
 * Pàgina per gestionar un entrenament en curs.
 * Mostra l'editor d'entrenament i els diàlegs per gestionar el temporitzador,
 * cancel·lar o finalitzar l'entrenament.
 * @returns {JSX.Element} El component de la pàgina d'entrenament en curs.
 */
export default function OngoingWorkoutPage() {
  // Estat per controlar la visibilitat dels diferents diàlegs
  const [timerDialogVisible, setTimerDialogVisible] = useState<boolean>(false);
  const [cancelWorkoutDialogVisible, setCancelWorkoutDialogVisible] =
    useState<boolean>(false);
  const [finishWorkoutDialogVisible, setFinishWorkoutDialogVisible] =
    useState<boolean>(false);

  return (
    <ThemedView className="flex-1" avoidKeyboard={false}>
      <HeaderComponent
        setTimerDialogVisible={setTimerDialogVisible}
        setCancelWorkoutDialogVisible={setCancelWorkoutDialogVisible}
        setFinishWorkoutDialogVisible={setFinishWorkoutDialogVisible}
      />
      <WorkoutEditor />
      {/* Diàleg per gestionar el temporitzador de descans */}
      <TimerDialog
        visible={timerDialogVisible}
        setVisible={setTimerDialogVisible}
      />
      {/* Diàleg per confirmar la cancel·lació de l'entrenament */}
      <CancelWorkoutDialog
        visible={cancelWorkoutDialogVisible}
        setVisible={setCancelWorkoutDialogVisible}
      />
      {/* Diàleg per confirmar la finalització de l'entrenament */}
      <FinishWorkoutDialog
        visible={finishWorkoutDialogVisible}
        setVisible={setFinishWorkoutDialogVisible}
      />
    </ThemedView>
  );
}

/**
 * Capçalera de la pàgina d'entrenament en curs.
 * Inclou accions per obrir el temporitzador, mostrar el temps de descans,
 * i un menú amb opcions per finalitzar, cancel·lar o gestionar exercicis.
 * @param setTimerDialogVisible Funció per mostrar el diàleg del temporitzador.
 * @param setCancelWorkoutDialogVisible Funció per mostrar el diàleg de cancel·lació.
 * @param setFinishWorkoutDialogVisible Funció per mostrar el diàleg de finalització.
 * @returns {JSX.Element} El component de la capçalera.
 */
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
      {/* Botó per obrir el diàleg del temporitzador */}
      <Appbar.Action
        animated={false}
        icon={({ color }) => (
          <TimerIcon color={isRunning ? theme.colors.primary : color} />
        )}
        onPress={() => setTimerDialogVisible(true)}
      />

      {/* Mostra el temps restant del descans si està actiu */}
      <RestCountdownText />
      {/* Menú amb opcions addicionals */}
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Appbar.Action
            animated={false}
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

/**
 * Mostra el temps restant del descans si el temporitzador està actiu.
 * @returns {JSX.Element} El component amb el temps de descans.
 */
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

/**
 * Diàleg per gestionar el temporitzador de descans.
 * Permet iniciar, saltar o ajustar la durada del descans.
 * @param visible Estat de visibilitat del diàleg.
 * @param setVisible Funció per canviar la visibilitat del diàleg.
 * @returns {JSX.Element} El component del diàleg del temporitzador.
 */
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

  // Handler per iniciar o saltar el temporitzador
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

/**
 * Diàleg de confirmació per cancel·lar l'entrenament en curs.
 * Si es confirma, es descarten tots els canvis i es torna enrere.
 * @param visible Estat de visibilitat del diàleg.
 * @param setVisible Funció per canviar la visibilitat del diàleg.
 * @returns {JSX.Element} El component del diàleg de cancel·lació.
 */
const CancelWorkoutDialog = ({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const cancelWorkout = useWorkoutStore((state) => state.cancelWorkout);
  const router = useRouter();

  // Handler per cancel·lar l'entrenament i tornar enrere
  const cancelWorkoutHandler = () => {
    cancelWorkout();
    setVisible(false);
    router.back();
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={() => setVisible(false)}>
        <Dialog.Title>Cancel workout</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">
            Are you sure you want to cancel the current workout? All of its
            contents will be discarded.
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

/**
 * Diàleg de confirmació per finalitzar l'entrenament en curs.
 * Si es confirma, es navega a la pantalla de finalització de l'entrenament.
 * @param visible Estat de visibilitat del diàleg.
 * @param setVisible Funció per canviar la visibilitat del diàleg.
 * @returns {JSX.Element} El component del diàleg de finalització.
 */
const FinishWorkoutDialog = ({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();

  // Handler per finalitzar l'entrenament i navegar a la pantalla de resum/finalització
  const cancelWorkoutHandler = () => {
    setVisible(false);
    router.replace("/workout/ongoing/finish");
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={() => setVisible(false)}>
        <Dialog.Title>Finish workout</Dialog.Title>
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
