import { useRouter } from "expo-router";
import { FlatList, View } from "react-native";
import { Avatar, Button, List, Text } from "react-native-paper";
import { NavigateNextIcon } from "../../../components/Icons";
import Header from "../../../components/ui/Header";
import { useState } from "react";

const SAMPLE_TRAINERS: trainer[] = [
  {
    username: "trainer1",
    name: "John Doe",
    description: "A beginner trainer with a passion for Pokémon.",
  },
  {
    username: "trainer2",
    name: "Jane Doe",
    description: "An experienced trainer with a team of powerful Pokémon.",
  },
  {
    username: "trainer3",
    name: "Bob Smith",
    description: "A young trainer with a dream to become a Pokémon Master.",
  },
  {
    username: "trainer4",
    name: "Alice Johnson",
    description: "A skilled trainer with a talent for battling.",
  },
  {
    username: "trainer5",
    name: "Mike Brown",
    description: "A dedicated trainer with a love for Pokémon.",
  },
  {
    username: "trainer6",
    name: "Emily Davis",
    description: "A beginner trainer with a passion for Pokémon.",
  },
  {
    username: "trainer7",
    name: "David Lee",
    description: "An experienced trainer with a team of powerful Pokémon.",
  },
  {
    username: "trainer8",
    name: "Sarah Taylor",
    description: "A young trainer with a dream to become a Pokémon Master.",
  },
  {
    username: "trainer9",
    name: "Kevin White",
    description: "A skilled trainer with a talent for battling.",
  },
  {
    username: "trainer10",
    name: "Rebecca Martin",
    description: "A dedicated trainer with a love for Pokémon.",
  },
  {
    username: "trainer11",
    name: "James Wilson",
    description: "A beginner trainer with a passion for Pokémon.",
  },
  {
    username: "trainer12",
    name: "Jessica Thompson",
    description: "An experienced trainer with a team of powerful Pokémon.",
  },
  {
    username: "trainer13",
    name: "William Harris",
    description: "A young trainer with a dream to become a Pokémon Master.",
  },
  {
    username: "trainer14",
    name: "Amanda Garcia",
    description: "A skilled trainer with a talent for battling.",
  },
  {
    username: "trainer15",
    name: "Matthew Rodriguez",
    description: "A dedicated trainer with a love for Pokémon.",
  },
  {
    username: "trainer16",
    name: "Heather Lopez",
    description: "A beginner trainer with a passion for Pokémon.",
  },
  {
    username: "trainer17",
    name: "Brian Hall",
    description: "An experienced trainer with a team of powerful Pokémon.",
  },
  {
    username: "trainer18",
    name: "Nicole Brooks",
    description: "A young trainer with a dream to become a Pokémon Master.",
  },
  {
    username: "trainer19",
    name: "Daniel Jenkins",
    description: "A skilled trainer with a talent for battling.",
  },
  {
    username: "trainer20",
    name: "Lisa Nguyen",
    description: "A dedicated trainer with a love for Pokémon.",
  },
  {
    username: "trainer21",
    name: "Michael Sanders",
    description: "A beginner trainer with a passion for Pokémon.",
  },
  {
    username: "trainer22",
    name: "Elizabeth Russell",
    description: "An experienced trainer with a team of powerful Pokémon.",
  },
  {
    username: "trainer23",
    name: "Christopher Reynolds",
    description: "A young trainer with a dream to become a Pokémon Master.",
  },
  {
    username: "trainer24",
    name: "Katherine Foster",
    description: "A skilled trainer with a talent for battling.",
  },
  {
    username: "trainer25",
    name: "Anthony Cooper",
    description: "A dedicated trainer with a love for Pokémon.",
  },
  {
    username: "trainer26",
    name: "Samantha Peterson",
    description: "A beginner trainer with a passion for Pokémon.",
  },
  {
    username: "trainer27",
    name: "Andrew Jackson",
    description: "An experienced trainer with a team of powerful Pokémon.",
  },
  {
    username: "trainer28",
    name: "Melissa Sanchez",
    description: "A young trainer with a dream to become a Pokémon Master.",
  },
  {
    username: "trainer29",
    name: "Joshua Price",
    description: "A skilled trainer with a talent for battling.",
  },
  {
    username: "trainer30",
    name: "Lauren Lewis",
    description: "A dedicated trainer with a love for Pokémon.",
  },
];

export default function TrainerOnboardingListPage() {
  const router = useRouter();
  const [selectedTrainer, setSelectedTrainer] = useState<string>("");

  const navigationDisabled = selectedTrainer === "";

  const handleSubmit = () => {
    router.push("/");
  };

  return (
    <View className="flex-1">
      <Header title="Choose your trainer" />

      <FlatList
        data={SAMPLE_TRAINERS}
        keyExtractor={(item) => item.username}
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            description={item.description}
            left={() => (
              <View className="pl-4">
                {selectedTrainer === item.username ? (
                  <Avatar.Icon size={48} icon="check"/>
                ) : (
                  <Avatar.Text size={48} label={item.name.charAt(0)} />
                )}
              </View>
            )}
            onPress={() =>
              selectedTrainer === item.username
                ? setSelectedTrainer("")
                : setSelectedTrainer(item.username)
            }
          />
        )}
      />

      <View className="p-4 gap-4">
        {navigationDisabled && <Text>Please select a trainer.</Text>}
        <Button
          className="w-full"
          icon={({ color }) => <NavigateNextIcon color={color} />}
          disabled={navigationDisabled}
          mode="contained"
          onPress={handleSubmit}
        >
          Next
        </Button>
      </View>
    </View>
  );
}

const TrainerCard = ({ trainer }: { trainer: trainer }) => {
  return <List.Item title />;
};
