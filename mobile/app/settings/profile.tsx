import React from "react";
import { ScrollView, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { LogOutIcon, PersonRemoveIcon } from "../../components/Icons";
import Header from "../../components/ui/Header";

export default function ProfileSettingsPage() {
	return (
		<View className="flex-1">
			<Header title="Your profile" />
			<ScrollView>
				<View className="pt-4 gap-4">
					<View className="mx-4 gap-2">
						<Text variant="titleSmall">User data</Text>
						<TextInput
							label="Username"
							placeholder="j.planelles"
							mode="outlined"
							autoCorrect={false}
							autoCapitalize="none"
						/>
						<TextInput
							mode="outlined"
							label="Name"
							placeholder="Jordi Planelles"
						/>
						<TextInput
							mode="outlined"
							label="Biography"
							multiline
							placeholder="Femboy by day, gym bro by night 🏋️♂️🌈🇹🇷"
						/>
						<Button mode="outlined">Update user data</Button>
					</View>

					<View className="mx-4 gap-2">
						<Text variant="titleSmall">Change Password</Text>
						<TextInput label="Password" mode="outlined" secureTextEntry />
						<TextInput
							label="Repeat Password"
							mode="outlined"
							secureTextEntry
						/>
						<Button mode="outlined">Change password</Button>
					</View>

					<View className="mx-4 gap-2">
						<Text variant="titleSmall">About you</Text>
						<Text>
							We use your likes to better pair you with a personal trainer.{" "}
						</Text>
						<Button mode="outlined">Review my likes</Button>
						<Text>
							Your usual gym will be used to set the location field in new
							workouts.
						</Text>
						<Button mode="outlined">Change my usual gym</Button>
					</View>

					<View className="mx-4 gap-2">
						<Text variant="titleSmall" className="pb-2">
							Danger zone
						</Text>
						<Button
							mode="outlined"
							icon={({ color }) => <LogOutIcon color={color} />}
						>
							Log Out
						</Button>
						<Button
							mode="outlined"
							icon={({ color }) => <PersonRemoveIcon color={color} />}
						>
							Delete Account
						</Button>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}
