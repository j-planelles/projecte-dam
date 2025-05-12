import { useRouter } from "expo-router";
import { SystemBars } from "react-native-edge-to-edge";
import { Appbar } from "react-native-paper";

export default function Header({
  children,
  title,
  style,
}: {
  children?: React.ReactNode;
  title?: string;
  style?: any;
}) {
  const router = useRouter();

  return (
    <>
      <SystemBars style="auto" />
      <Appbar.Header style={style}>
        <Appbar.BackAction onPress={() => router.back()} />
        {title !== "" && <Appbar.Content title={title} />}
        {children}
      </Appbar.Header>
    </>
  );
}
