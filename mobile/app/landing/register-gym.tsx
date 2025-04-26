import { Link, Stack } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";
import { Button, List, MD3LightTheme } from "react-native-paper";
import { NavigateNextIcon } from "../../components/Icons";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useUserRegistrationStore } from "../../store/registration-store";
import Header from "../../components/ui/Header";
import { StatusBar } from "expo-status-bar";
import { ThemedView } from "../../components/ui/screen/Screen";

type GymListType = {
  id: number;
  name: string;
  address: string;
};

const MOCK_GYMS: GymListType[] = [
  {
    id: 1,
    name: "Fitness Factory",
    address: "123 Main St, New York, NY 10001",
  },
  { id: 2, name: "Gym Nation", address: "456 Broadway, Los Angeles, CA 90013" },
  { id: 3, name: "Pump House", address: "789 5th Ave, Chicago, IL 60611" },
  { id: 4, name: "Sweat Shop", address: "901 Park Ave, Houston, TX 77002" },
  { id: 5, name: "Iron Temple", address: "234 Oak St, Phoenix, AZ 85004" },
  {
    id: 6,
    name: "Core Fitness",
    address: "567 Maple St, Philadelphia, PA 19107",
  },
  { id: 7, name: "Power House", address: "890 Pine St, San Antonio, TX 78205" },
  { id: 8, name: "Fit Zone", address: "345 Cedar St, San Diego, CA 92101" },
  { id: 9, name: "Gym World", address: "678 Elm St, Dallas, TX 75201" },
  {
    id: 10,
    name: "Fitness Center",
    address: "901 Walnut St, San Jose, CA 95110",
  },
  { id: 11, name: "Body Building", address: "234 Spruce St, Austin, TX 78701" },
  {
    id: 12,
    name: "Strength Training",
    address: "567 Fir St, Jacksonville, FL 32202",
  },
  {
    id: 13,
    name: "Cardio Club",
    address: "890 Beech St, San Francisco, CA 94111",
  },
  {
    id: 14,
    name: "Weightlifting Warehouse",
    address: "345 Ash St, Indianapolis, IN 46204",
  },
  {
    id: 15,
    name: "Fitness Studio",
    address: "678 Birch St, Columbus, OH 43215",
  },
  { id: 16, name: "Gym Life", address: "901 Cherry St, Fort Worth, TX 76102" },
  {
    id: 17,
    name: "Pilates Place",
    address: "234 Cypress St, Charlotte, NC 28202",
  },
  { id: 18, name: "Yoga House", address: "567 Date St, Memphis, TN 38103" },
  {
    id: 19,
    name: "Fitness Forum",
    address: "890 Oakwood St, Boston, MA 02111",
  },
  { id: 20, name: "Gym Talk", address: "345 Palm St, Baltimore, MD 21201" },
  {
    id: 21,
    name: "Body Works",
    address: "678 Cedarwood St, Detroit, MI 48201",
  },
  {
    id: 22,
    name: "Fitness Frenzy",
    address: "901 Walnutwood St, El Paso, TX 79901",
  },
  {
    id: 23,
    name: "Strength Studio",
    address: "234 Sprucewood St, Milwaukee, WI 53202",
  },
  {
    id: 24,
    name: "Cardio Craze",
    address: "567 Firwood St, Seattle, WA 98101",
  },
  {
    id: 25,
    name: "Weightlifting World",
    address: "890 Beechwood St, Denver, CO 80202",
  },
  {
    id: 26,
    name: "Fitness Factory Outlet",
    address: "345 Ashwood St, Washington, D.C. 20001",
  },
  {
    id: 27,
    name: "Gym Central",
    address: "678 Birchwood St, Nashville, TN 37201",
  },
  {
    id: 28,
    name: "Pilates Palace",
    address: "234 Cypresswood St, Oklahoma City, OK 73102",
  },
  { id: 29, name: "Yoga Yoga", address: "567 Datewood St, Portland, OR 97201" },
  {
    id: 30,
    name: "Fitness Frenzy Zone",
    address: "890 Oakwood St, Las Vegas, NV 89101",
  },
];

export default function RegisterGymPage() {
  const { usualGymID, setUsualGymID } = useUserRegistrationStore(
    useShallow((state) => ({
      usualGymID: state.usualGymID,
      setUsualGymID: state.setUsualGymID,
    })),
  );

  return (
    <ThemedView className="h-full">
      <Header title="Select your usual gym" />

      <FlatList
        data={MOCK_GYMS}
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            description={item.address}
            left={(props) =>
              usualGymID === item.id && <List.Icon {...props} icon="check" />
            }
            onPress={() => {
              usualGymID !== item.id
                ? setUsualGymID(item.id)
                : setUsualGymID(null);
            }}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={() => (
          <Text className="m-8 text-center">No gyms found...</Text>
        )}
      />

      <View className="p-4 gap-4">
        <Link asChild href="/landing/register-likes">
          <Pressable>
            <Button
              className="w-full"
              icon={({ color }) => <NavigateNextIcon color={color} />}
              mode="contained"
            >
              {usualGymID === null ? "Skip" : "Next"}
            </Button>
          </Pressable>
        </Link>
      </View>
    </ThemedView>
  );
}
