import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Link, useRouter } from "expo-router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import {
  DnsOutlineIcon,
  NavigateNextIcon,
  PersonAddIcon,
} from "../../components/Icons";
import LandingWrapper from "../../components/ui/screen/LandingWrapper";
import { monocromePaperTheme } from "../../lib/paperThemes";
import { useAuthStore } from "../../store/auth-store";
import * as SecureStorage from "expo-secure-store";
import { encodePassword } from "../../lib/crypto";
import { handleError } from "../../lib/errorHandler";

// Esquema de Zod per la validació del formulari
const schema = z.object({
  username: z.string(),
  password: z.string().min(8),
});

type FormSchemaType = z.infer<typeof schema>;

/**
 * Pàgina de login d'usuari.
 * Permet iniciar sessió, valida les dades, encripta la contrasenya i desa el token.
 * @returns {JSX.Element} El component de la pàgina de login.
 */
export default function LandingLoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const apiClient = useAuthStore((store) => store.apiClient);

  // Inicialitza el formulari amb Zod i React Hook Form
  const {
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({ resolver: zodResolver(schema) });

  // Obté i actualitza dades d'usuari i servidor des de l'store global
  const {
    username: storeUsername,
    setUsername,
    setToken,
    serverName,
    serverIp,
  } = useAuthStore(
    useShallow((state) => ({
      username: state.username,
      setUsername: state.setUsername,
      setToken: state.setToken,
      serverName: state.serverName,
      serverIp: state.serverIp,
    })),
  );

  // Inicialitza el valor del formulari amb el nom d'usuari guardat
  useEffect(() => {
    setValue("username", storeUsername);
  }, [storeUsername]);

  /**
   * Handler per iniciar sessió.
   * Desa el nom d'usuari, encripta la contrasenya, obté el token i el desa.
   * Navega a la pantalla principal si té èxit.
   */
  const submitHandler = async ({ username, password }: FormSchemaType) => {
    try {
      setUsername(username);

      await SecureStorage.setItemAsync("username", username);

      // Encripta la contrasenya abans d'enviar-la
      const encryptedPassword = await encodePassword(password, serverIp);

      // Obté el token d'accés
      const response = await apiClient.post("/auth/token", {
        username: username,
        password: encryptedPassword,
      });
      setToken(response.access_token);

      if (response.access_token) {
        await SecureStorage.setItemAsync("token", response.access_token);
      }

      queryClient.invalidateQueries({ queryKey: ["user"] });

      router.dismissAll();
      router.replace("/");
    } catch (error) {
      setError("root", {
        type: "manual",
        message:
          error instanceof AxiosError && error?.response?.status === 401
            ? "Invalid username and password"
            : handleError(error),
      });
    }
  };

  return (
    <LandingWrapper>
      <>
        <Text className="text-white text-4xl">Login to Ultra</Text>

        {/* Botó per canviar el servidor de connexió */}
        <Link asChild href="/landing/server">
          <Button
            icon={(props) => <DnsOutlineIcon {...props} />}
            theme={monocromePaperTheme}
          >
            Connecting to {serverName}
          </Button>
        </Link>

        {/* Input per al nom d'usuari */}
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
              error={errors.username !== undefined}
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

        {/* Input per a la contrasenya */}
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
              error={errors.password !== undefined}
              secureTextEntry
            />
          )}
        />
        {errors.password && (
          <Text className="font-bold text-red-500">
            {errors.password.message}
          </Text>
        )}

        {/* Missatge d'error global */}
        {errors.root && (
          <Text className="font-bold text-red-500">{errors.root.message}</Text>
        )}

        {/* Botó per iniciar sessió */}
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

        <Text className="text-white text-center">or</Text>

        {/* Botó per anar a la pantalla de registre */}
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
