import { ScrollView, View } from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Screen({ children }: { children?: React.ReactNode }) {
	return (
		<SafeAreaView>
			<ScrollView>
				<BasicView>{children}</BasicView>
			</ScrollView>
		</SafeAreaView>
	);
}

export function BasicScreen({ children }: { children?: React.ReactNode }) {
	return (
		<SafeAreaView>
			<BasicView>{children}</BasicView>
		</SafeAreaView>
	);
}

export function BasicView({ children }: { children?: React.ReactNode }) {
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

export function ThemedView({ children, className }: { children?: React.ReactNode, className?: string }) {
	const theme = useTheme();

	return (
		<View style={{ backgroundColor: theme.colors.background }} className={`flex-1 ${className}`}>{children}</View>
	);
}
