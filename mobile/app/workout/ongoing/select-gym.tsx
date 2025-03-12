import { useState } from "react";
import { FlatList, View } from "react-native";
import {
    Appbar,
    Button,
    List,
    Searchbar,
    useTheme
} from "react-native-paper";
import { FilterIcon } from "../../../components/Icons";
import Header from "../../../components/ui/Header";

const SAMPLE_GYMS: gym[] = [
  {
    uuid: "1",
    name: "City Fitness Center",
    address: "123 Main Street, Cityville",
  },
  {
    uuid: "2",
    name: "Mountain Gym",
    address: "456 Alpine Rd, Mountainview",
  },
  {
    uuid: "3",
    name: "Beachside Fitness Hub",
    address: "789 Ocean Blvd, Beachtown",
  },
  {
    uuid: "4",
    name: "Downtown Workout",
    address: "321 Central Plaza, Metropolis",
  },
  {
    uuid: "5",
    name: "Urban Bootcamp",
    address: "654 Park Ave, Urbania",
  },
  {
    uuid: "6",
    name: "Suburban Gym",
    address: "987 Suburb St, Suburbia",
  },
  {
    uuid: "7",
    name: "Riverside Fitness",
    address: "135 River Rd, Riverside",
  },
  {
    uuid: "8",
    name: "Lakeside Gym",
    address: "246 Lake Lane, Lakeview",
  },
  {
    uuid: "9",
    name: "Valley Strength",
    address: "357 Valley Blvd, Valley City",
  },
  {
    uuid: "10",
    name: "Highland Workout",
    address: "468 Highland Dr, Highville",
  },
  {
    uuid: "11",
    name: "Prestige Fitness",
    address: "579 Prestige Pkwy, Uptown",
  },
  {
    uuid: "12",
    name: "Prime Bodyworks",
    address: "680 Prime St, Bodytown",
  },
  {
    uuid: "13",
    name: "Revamp Fitness",
    address: "791 Revamp Ave, Fitnessville",
  },
  {
    uuid: "14",
    name: "Peak Performance Gym",
    address: "802 Summit Rd, Peak City",
  },
  {
    uuid: "15",
    name: "Infinity Fitness",
    address: "913 Infinity Blvd, Looptown",
  },
  {
    uuid: "16",
    name: "Momentum Gym",
    address: "124 Momentum Way, Fasttown",
  },
  {
    uuid: "17",
    name: "Dynamic Fitness",
    address: "235 Dynamic Ave, Power City",
  },
  {
    uuid: "18",
    name: "Core Strength Club",
    address: "346 Core Rd, Vitality",
  },
  {
    uuid: "19",
    name: "Elite Workout",
    address: "457 Elite St, Champ City",
  },
  {
    uuid: "20",
    name: "Ultimate Gym",
    address: "568 Ultimate Blvd, Victory",
  },
];
export default function OngoingWorkoutSelectGymPage() {
  const theme = useTheme();
  const [selectedGym, setSelectedGym] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  return (
    <View className="flex-1">
      <Header title="Change gym"/>
      <View className="px-4 py-2">
        <Searchbar
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Search gyms..."
        />
      </View>

      <FlatList
        data={SAMPLE_GYMS}
        keyExtractor={(item) =>
          item.uuid ? item.uuid : Math.random().toString()
        }
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            onPress={() =>
              setSelectedGym((state) => (item.uuid === state ? "" : item.uuid))
            }
            left={(props) =>
              item.uuid === selectedGym && <List.Icon {...props} icon="check" />
            }
            style={{
              backgroundColor:
                item.uuid === selectedGym
                  ? theme.colors.primaryContainer
                  : "transparent",
            }}
          />
        )}
      />

      <View className="px-4 py-2 gap-2">
        <Button mode="contained">Save</Button>
      </View>
    </View>
  );
}
