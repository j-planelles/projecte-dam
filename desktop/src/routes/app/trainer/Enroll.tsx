import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Button, Container, Typography } from "@mui/material";
import { useAuthStore } from "../../../store/auth-store";
import { useNavigate } from "react-router";

export default function TrainerEnrollPage() {
	return (
		<>
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

	const handleSubmit = async () => {
		setIsLoading(true);
		setQueryError(null);
		try {
			await apiClient.post("/auth/register/trainer", undefined, {
				headers: { Authorization: `Bearer ${token}` },
			});
			queryClient.invalidateQueries({ queryKey: ["user", "trainer"] });
			queryClient.invalidateQueries({ queryKey: ["user", "/auth/profile"] });
			navigate("/app/dashboard");
		} catch (error: any) {
			if (error instanceof AxiosError) {
				setQueryError(`${error?.request?.status} ${error?.request?.response}.`);
			} else {
				setQueryError(`${error?.message}`);
				console.error(error.message);
			}
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
		</>
	);
};
