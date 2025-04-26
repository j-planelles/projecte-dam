import { useState } from "react";
import { View } from "react-native";
import { Searchbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { FlatList } from "react-native";
import WorkoutCard from "../../components/ui/WorkoutCard";
import Header from "../../components/ui/Header";
import { SAMPLE_WORKOUTS } from "../../lib/sampleData";
import { ThemedView } from "../../components/ui/screen/Screen";

export default function CommunityTemplateSearchPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <ThemedView>
      <Header title="Search Templates" />
      <View className="gap-4 px-4 pt-4">
        <Searchbar
          placeholder="Search"
          value={searchTerm}
          onChangeText={setSearchTerm}
          className="flex-1"
        />

        <FlatList
          data={SAMPLE_WORKOUTS}
          keyExtractor={(item) => item.uuid}
          renderItem={({ item }) => (
            <WorkoutCard
              workout={item}
              className="mb-2"
              showDescription
              showCreator
              showTimestamp={false}
              onPress={() =>
                router.push(`/community/template-view/${item.uuid}`)
              }
            />
          )}
        />
      </View>
    </ThemedView>
  );
}
