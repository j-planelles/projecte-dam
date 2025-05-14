import { ScrollView, View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useTheme } from "react-native-paper";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

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
    <KeyboardAvoidingView behavior="translate-with-padding" className="flex-1">
      <SafeAreaView>
        <BasicView>{children}</BasicView>
      </SafeAreaView>
    </KeyboardAvoidingView>
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

export function ThemedView({
  children,
  className,
  avoidKeyboard = true,
}: {
  children?: React.ReactNode;
  className?: string;
  avoidKeyboard?: boolean;
}) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        paddingBottom: insets.bottom,
      }}
      className={`flex-1 ${className}`}
    >
      <KeyboardAvoidingView
        behavior="padding"
        className="flex-1"
        enabled={avoidKeyboard}
      >
        {children}
      </KeyboardAvoidingView>
    </View>
  );
}
