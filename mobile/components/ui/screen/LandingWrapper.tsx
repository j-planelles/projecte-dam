import { Text } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { ImageBackground, View } from "react-native";
import landingBackground from "../../../assets/landing-background.jpg";
import UltraLogoText from "../logo-text";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LandingWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View className="bg-black w-full h-full">
      <StatusBar style="light" />
      <ImageBackground
        source={landingBackground}
        className="w-full h-full"
        resizeMode="cover"
      >
        <View
          className="w-full absolute left-0 flex items-center"
          style={{ top: insets.top }}
        >
          <UltraLogoText fill="#FFF" />
        </View>
        <View className="w-full absolute bottom-0 left-0">
          <View className="w-full p-2">
            <Text style={{ color: "gray" }}>
              Photo by Kirill Bogomolov on Unsplash
            </Text>
          </View>
          <View className="w-full bg-black px-8 pb-20 pt-8 gap-4">
            {children}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}
