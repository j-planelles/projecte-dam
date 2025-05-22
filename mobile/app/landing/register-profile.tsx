import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Text } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import { NavigateNextIcon } from "../../components/Icons";
import LandingWrapper from "../../components/ui/screen/LandingWrapper";
import { handleError } from "../../lib/errorHandler";
import { monocromePaperTheme } from "../../lib/paperThemes";
import { useAuthStore } from "../../store/auth-store";

// Esquema de Zod per la validació del formulari
const schema = z.object({
  name: z.string(),
  bio: z.string().optional(),
});
type FormSchemaType = z.infer<typeof schema>;

/**
 * Pàgina per completar el perfil d'usuari durant el registre.
 * Permet introduir el nom complet i la biografia, i desa la informació al servidor.
 * @returns {JSX.Element} El component de la pàgina de configuració de perfil.
 */
export default function LandingRegisterProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Obté l'apiClient i el token d'autenticació de l'store d'usuari
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  // Inicialitza el formulari amb Zod i React Hook Form
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({ resolver: zodResolver(schema) });

  /**
   * Handler per desar el perfil de l'usuari.
   * Desa el nom i la biografia a l'API i navega a la pantalla principal si té èxit.
   */
  const submitHandler = async ({ name, bio }: FormSchemaType) => {
    try {
      await apiClient.post(
        "/auth/profile",
        {
          biography: bio,
          full_name: name,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      queryClient.invalidateQueries({ queryKey: ["user"] });

      router.dismissAll();
      router.replace("/");
    } catch (error: unknown) {
      setError("root", { type: "manual", message: handleError(error) });
    }
  };

  return (
    <LandingWrapper>
      <>
        <Text className="text-white text-4xl">Set up your profile</Text>

        {/* Input per al nom complet */}
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
              error={errors.name !== undefined}
            />
          )}
        />
        {errors.name && (
          <Text className="font-bold text-red-500">{errors.name.message}</Text>
        )}

        {/* Input per a la biografia */}
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
              error={errors.bio !== undefined}
              multiline
            />
          )}
        />
        {errors.bio && (
          <Text className="font-bold text-red-500">{errors.bio.message}</Text>
        )}

        {/* Missatge d'error global */}
        {errors.root && (
          <Text className="font-bold text-red-500">{errors.root.message}</Text>
        )}

        {/* Botó per continuar amb el registre */}
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
