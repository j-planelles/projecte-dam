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
import * as SecureStorage from "expo-secure-store";
import { encodePassword } from "../../lib/crypto";
import { handleError } from "../../lib/errorHandler";

// Esquema de Zod utilitzat per la validació del formulari
const schema = z
  .object({
    username: z.string(),
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  // Revisar que els dos camps de la contrasenya siguin iguals
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

type FormSchemaType = z.infer<typeof schema>;

/**
 * Pàgina de registre d'usuari.
 * Permet crear un compte nou, valida les dades, encripta la contrasenya i inicia sessió automàticament.
 * @returns {JSX.Element} El component de la pàgina de registre.
 */
export default function LandingRegisterPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const apiClient = useAuthStore((store) => store.apiClient);

  // Inicialitza el formulari amb Zod i React Hook Form
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({ resolver: zodResolver(schema) });

  // Accions per guardar l'usuari i el token a l'store global
  const { setUsername, setToken, serverIp } = useAuthStore(
    useShallow((state) => ({
      setUsername: state.setUsername,
      setToken: state.setToken,
      serverIp: state.serverIp,
    })),
  );

  /**
   * Handler per registrar l'usuari.
   * Desa el nom d'usuari, encripta la contrasenya, registra l'usuari i inicia sessió automàticament.
   * Desa el token a SecureStorage i navega a la següent pantalla del registre.
   */
  const submitHandler = async ({ username, password }: FormSchemaType) => {
    try {
      setUsername(username);

      await SecureStorage.setItemAsync("username", username);

      // Encripta la contrasenya abans d'enviar-la
      const encryptedPassword = await encodePassword(password, serverIp);

      // Registra l'usuari
      await apiClient.post("/auth/register", undefined, {
        queries: { username: username, password: encryptedPassword },
      });

      // Obté el token d'accés i inicia sessió automàticament
      const response = await apiClient.post("/auth/token", {
        username: username,
        password: encryptedPassword,
      });
      setToken(response.access_token);

      if (response.access_token) {
        await SecureStorage.setItemAsync("token", response.access_token);
      }

      queryClient.invalidateQueries({ queryKey: ["user"] });

      router.push("/landing/register-profile");
    } catch (error: unknown) {
      if (error instanceof AxiosError && error?.response?.status === 409) {
        setError("username", {
          type: "manual",
          message: "Username already taken.",
        });
      } else {
        setError("root", {
          type: "manual",
          message: handleError(error),
        });
      }
    }
  };

  return (
    <LandingWrapper>
      <>
        <Text className="text-white text-4xl">Create an account</Text>

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

        {/* Input per confirmar la contrasenya */}
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
              error={errors.confirmPassword !== undefined}
              secureTextEntry
            />
          )}
        />
        {errors.confirmPassword && (
          <Text className="font-bold text-red-500">
            {errors.confirmPassword.message}
          </Text>
        )}

        {/* Missatge d'error global */}
        {errors.root && (
          <Text className="font-bold text-red-500">{errors.root.message}</Text>
        )}

        {/* Botó per crear el compte */}
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

        {/* Botó per tornar a la pantalla de login */}
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
