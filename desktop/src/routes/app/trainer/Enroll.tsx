import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Button, Container, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useShallow } from "zustand/react/shallow";
import LikesDialog from "../../../components/LikesDialog";
import { handleError } from "../../../lib/errorHandler";
import { useAuthStore } from "../../../store/auth-store";

/**
 * Pàgina d'enrolament com a entrenador.
 * Mostra informació sobre els avantatges de ser entrenador i permet iniciar el procés d'enrolament.
 * @returns {JSX.Element} El component de la pàgina d'enrolament d'entrenador.
 */
export default function TrainerEnrollPage() {
  return (
    <>
      {/* Imatge de capçalera amb crèdit */}
      <div
        className="h-96 flex items-end justify-end"
        style={{
          backgroundImage: "url('/assets/trainer-enroll.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          borderRadius: "28px",
        }}
      >
        <Typography className="text-gray-400 px-6">
          Photo by Michael DeMoya on Unsplash
        </Typography>
      </div>
      <Container className="mt-4">
        <Typography variant="h3">Become a Trainer on Ultra</Typography>

        <Typography sx={{ marginTop: "4px" }}>
          Elevate your training impact with Ultra! We've built tools to help you
          connect with users actively seeking guidance and support.
        </Typography>

        <Typography sx={{ marginTop: "6px" }}>
          Users on Ultra can request you as their trainer. To start working with
          someone, you simply need to accept their invitation. This ensures
          you're building connections with users you're ready to help.
        </Typography>

        <Typography sx={{ marginTop: "6px" }}>
          Once you accept, you unlock the ability to recommend personalized
          workouts, track progress (if applicable), and make a real difference
          in their fitness journey, all within the app.
        </Typography>

        <Typography sx={{ marginTop: "6px" }}>
          Accept invitations from users eager to learn from you and grow your
          influence!
        </Typography>
        <EnrollButton />
      </Container>
    </>
  );
}

/**
 * Botó per iniciar el procés d'enrolament com a entrenador.
 * Mostra un diàleg per seleccionar interessos després d'enrolar-se.
 * @returns {JSX.Element} El component del botó d'enrolament.
 */
const EnrollButton = () => {
  const queryClient = useQueryClient();
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [showLikesDialog, setShowLikesDialog] = useState<boolean>(false);

  /**
   * Handler per enviar la sol·licitud d'enrolament com a entrenador.
   * Mostra el diàleg d'interessos si té èxit.
   */
  const handleSubmit = async () => {
    setIsLoading(true);
    setQueryError(null);
    try {
      await apiClient.post("/auth/register/trainer", undefined, {
        headers: { Authorization: `Bearer ${token}` },
      });
      queryClient.invalidateQueries({ queryKey: ["user", "trainer"] });
      queryClient.invalidateQueries({ queryKey: ["user", "/auth/profile"] });
      setShowLikesDialog(true);
    } catch (error: unknown) {
      setQueryError(handleError(error));
    }
    setIsLoading(false);
  };

  return (
    <>
      <Button
        variant="filled"
        sx={{ marginTop: "16px" }}
        startIcon={<PersonAddIcon />}
        disabled={isLoading}
        onClick={handleSubmit}
      >
        Enroll as a Trainer
      </Button>
      {queryError !== null && (
        <Typography variant="body2" color="error" className="pt-2">
          {queryError}
        </Typography>
      )}
      {/* Diàleg per seleccionar interessos després d'enrolar-se */}
      <LikesDialog
        open={showLikesDialog}
        onClose={() => {}}
        onSuccess={() => {
          setShowLikesDialog(false);
          navigate("/app/dashboard");
        }}
        dismissable={false}
      />
    </>
  );
};
