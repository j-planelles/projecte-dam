import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Text } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { z } from "zod";
import LandingWrapper from "../../components/ui/screen/LandingWrapper";
import { NavigateNextIcon, PersonAddIcon } from "../../components/Icons";
import { monocromePaperTheme } from "../../lib/paperThemes";
import { useAuthStore } from "../../store/auth-store";
import { useShallow } from "zustand/react/shallow";
import { useEffect } from "react";

const schema = z.object({
	username: z.string(),
	password: z.string().min(8),
});

type FormSchemaType = z.infer<typeof schema>;

export default function LandingLoginPage() {
	const router = useRouter();
	const {
		control,
		handleSubmit,
		setError,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<FormSchemaType>({ resolver: zodResolver(schema) });

	const {
		username: storeUsername,
		setUsername,
		hashPassword,
		setToken,
	} = useAuthStore(
		useShallow((state) => ({
			username: state.username,
			setUsername: state.setUsername,
			hashPassword: state.hashPassword,
			setToken: state.setToken,
		})),
	);

	useEffect(() => {
		setValue("username", storeUsername);
	}, [storeUsername]);

	const submitHandler = ({ username, password }: FormSchemaType) => {
		setUsername(username);
		hashPassword(password);
		setToken(username); // Temporal solution

		router.push("/");
	};

	return (
		<LandingWrapper>
			<>
				<Text className="text-white text-4xl">Login to Ultra</Text>

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

				<Button
					icon={({ color }) => <NavigateNextIcon color={color} />}
					mode="contained"
					loading={isSubmitting}
					disabled={isSubmitting}
					onPress={handleSubmit(submitHandler)}
					theme={monocromePaperTheme}
				>
					Log in
				</Button>

				<Text className="text-white text-center text-gray-300">or</Text>

				<Button
					icon={({ color }) => <PersonAddIcon color={color} />}
					mode="outlined"
					disabled={isSubmitting}
					onPress={() => {
						router.navigate("/landing/register");
					}}
					theme={monocromePaperTheme}
				>
					Create an account
				</Button>
			</>
		</LandingWrapper>
	);
}
