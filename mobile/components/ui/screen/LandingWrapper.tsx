import { StatusBar } from "expo-status-bar";
import { ImageBackground, View } from "react-native";
import landingBackground from "../../../assets/landing-background.jpg";

export default function LandingWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <View className="bg-black w-full h-full">
      <StatusBar style="light" />
      <ImageBackground
        source={landingBackground}
        className="w-full h-full"
        resizeMode="cover"
      >
        <View className="w-full absolute bottom-0 left-0 bg-black px-8 pb-20 pt-8 gap-4">
          {children}
        </View>
      </ImageBackground>
    </View>
  );
}
