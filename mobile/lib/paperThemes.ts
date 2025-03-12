import { MD3DarkTheme } from "react-native-paper";
import { ThemeProp } from "react-native-paper/lib/typescript/types";

export const monocromePaperTheme: ThemeProp = {
	dark: true,
	colors: { ...MD3DarkTheme.colors, primary: "#FFFFFF", background: "#000000" },
};
