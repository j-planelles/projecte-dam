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
import * as SecureStorage from "expo-secure-store";
import { handleError } from "../../lib/errorHandler";

// Esquema de Zod per validar el formulari
const schema = z.object({
  ip: z.string().url(),
});

type FormSchemaType = z.infer<typeof schema>;

/**
 * Pàgina per seleccionar i connectar-se a un servidor.
 * Permet a l'usuari introduir la URL del servidor, la valida i comprova la connexió.
 * Desa la IP del servidor a SecureStorage i a l'store global.
 * @returns {JSX.Element} El component de la pàgina de selecció de servidor.
 */
export default function LandingServerPage() {
  const router = useRouter();

  // Inicialitza el formulari amb Zod i React Hook Form
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({ resolver: zodResolver(schema) });

  // Obté i actualitza la IP del servidor des de l'store global
  const { serverIp, setServerIp } = useAuthStore(
    useShallow((state) => ({
      serverIp: state.serverIp,
      setServerIp: state.setServerIp,
    })),
  );

  /**
   * Handler per connectar-se al servidor.
   * Desa la IP a SecureStorage, comprova la connexió i actualitza l'store.
   * Navega a la pantalla de login si té èxit.
   */
  const submitHandler = async ({ ip }: FormSchemaType) => {
    try {
      await SecureStorage.setItemAsync("serverIp", ip);

      // Comprova la connexió al servidor
      const response = await axios.get(`${ip}/`);

      setServerIp(ip, response.data.name);

      router.push("/landing/login");
    } catch (error: unknown) {
      setError("root", {
        type: "manual",
        message: `Failed to connect to server. ${handleError(error)}`,
      });
    }
  };

  // Inicialitza el valor del formulari amb la IP guardada
  useEffect(() => {
    setValue("ip", serverIp);
  }, [serverIp]);

  return (
    <LandingWrapper>
      <>
        <Text className="text-white text-4xl">Choose a Server</Text>

        {/* Input per la IP/URL del servidor */}
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
              error={errors.ip !== undefined}
              textContentType="none"
              autoCorrect={false}
              autoCapitalize="none"
            />
          )}
        />

        {/* Missatge d'error de validació de la IP */}
        {errors.ip && (
          <Text className="font-bold text-red-500">{errors.ip.message}</Text>
        )}

        {/* Missatge d'error global de connexió */}
        {errors.root && (
          <Text className="font-bold text-red-500">{errors.root.message}</Text>
        )}

        {/* Botó per connectar-se al servidor */}
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
