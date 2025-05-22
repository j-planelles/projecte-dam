import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import * as SecureStorage from "expo-secure-store";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SystemBars } from "react-native-edge-to-edge";
import { BottomNavigation } from "react-native-paper";
import { useShallow } from "zustand/react/shallow";
import { DumbellIcon, HomeIcon, PersonIcon } from "../components/Icons";
import HomePage from "../components/pages/tabs/home";
import TrainerTab from "../components/pages/tabs/trainer";
import WorkoutTab from "../components/pages/tabs/workout";
import { useAuthStore } from "../store/auth-store";
import { useSettingsStore } from "../store/settings-store";

/**
 * Entrypoint de l'aplicació. La primera pàgina que es carrega a l'arrancar l'aplicació.
 * S'encarrega de carregar configuracions inicials i després redirigir a la pantalla principal o de login.
 * @returns {JSX.Element} El component de la pàgina.
 */
export default function IndexPage() {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const setEnableLastLest = useSettingsStore(
    (state) => state.setEnableLastLest,
  );

  /**
   * Obté la configuració 'enableLastSet' des de l'AsyncStorage i l'estableix a l'store.
   */
  const getSettings = async () => {
    const item = await AsyncStorage.getItem("enableLastSet"); // Llegeix l'element de l'AsyncStorage

    if (item) {
      // Si l'element existeix, actualitza l'store
      setEnableLastLest(item === "true");
    }
  };

  // Efecte que s'executa un cop quan el component es munta
  useEffect(() => {
    getSettings(); // Carrega les configuracions
    setIsMounted(true); // Marca el component com a muntat
  }, []);

  // Mostra una pantalla de càrrega mentre el component no s'ha muntat completament.
  // Quan es munta, renderitza el component Redirector.
  return isMounted ? (
    <Redirector />
  ) : (
    <View className="flex-1 items-center justify-center bg-black">
      <SystemBars style="light" />
    </View>
  );
}

/**
 * Component que gestiona la lògica de redirecció inicial.
 * Comprova la connexió amb el servidor i l'estat d'autenticació de l'usuari.
 * @returns {JSX.Element | null} Un indicador de càrrega, la pantalla principal (TabBarWrapper), o null si no hi ha token.
 */
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

  /**
   * Comprova la connexió amb el servidor i l'estat d'autenticació.
   * Intenta obtenir el token i la IP del servidor des de l'emmagatzematge segur si no s'han provat abans.
   * Redirigeix a la pantalla de login o de selecció de servidor si és necessari.
   */
  const testServer = async () => {
    setIsLoading(true); // Inicia la càrrega
    try {
      if (connectionTested) {
        // Si la connexió ja ha estat provada, no cal fer res més aquí
        setIsLoading(false);
      } else {
        // Intenta obtenir dades locals
        const localToken = await SecureStorage.getItemAsync("token");
        const localServerIp = await SecureStorage.getItemAsync("serverIp");
        const localUsername = await SecureStorage.getItemAsync("username");

        // Utilitza les dades locals si existeixen, si no, fa servir les de l'store
        const token = localToken ? localToken : storeToken;
        const serverIp = localServerIp ? localServerIp : storeServerIp;

        // Actualitza l'store amb les dades locals si existeixen
        if (localToken) {
          setToken(localToken);
        }
        if (localUsername) {
          setUsername(localUsername);
        }

        // Realitza una petició al servidor per comprovar la connexió
        const response = await axios.get(`${serverIp}/`);

        // Estableix la IP del servidor i el nom del servidor a l'store
        setServerIp(serverIp, response.data.name);
        // Marca la connexió com a provada
        setConnectionTest(true);

        if (token) {
          // Si hi ha un token, la càrrega ha finalitzat
          setIsLoading(false);
        } else {
          // Si no hi ha token, redirigeix a la pàgina de login
          router.replace("/landing/login");
        }
      }
    } catch (error: unknown) {
      // Si hi ha un error durant la connexió, redirigeix a la pàgina de selecció de servidor
      router.replace("/landing/server");
    }
  };

  // Efecte que s'executa un cop quan el component es munta per provar el servidor
  useEffect(() => {
    testServer();
  }, []);

  // Si s'està carregant, mostra una pantalla de càrrega
  if (isLoading) {
    return (
      <View className="flex-1 bg-black">
        <View className="flex-1 items-center justify-center">
          <SystemBars style="light" />
          <ActivityIndicator size="large" color="white" />
        </View>
        <Text className="w-full text-center text-white pb-4">
          Attempting to connect to server...
        </Text>
        {/* Opció comentada per saltar la prova de connexió
         <Pressable onPress={skipConnectionTestHandler} className="p-4">
           <Text className="w-full text-center text-white underline">
             Stuck? Choose a server
           </Text>
         </Pressable> */}
      </View>
    );
  }

  // Si no s'està carregant i no hi ha token a l'store, no renderitza res (o redirigeix a login si testServer ho fa)
  if (storeToken === null) {
    // Si la connexió ja s'ha provat i no hi ha token, redirigeix a login
    if (connectionTested) {
      router.replace("/landing/login");
      return null; // Evita renderitzar TabBarWrapper momentàniament
    }
    // Si la connexió no s'ha provat encara, testServer s'encarregarà de la redirecció o de posar isLoading a false
    return null; // O un altre indicador de càrrega si es prefereix
  }

  // Si no s'està carregant i hi ha un token, mostra la navegació principal
  return <TabBarWrapper />;
};

/**
 * Component que embolcalla la navegació principal amb pestanyes inferiors.
 * Utilitza BottomNavigation de react-native-paper.
 * @returns {JSX.Element} El component de la barra de navegació amb pestanyes.
 */
const TabBarWrapper = () => {
  const [index, setIndex] = useState(0);
  const routes = [
    {
      key: "home",
      title: "Home",
      focusedIcon: (props: { color: string; size: number }) => (
        <HomeIcon {...props} />
      ),
    },
    {
      key: "workout",
      title: "Workout",
      focusedIcon: (props: { color: string; size: number }) => (
        <DumbellIcon {...props} />
      ),
    },
    {
      key: "trainer",
      title: "Trainer",
      focusedIcon: (props: { color: string; size: number }) => (
        <PersonIcon {...props} />
      ),
    },
  ];

  // Mapeja les claus de les rutes als components de pantalla corresponents
  const renderScene = BottomNavigation.SceneMap({
    home: HomePage,
    workout: WorkoutTab,
    trainer: TrainerTab,
  });

  return (
    <>
      <SystemBars style="auto" />
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </>
  );
};