import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuthStore } from "../store/auth-store";
import { useShallow } from "zustand/react/shallow";
import {
  DumbellIcon,
  HomeIcon,
  PeopleIcon,
  PersonIcon,
} from "../components/Icons";
import { BottomNavigation } from "react-native-paper";
import HomePage from "../components/pages/tabs/home";
import WorkoutTab from "../components/pages/tabs/workout";
import CommunityTab from "../components/pages/tabs/community";
import TrainerTab from "../components/pages/tabs/trainer";

export default function IndexPage() {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted ? (
    <Redirector />
  ) : (
    <View className="flex-1 items-center justify-center bg-black">
      <StatusBar style="light" />
      <ActivityIndicator size="large" color="white" />
    </View>
  );
}

const Redirector = () => {
  const router = useRouter();
  const { token } = useAuthStore(
    useShallow((state) => ({ token: state.token })),
  );

  useEffect(() => {
    if (token === null) {
      router.push("/landing/server");
    }
  }, [token]);

  return token === null ? null : <TabBarWrapper />;
};

const TabBarWrapper = () => {
  const [index, setIndex] = useState(0);
  const routes = [
    {
      key: "home",
      title: "Home",
      focusedIcon: () => <HomeIcon />,
    },
    {
      key: "workout",
      title: "Workout",
      focusedIcon: () => <DumbellIcon />,
    },
    {
      key: "community",
      title: "Community",
      focusedIcon: () => <PeopleIcon />,
    },
    {
      key: "trainer",
      title: "Trainer",
      focusedIcon: () => <PersonIcon />,
    },
  ];

  const renderScene = BottomNavigation.SceneMap({
    home: HomePage,
    workout: WorkoutTab,
    community: CommunityTab,
    trainer: TrainerTab,
  });

  return (
    <>
      <StatusBar style="auto" />
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </>
  );
};
