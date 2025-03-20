import { View, Text } from "react-native";
import { useTheme } from "react-native-paper";

export default function InfoCard({
	children,
	left,
	right,
	className,
}: {
	children: React.ReactNode;
	left?: React.ReactNode;
	right?: React.ReactNode;
	className?: string;
}) {
	const theme = useTheme();
	return (
		<View
			className={`min-h-16 flex-1 flex-row items-center px-4 py-2 gap-4 rounded-lg ${className}`}
			style={{ backgroundColor: theme.colors.surfaceVariant }}
		>
			{left}
			<Text className="flex-1" style={{ color: theme.colors.onSurfaceVariant }}>
				{children}
			</Text>
			{right}
		</View>
	);
}
