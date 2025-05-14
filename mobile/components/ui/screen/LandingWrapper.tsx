import { ImageBackground, View } from "react-native";
import { SystemBars } from "react-native-edge-to-edge";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import landingBackground from "../../../assets/landing-background.jpg";
import UltraLogoText from "../logo-text";

export default function LandingWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1">
      <View className="bg-black w-full h-full">
        <SystemBars style="light" />
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
            <View className="w-full bg-black px-8 pt-8 pb-14 gap-4">
              {children}
            </View>
          </View>
        </ImageBackground>
      </View>
    </KeyboardAvoidingView>
  );
}
