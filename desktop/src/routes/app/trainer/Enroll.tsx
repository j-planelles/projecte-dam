import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Button, Container, Typography } from "@mui/material";

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
				<Button
					variant="filled"
					sx={{ marginTop: "16px" }}
					startIcon={<PersonAddIcon />}
				>
					Enroll as a Trainer
				</Button>
			</Container>
		</>
	);
}
