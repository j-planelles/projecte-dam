import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Text } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { z } from "zod";
import LandingWrapper from "../../components/ui/screen/LandingWrapper";
import { NavigateNextIcon, PersonAddIcon } from "../../components/Icons";
import { monocromePaperTheme } from "../../lib/paperThemes";
import { useUserRegistrationStore } from "../../store/registration-store";
import { useShallow } from "zustand/react/shallow";

const schema = z
	.object({
		username: z.string(),
		password: z.string().min(8),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match.",
		path: ["confirmPassword"],
	});

type FormSchemaType = z.infer<typeof schema>;

export default function LandingRegisterPage() {
	const router = useRouter();
	const {
		control,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<FormSchemaType>({ resolver: zodResolver(schema) });

	const { setUsername, hashPassword } = useUserRegistrationStore(
		useShallow((state) => ({
			setUsername: state.setUsername,
			hashPassword: state.hashPassword,
		})),
	);

	const submitHandler = ({ username, password }: FormSchemaType) => {
		setUsername(username);
		hashPassword(password);

		// TODO: Check if username is already taken

		router.push("/landing/register-profile");
	};

	return (
		<LandingWrapper>
			<>
				<Text className="text-white text-4xl">Create an account</Text>

				<Controller
					control={control}
					name="username"
					rules={{ required: true }}
					render={({ field: { onChange, onBlur, value } }) => (
						<TextInput
							label="Username"
							value={value}
							onChangeText={onChange}
							onBlur={onBlur}
							placeholder="john.doe"
							mode="outlined"
							theme={monocromePaperTheme}
							error={errors.username != undefined}
							autoCorrect={false}
							autoCapitalize="none"
						/>
					)}
				/>
				{errors.username && (
					<Text className="font-bold text-red-500">
						{errors.username.message}
					</Text>
				)}

				<Controller
					control={control}
					name="password"
					rules={{ required: true }}
					render={({ field: { onChange, onBlur, value } }) => (
						<TextInput
							label="Password"
							value={value}
							onChangeText={onChange}
							onBlur={onBlur}
							mode="outlined"
							theme={monocromePaperTheme}
							error={errors.password != undefined}
							secureTextEntry
						/>
					)}
				/>
				{errors.password && (
					<Text className="font-bold text-red-500">
						{errors.password.message}
					</Text>
				)}

				<Controller
					control={control}
					name="confirmPassword"
					rules={{ required: true }}
					render={({ field: { onChange, onBlur, value } }) => (
						<TextInput
							label="Confirm password"
							value={value}
							onChangeText={onChange}
							onBlur={onBlur}
							mode="outlined"
							theme={monocromePaperTheme}
							error={errors.confirmPassword != undefined}
							secureTextEntry
						/>
					)}
				/>
				{errors.confirmPassword && (
					<Text className="font-bold text-red-500">
						{errors.confirmPassword.message}
					</Text>
				)}

				<Button
					icon={({ color }) => <NavigateNextIcon color={color} />}
					mode="contained"
					loading={isSubmitting}
					disabled={isSubmitting}
					onPress={handleSubmit(submitHandler)}
					theme={monocromePaperTheme}
				>
					Create an account
				</Button>

				<Text className="text-white text-center text-gray-300">or</Text>

				<Button
					icon={({ color }) => <PersonAddIcon color={color} />}
					mode="outlined"
					disabled={isSubmitting}
					onPress={() => {
						router.back();
					}}
					theme={monocromePaperTheme}
				>
					Login instead
				</Button>
			</>
		</LandingWrapper>
	);
}
