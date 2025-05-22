import { MD3DarkTheme } from "react-native-paper";
import type { ThemeProp } from "react-native-paper/lib/typescript/types";

/**
 * @constant monocromePaperTheme
 * @description Un objecte de tema personalitzat per a `react-native-paper` que implementa un estil monocromàtic.
 * Utilitza una base fosca (`dark: true`) i estableix el color primari a blanc (`#FFFFFF`)
 * i el color de fons a negre (`#000000`).
 * La resta de colors s'hereten del tema fosc per defecte de Material Design 3 (`MD3DarkTheme.colors`).
 *
 * @type {ThemeProp}
 */
export const monocromePaperTheme: ThemeProp = {
  dark: true, //Indica si el tema és fosc. Establert a `true`.
  // Defineix els colors del tema.
  colors: {
    ...MD3DarkTheme.colors, // Hereta tots els colors del tema fosc per defecte de MD3
    primary: "#FFFFFF", // El color primari del tema. Establert a blanc (`#FFFFFF`).
    background: "#000000", // El color de fons principal de les pantalles. Establert a negre (`#000000`).
  },
};
