import React from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { Avatar, Button, Text } from "react-native-paper";
import { PersonRemoveIcon } from "../../components/Icons";
import Header from "../../components/ui/Header";

export default function ProfileSettingsPage() {
  const TRAINER_AWKNOLEDGED = false;

  return (
    <View className="flex-1">
      <Header title="Manage your trainer" />
      <ScrollView>
        <View className="pt-4 gap-4">
          <View className="mx-4 gap-4">
            <ProfilePictureHeader />
            <Text variant="bodyMedium">
              You’re always in control. Customize your fitness journey by
              setting boundaries for what trainers can suggest or adjust—from
              workout plans and intensity levels to communication preferences.
            </Text>
            {TRAINER_AWKNOLEDGED ? (
              <Button
                mode="outlined"
                icon={({ color }) => <PersonRemoveIcon color={color} />}
              >
                Unenroll with trainer
              </Button>
            ) : (
              <>
                <View className="flex-row items-center gap-4 justify-center">
                  <ActivityIndicator size="large" />
                  <Text variant="titleSmall">
                    Jordi is reviewing your application...
                  </Text>
                </View>
                <Button
                  mode="outlined"
                  icon={({ color }) => <PersonRemoveIcon color={color} />}
                >
                  Cancel enrollment application
                </Button>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const ProfilePictureHeader = () => {
  return (
    <View className="flex-1 flex-row items-center gap-4">
      <Avatar.Text size={48} label="J" />
      <View className="flex-1">
        <Text className="text-xl font-bold">Jordi Planelles Pérez</Text>
      </View>
    </View>
  );
};
