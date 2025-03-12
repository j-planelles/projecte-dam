import { Link, Stack, useRouter } from "expo-router";
import { FlatList, Pressable, View } from "react-native";
import { Appbar, IconButton, List } from "react-native-paper";
import { AddIcon } from "../../components/Icons";
import Header from "../../components/ui/Header";
import { SAMPLE_EXERCISES } from "../../lib/sampleData";


export default function ExerciseListPage() {
  const router = useRouter();

  return (
    <View className="flex-1">
      <Header title="Manage Exercises">
        <Appbar.Action
          icon={({ color }) => <AddIcon color={color} />}
          onPress={() => {
            router.push("/workout/exercise-edit/");
          }}
        />
      </Header>
        <FlatList
          data={SAMPLE_EXERCISES}
          keyExtractor={(item) =>
            item.uuid === undefined ? Math.random().toString() : item.uuid
          }
          renderItem={({ item }) => (
            <Link asChild href={`/workout/exercise-edit/${item.uuid}`}>
              <List.Item title={item.name} />
            </Link>
          )}
        />
    </View>
  );
}
