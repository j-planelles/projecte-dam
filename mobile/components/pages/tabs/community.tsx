import { Link, useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import { Button, IconButton, Text } from "react-native-paper";
import { QRCodeScannerIcon, SearchIcon } from "../../Icons";
import WorkoutCard from "../../ui/WorkoutCard";
import HomeTabsScreen from "../../ui/screen/HomeTabsScreen";

export default function CommunityTab() {
  return (
    <HomeTabsScreen>
      <Text variant="headlineLarge">Ultra Community</Text>

      <View className="flex-1 flex-row items-center">
        <Link href="/community/template-search" asChild>
          <Button
            icon={({ color }) => <SearchIcon color={color} />}
            mode="contained"
            onPress={() => console.log("Pressed")}
            className="flex-1"
          >
            Search
          </Button>
        </Link>

        <IconButton
          icon={({ color }) => <QRCodeScannerIcon color={color} />}
          mode="contained"
          onPress={() => console.log("Pressed")}
        />
      </View>

      <FeaturedTemplatesList />
    </HomeTabsScreen>
  );
}

const FeaturedTemplatesList = () => {
  const router = useRouter();
  return (
    <>
      <Text className="flex-1 text-lg font-bold">Featured</Text>

      <WorkoutCard
        onPress={() => router.push(`/community/template-view/antoino`)}
      />
    </>
  );
};
