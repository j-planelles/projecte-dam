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
import { useAuthStore } from "../../store/auth-store";
import { useEffect } from "react";

const schema = z.object({
	ip: z.string().url(),
});

type FormSchemaType = z.infer<typeof schema>;

export default function LandingServerPage() {
	const router = useRouter();
	const {
		control,
		handleSubmit,
		setValue,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<FormSchemaType>({ resolver: zodResolver(schema) });

	const { serverIp, setServerIp } = useAuthStore(
		useShallow((state) => ({
			serverIp: state.serverIp,
			setServerIp: state.setServerIp,
		})),
	);

	const submitHandler = ({ ip }: FormSchemaType) => {
		setServerIp(ip);

		router.push("/landing/login");
	};

	useEffect(() => {
		setValue("ip", serverIp);
	}, [serverIp]);

	return (
		<LandingWrapper>
			<>
				<Text className="text-white text-4xl">Choose a Server</Text>

				<Controller
					control={control}
					name="ip"
					rules={{ required: true }}
					render={({ field: { onChange, onBlur, value } }) => (
						<TextInput
							label="Server IP"
							value={value}
							onChangeText={onChange}
							onBlur={onBlur}
							placeholder="https://ultra.jplanelles.cat"
							mode="outlined"
							theme={monocromePaperTheme}
							error={errors.ip != undefined}
							textContentType="none"
							autoCorrect={false}
							autoCapitalize="none"
						/>
					)}
				/>

				{errors.ip && (
					<Text className="font-bold text-red-500">{errors.ip.message}</Text>
				)}

				<Button
					icon={({ color }) => <NavigateNextIcon color={color} />}
					mode="contained"
					loading={isSubmitting}
					disabled={isSubmitting}
					onPress={handleSubmit(submitHandler)}
					theme={monocromePaperTheme}
				>
					Connect
				</Button>
			</>
		</LandingWrapper>
	);
}
