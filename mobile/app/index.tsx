import { Link, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, View, Text, Pressable } from "react-native";
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
import axios from "axios";

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
    </View>
  );
}

const Redirector = () => {
  const router = useRouter();
  const { token, serverIp, setServerIp, connectionTested, setConnectionTest } =
    useAuthStore(
      useShallow((state) => ({
        token: state.token,
        serverIp: state.serverIp,
        setServerIp: state.setServerIp,
        connectionTested: state.connectionTested,
        setConnectionTest: state.setConnectionTest,
      })),
    );

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const testServer = async () => {
    setIsLoading(true);
    try {
      if (connectionTested) {
        setIsLoading(false);
      } else {
        const response = await axios.get(`${serverIp}/`);

        setServerIp(serverIp, response.data.name);

        setConnectionTest(true);

        if (token) {
          setIsLoading(false);
        } else {
          router.replace("/landing/login");
        }
      }
    } catch (error: unknown) {
      router.replace("/landing/server");
    }
  };

  useEffect(() => {
    testServer();
  }, []);

  return isLoading ? (
    <View className="flex-1 bg-black">
      <View className="flex-1 items-center justify-center">
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="white" />
      </View>
      <Text className="w-full text-center text-white">
        Attempting to connect to server...
      </Text>
      {/* <Pressable onPress={skipConnectionTestHandler} className="p-4"> */}
      {/*   <Text className="w-full text-center text-white underline"> */}
      {/*     Stuck? Choose a server */}
      {/*   </Text> */}
      {/* </Pressable> */}
    </View>
  ) : token === null ? null : (
    <TabBarWrapper />
  );
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
