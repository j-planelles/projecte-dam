import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import { NavigateNextIcon } from "../../components/Icons";
import LandingWrapper from "../../components/ui/screen/LandingWrapper";
import { monocromePaperTheme } from "../../lib/paperThemes";
import { useAuthStore } from "../../store/auth-store";

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

  const submitHandler = async ({ ip }: FormSchemaType) => {
    try {
      const response = await axios.get(`${ip}/`);

      setServerIp(ip, response.data.name);

      router.push("/landing/login");
    } catch (error: unknown) {
      setError("root", {
        type: "manual",
        message: "Failed to connect to server.",
      });
    }
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
          Connect
        </Button>
      </>
    </LandingWrapper>
  );
}
