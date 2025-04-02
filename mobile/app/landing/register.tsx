import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Text } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import { NavigateNextIcon, PersonAddIcon } from "../../components/Icons";
import LandingWrapper from "../../components/ui/screen/LandingWrapper";
import { monocromePaperTheme } from "../../lib/paperThemes";
import { useAuthStore } from "../../store/auth-store";

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
	const queryClient = useQueryClient();
	const apiClient = useAuthStore((store) => store.apiClient);
	const {
		control,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<FormSchemaType>({ resolver: zodResolver(schema) });

	const { setUsername, hashPassword, setToken } = useAuthStore(
		useShallow((state) => ({
			setUsername: state.setUsername,
			hashPassword: state.hashPassword,
			setToken: state.setToken,
		})),
	);

	const submitHandler = async ({ username, password }: FormSchemaType) => {
		try {
			setUsername(username);
			hashPassword(password);

			await apiClient.post("/auth/register", undefined, {
				queries: { username: username, password: password },
			});

			const response = await apiClient.post("/auth/token", {
				username: username,
				password: password,
			});
			setToken(response.access_token);
			console.log(response.access_token);

			queryClient.invalidateQueries({ queryKey: ["user"] });

			router.push("/landing/register-profile");
		} catch (error) {
			if (error instanceof AxiosError) {
				if (error?.response?.status === 409) {
					setError("username", {
						type: "manual",
						message: "Username already taken.",
					});
				} else {
					setError("root", {
						type: "manual",
						message: "Something went wrong.",
					});
				}
			}
		}
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
