import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Link } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { Appbar, Avatar, Button, HelperText, Text } from "react-native-paper";
import { useShallow } from "zustand/react/shallow";
import {
	PersonAddIcon,
	PersonRemoveIcon,
	RefreshIcon,
} from "../../components/Icons";
import Header from "../../components/ui/Header";
import { ThemedView } from "../../components/ui/screen/Screen";
import { useAuthStore } from "../../store/auth-store";

export default function ProfileSettingsPage() {
	const queryClient = useQueryClient();
	const { apiClient, token } = useAuthStore(
		useShallow((state) => ({
			apiClient: state.apiClient,
			token: state.token,
		})),
	);

	const requestQuery = useQuery({
		queryKey: ["user", "trainer", "/user/trainer/status"],
		queryFn: async () =>
			await apiClient.get("/user/trainer/status", {
				headers: { Authorization: `Bearer ${token}` },
			}),
	});
	const infoQuery = useQuery({
		queryKey: ["user", "trainer", "/user/trainer/info"],
		queryFn: async () =>
			await apiClient.get("/user/trainer/info", {
				headers: { Authorization: `Bearer ${token}` },
			}),
	});

	const isLoading = infoQuery.isLoading || requestQuery.isLoading;
	const isFetching = infoQuery.isFetching || requestQuery.isFetching;

	const refreshHandler = () => {
		queryClient.invalidateQueries({ queryKey: ["user", "trainer"] });
	};

	return (
		<ThemedView className="flex-1">
			<Header title="Manage your trainer">
				{!isLoading && (
					<Appbar.Action
						icon={({ color }) => <RefreshIcon color={color} />}
						onPress={refreshHandler}
						disabled={isFetching}
					/>
				)}
			</Header>
			{isLoading ? (
				<ActivityIndicator />
			) : (
				<ScrollView>
					<View className="pt-4 gap-4">
						<View className="mx-4 gap-4">
							{requestQuery.isSuccess ||
								(infoQuery.isSuccess && (
									<ProfilePictureHeader
										fullName={
											infoQuery.isSuccess
												? infoQuery.data.full_name
												: requestQuery.data?.full_name || ""
										}
									/>
								))}
							<Text variant="bodyMedium">
								You’re always in control. Customize your fitness journey by
								setting boundaries for what trainers can suggest or adjust—from
								workout plans and intensity levels to communication preferences.
							</Text>
							{requestQuery.isSuccess ? (
								<ReviewingContent fullName={requestQuery.data.full_name} />
							) : infoQuery.isSuccess ? (
								<EnrolledContent />
							) : (
								<UnenrolledContent />
							)}
						</View>
					</View>
				</ScrollView>
			)}
		</ThemedView>
	);
}

const UnenrolledContent = () => {
	return (
		<Link asChild href="/trainer/onboarding/likes">
			<Button
				mode="outlined"
				icon={({ color }) => <PersonAddIcon color={color} />}
			>
				Enroll with trainer
			</Button>
		</Link>
	);
};

const EnrolledContent = () => {
	const queryClient = useQueryClient();
	const { apiClient, token } = useAuthStore(
		useShallow((state) => ({
			apiClient: state.apiClient,
			token: state.token,
		})),
	);

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [queryError, setQueryError] = useState<string | null>(null);

	const unenrollHandler = async () => {
		setIsLoading(true);
		setQueryError(null);
		try {
			await apiClient.post("/user/trainer/unpair", undefined, {
				headers: { Authorization: `Bearer ${token}` },
			});
			queryClient.invalidateQueries({ queryKey: ["user", "trainer"] });
		} catch (error: any) {
			if (error instanceof AxiosError) {
				setQueryError(`${error?.request?.status} ${error?.request?.response}.`);
			} else {
				setQueryError(`${error?.message}`);
				console.error(error.message);
			}
		}
		setIsLoading(false);
	};

	return (
		<>
			<Button
				mode="outlined"
				icon={({ color }) => <PersonRemoveIcon color={color} />}
				disabled={isLoading}
				onPress={unenrollHandler}
			>
				Unenroll with trainer
			</Button>
			{queryError && <HelperText type="error">{queryError}</HelperText>}
		</>
	);
};

const ReviewingContent = ({ fullName }: { fullName: string }) => {
	const queryClient = useQueryClient();
	const { apiClient, token } = useAuthStore(
		useShallow((state) => ({
			apiClient: state.apiClient,
			token: state.token,
		})),
	);

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [queryError, setQueryError] = useState<string | null>(null);

	const unenrollHandler = async () => {
		setIsLoading(true);
		setQueryError(null);
		try {
			await apiClient.post("/user/trainer/cancel-request", undefined, {
				headers: { Authorization: `Bearer ${token}` },
			});
			queryClient.invalidateQueries({ queryKey: ["user", "trainer"] });
		} catch (error: any) {
			if (error instanceof AxiosError) {
				setQueryError(`${error?.request?.status} ${error?.request?.response}.`);
			} else {
				setQueryError(`${error?.message}`);
				console.error(error.message);
			}
		}
		setIsLoading(false);
	};
	return (
		<>
			<View className="flex-row items-center gap-4 justify-center">
				<ActivityIndicator size="large" />
				<Text variant="titleSmall">
					{fullName.split(" ")[0]} is reviewing your application...
				</Text>
			</View>
			<Button
				mode="outlined"
				icon={({ color }) => <PersonRemoveIcon color={color} />}
				disabled={isLoading}
				onPress={unenrollHandler}
			>
				Cancel enrollment applicaiton
			</Button>
			{queryError && <HelperText type="error">{queryError}</HelperText>}
		</>
	);
};

const ProfilePictureHeader = ({ fullName }: { fullName: string }) => {
	const profilePicturePlaceholder = fullName.charAt(0).toUpperCase();

	return (
		<View className="flex-1 flex-row items-center gap-4">
			<Avatar.Text size={48} label={profilePicturePlaceholder} />
			<View className="flex-1">
				<Text className="text-xl font-bold">{fullName}</Text>
			</View>
		</View>
	);
};
