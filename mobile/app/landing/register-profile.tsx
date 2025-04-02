import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Text } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { z } from "zod";
import LandingWrapper from "../../components/ui/screen/LandingWrapper";
import { NavigateNextIcon } from "../../components/Icons";
import { monocromePaperTheme } from "../../lib/paperThemes";
import { useShallow } from "zustand/react/shallow";
import { useUserRegistrationStore } from "../../store/registration-store";
import { useAuthStore } from "../../store/auth-store";

const schema = z.object({
	name: z.string(),
	bio: z.string().optional(),
});
type FormSchemaType = z.infer<typeof schema>;

export default function LandingRegisterProfilePage() {
	const router = useRouter();
	const { apiClient, token } = useAuthStore(
		useShallow((state) => ({
			apiClient: state.apiClient,
			token: state.token,
		})),
	);
	const {
		control,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<FormSchemaType>({ resolver: zodResolver(schema) });
	const { setName, setBiography } = useUserRegistrationStore(
		useShallow((state) => ({
			setName: state.setName,
			setBiography: state.setBiography,
		})),
	);

	const submitHandler = async ({ name, bio }: FormSchemaType) => {
		try {
			const result = await apiClient.post(
				"/auth/profile",
				{
					biography: bio,
					full_name: name,
				},
				{ headers: { Authorization: `Bearer ${token}` } },
			);

			console.log(result);

			router.push("/landing/register-gym");
		} catch {
			setError("root", { type: "manual", message: "Something went wrong." });
		}
	};

	return (
		<LandingWrapper>
			<>
				<Text className="text-white text-4xl">Set up your profile</Text>

				<Controller
					control={control}
					name="name"
					rules={{ required: true }}
					render={({ field: { onChange, onBlur, value } }) => (
						<TextInput
							label="Name"
							value={value}
							onChangeText={onChange}
							onBlur={onBlur}
							placeholder="John Doe"
							mode="outlined"
							theme={monocromePaperTheme}
							error={errors.name != undefined}
						/>
					)}
				/>
				{errors.name && (
					<Text className="font-bold text-red-500">{errors.name.message}</Text>
				)}

				<Controller
					control={control}
					name="bio"
					rules={{ required: true }}
					render={({ field: { onChange, onBlur, value } }) => (
						<TextInput
							label="Biography"
							value={value}
							onChangeText={onChange}
							onBlur={onBlur}
							mode="outlined"
							placeholder="We go gym!"
							theme={monocromePaperTheme}
							error={errors.bio != undefined}
							multiline
						/>
					)}
				/>
				{errors.bio && (
					<Text className="font-bold text-red-500">{errors.bio.message}</Text>
				)}

				{errors.root && (
					<Text className="font-bold text-red-500">{errors.root.message}</Text>
				)}

				<Button
					icon={({ color }) => <NavigateNextIcon color={color} />}
					mode="contained"
					loading={isSubmitting}
					disabled={isSubmitting}
					onPress={handleSubmit(submitHandler)}
					theme={monocromePaperTheme}
				>
					Next
				</Button>
			</>
		</LandingWrapper>
	);
}
