import { ScrollView, View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useTheme } from "react-native-paper";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

/**
 * @interface BasicViewProps
 * @description Propietats per al component `BasicView`.
 * @property {React.ReactNode} [children] - Els elements fills que es renderitzaran dins d'aquesta vista.
 */
interface BasicViewProps {
  children?: React.ReactNode;
}

/**
 * @component BasicView
 * @description Un component de vista bàsic que aplica estils comuns com el color de fons del tema,
 * espaiat entre elements fills (`gap`) i padding horitzontal.
 * És utilitzat com a base per altres components de pantalla.
 *
 * @param {BasicViewProps} props - Les propietats del component.
 * @returns {JSX.Element} El component BasicView renderitzat.
 */
export function BasicView({ children }: BasicViewProps): JSX.Element {
  const theme = useTheme();

  return (
    <View
      className="gap-4 px-4"
      style={{ backgroundColor: theme.colors.background }}
    >
      {children}
    </View>
  );
}

/**
 * @interface ScreenProps
 * @description Propietats per al component `Screen`.
 * @property {React.ReactNode} [children] - El contingut principal que es renderitzarà dins de la pantalla.
 */
interface ScreenProps {
  children?: React.ReactNode;
}

/**
 * @component Screen
 * @description Un component de pantalla bàsic que proporciona una àrea segura (`SafeAreaView`)
 * i un `ScrollView` per al contingut desplaçable. Utilitza `BasicView` per aplicar estils base.
 *
 * @param {ScreenProps} props - Les propietats del component.
 * @returns {JSX.Element} El component Screen renderitzat.
 */
export default function Screen({ children }: ScreenProps): JSX.Element {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <BasicView>{children}</BasicView>
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * @interface BasicScreenProps
 * @description Propietats per al component `BasicScreen`.
 * @property {React.ReactNode} [children] - El contingut principal que es renderitzarà dins de la pantalla.
 */
interface BasicScreenProps {
  children?: React.ReactNode;
}

/**
 * @component BasicScreen
 * @description Un component de pantalla que inclou `KeyboardAvoidingView` per gestionar
 * la superposició del teclat, `SafeAreaView` per a les àrees segures del dispositiu,
 * i `BasicView` per a estils comuns. No inclou `ScrollView` per defecte,
 * fent-lo adequat per a pantalles on desplaçament del contingut principal es gestiona internament.
 *
 * @param {BasicScreenProps} props - Les propietats del component.
 * @returns {JSX.Element} El component BasicScreen renderitzat.
 */
export function BasicScreen({ children }: BasicScreenProps): JSX.Element {
  return (
    <KeyboardAvoidingView behavior="translate-with-padding" className="flex-1">
      <SafeAreaView style={{ flex: 1 }}>
        <BasicView>{children}</BasicView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

/**
 * @interface ThemedViewProps
 * @description Propietats per al component `ThemedView`.
 * @property {React.ReactNode} [children] - Els elements fills que es renderitzaran dins d'aquesta vista.
 * @property {string} [className] - Classes CSS addicionals per aplicar al contenidor principal `View` (útil amb NativeWind/Tailwind).
 * @property {boolean} [avoidKeyboard=true] - Si és `true` (per defecte), s'embolcallarà el contingut amb `KeyboardAvoidingView`.
 *                                            Estableix a `false` per desactivar aquesta funcionalitat.
 */
interface ThemedViewProps {
  children?: React.ReactNode;
  className?: string;
  avoidKeyboard?: boolean;
}

/**
 * @component ThemedView
 * @description Un component `View` que ocupa tot l'espai disponible (`flex-1`),
 * aplica el color de fons del tema actual i gestiona el padding inferior per a l'àrea segura.
 * Opcionalment, pot incloure `KeyboardAvoidingView` per evitar que el teclat tapi el contingut.
 *
 * @param {ThemedViewProps} props - Les propietats del component.
 * @returns {JSX.Element} El component ThemedView renderitzat.
 */
export function ThemedView({
  children,
  className,
  avoidKeyboard = true, // Valor per defecte per a avoidKeyboard
}: ThemedViewProps): JSX.Element {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        paddingBottom: insets.bottom,
      }}
      className={`flex-1 ${className || ""}`}
    >
      {/* `KeyboardAvoidingView` s'utilitza per evitar que el teclat tapi el contingut. */}
      <KeyboardAvoidingView
        behavior="padding"
        className="flex-1"
        enabled={avoidKeyboard}
      >
        {/* Renderitza els elements fills passats al component. */}
        {children}
      </KeyboardAvoidingView>
    </View>
  );
}