import { Text, View } from "react-native";
import { useTheme } from "react-native-paper";

export default function CompactChip({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const theme = useTheme();

  return (
    <View
      className={`px-2 py-1 rounded-full ${className}`}
      style={{ backgroundColor: theme.colors.surfaceVariant }}
    >
      <Text
        className="text-sm"
        style={{ color: theme.colors.onSurfaceVariant }}
      >
        {children}
      </Text>
    </View>
  );
}
