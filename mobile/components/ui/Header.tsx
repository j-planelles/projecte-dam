import { useRouter } from "expo-router";
import type { StyleProp, ViewStyle } from "react-native";
import { SystemBars } from "react-native-edge-to-edge";
import { Appbar } from "react-native-paper";

/**
 * @interface HeaderProps
 * @description Defineix les propietats que pot acceptar el component `Header`.
 * @property {React.ReactNode} [children] - Elements fills opcionals que es renderitzaran
 *                                          dins de l'Appbar, generalment a la dreta del títol.
 *                                          Pot ser utilitzat per afegir `Appbar.Action` o altres components.
 * @property {string} [title] - El títol que es mostrarà a l'Appbar. Si és una cadena buida
 *                              o no es proporciona, no es renderitzarà `Appbar.Content`.
 * @property {StyleProp<ViewStyle>} [style] - Estils personalitzats opcionals per aplicar al component `Appbar.Header`.
 */
interface HeaderProps {
  children?: React.ReactNode;
  title?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * @component Header
 * @description Un component de capçalera estàndard per a les pàgines de l'aplicació.
 * Mostra una `Appbar` amb un botó de retrocés per navegar a la pantalla anterior. 
 * Pot mostrar un títol i permet la inclusió d'altres accions.
 * També configura l'estil de la barra d'estat del sistema (`SystemBars`).
 *
 * @param {HeaderProps} props - Les propietats del component.
 * @returns {JSX.Element} El component Header renderitzat.
 */
export default function Header({
  children,
  title,
  style,
}: HeaderProps): JSX.Element {
  // Hook per accedir a l'objecte de routing d'Expo Router
  const router = useRouter();

  return (
    <>
      {/*
        Configura la barra d'estat del sistema.
        L'estil "auto" ajusta automàticament el color del text de la barra d'estat
        (clar o fosc) en funció del color de fons de la capçalera.
      */}
      <SystemBars style="auto" />
      {/*
        Component principal de la capçalera de React Native Paper.
        S'apliquen els estils personalitzats si es proporcionen.
      */}
      <Appbar.Header style={style}>
        {/*
          Acció de retrocés. Quan es prem, utilitza el router per navegar
          a la pantalla anterior a la pila de navegació.
        */}
        <Appbar.BackAction onPress={() => router.back()} />
        {/*
          Contingut del títol de l'Appbar.
          Només es renderitza si `title` no és una cadena buida.
          Això evita que es mostri un espai buit si no hi ha títol.
        */}
        {title !== "" && <Appbar.Content title={title} />}
        {/*
          Renderitza qualsevol element fill que s'hagi passat al component.
          Això permet afegir icones d'acció personalitzades o altres elements
          a la dreta de la capçalera.
        */}
        {children}
      </Appbar.Header>
    </>
  );
}