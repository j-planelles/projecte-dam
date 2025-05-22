import { ImageBackground, View } from "react-native";
import { SystemBars } from "react-native-edge-to-edge";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import landingBackground from "../../../assets/landing-background.jpg";
import UltraLogoText from "../logo-text";

/**
 * @interface LandingWrapperProps
 * @description Defineix les propietats que pot acceptar el component `LandingWrapper`.
 * @property {React.ReactNode} children - El contingut principal que es renderitzarà dins
 *                                        de l'àrea designada a la part inferior de la pantalla.
 *                                        Normalment, seran formularis d'inici de sessió, botons, etc.
 */
interface LandingWrapperProps {
  children: React.ReactNode;
}

/**
 * @component LandingWrapper
 * @description Un component "wrapper" per a les pantalles d'inici de sessió i registre.
 * Estableix una imatge de fons a pantalla completa, mostra el logo de l'aplicació a la part superior
 * i proporciona una secció per al contingut principal (`children`) que s'ajusta automàticament 
 * per evitar ser tapat pel teclat.
 *
 * @param {LandingWrapperProps} props - Les propietats del component.
 * @returns {JSX.Element} El component LandingWrapper renderitzat.
 */
export default function LandingWrapper({
  children,
}: LandingWrapperProps): JSX.Element {
  const insets = useSafeAreaInsets();

  return (
    // `KeyboardAvoidingView` ajusta automàticament el seu contingut quan apareix el teclat.
    <KeyboardAvoidingView behavior="padding" className="flex-1">
      <View className="bg-black w-full h-full">
        <SystemBars style="light" />
        {/* `ImageBackground` mostra una imatge com a fons del seu contingut. */}
        <ImageBackground
          source={landingBackground}
          className="w-full h-full"
          resizeMode="cover"
        >
          {/* Component del logo de l'aplicació. */}
          <View
            className="w-full absolute left-0 flex items-center"
            style={{ top: insets.top }}
          >
            <UltraLogoText fill="#FFF" />
          </View>

          <View className="w-full absolute bottom-0 left-0">
            {/* Secció per a l'atribució de la foto. */}
            <View className="w-full p-2">
              <Text style={{ color: "gray" }}>
                Photo by Kirill Bogomolov on Unsplash
              </Text>
            </View>
            {/* Contenidor principal pel contingut. */}
            <View className="w-full bg-black px-8 pt-8 pb-14 gap-4">
              {children}
            </View>
          </View>
        </ImageBackground>
      </View>
    </KeyboardAvoidingView>
  );
}