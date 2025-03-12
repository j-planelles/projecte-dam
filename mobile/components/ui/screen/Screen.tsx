import { ScrollView, View } from "react-native";
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
  return <View className="gap-4 p-4">{children}</View>;
}
