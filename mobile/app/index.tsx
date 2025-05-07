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
import * as SecureStorage from "expo-secure-store";

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
  const {
    token: storeToken,
    serverIp: storeServerIp,
    setServerIp,
    connectionTested,
    setConnectionTest,
    setUsername,
    setToken,
  } = useAuthStore(
    useShallow((state) => ({
      token: state.token,
      serverIp: state.serverIp,
      setServerIp: state.setServerIp,
      connectionTested: state.connectionTested,
      setConnectionTest: state.setConnectionTest,
      setUsername: state.setUsername,
      setToken: state.setToken,
    })),
  );

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const testServer = async () => {
    setIsLoading(true);
    try {
      if (connectionTested) {
        setIsLoading(false);
      } else {
        const localToken = await SecureStorage.getItemAsync("token");
        const localServerIp = await SecureStorage.getItemAsync("serverIp");
        const localUsername = await SecureStorage.getItemAsync("username");

        const token = localToken ? localToken : storeToken;
        const serverIp = localServerIp ? localServerIp : storeServerIp;

        if (localToken) {
          setToken(localToken);
        }
        if (localUsername) {
          setUsername(localUsername);
        }

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
  ) : storeToken === null ? null : (
    <TabBarWrapper />
  );
};

const TabBarWrapper = () => {
  const [index, setIndex] = useState(0);
  const routes = [
    {
      key: "home",
      title: "Home",
      focusedIcon: (props) => <HomeIcon {...props} />,
    },
    {
      key: "workout",
      title: "Workout",
      focusedIcon: (props) => <DumbellIcon {...props} />,
    },
    {
      key: "community",
      title: "Community",
      focusedIcon: (props) => <PeopleIcon {...props} />,
    },
    {
      key: "trainer",
      title: "Trainer",
      focusedIcon: (props) => <PersonIcon {...props} />,
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
