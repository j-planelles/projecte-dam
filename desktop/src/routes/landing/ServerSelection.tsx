import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import type { FormEvent } from "react";
import { useNavigate } from "react-router";

export default function ServerSelectionPage() {
	const navigate = useNavigate();

	const submitHandler = (event: FormEvent) => {
		event.preventDefault();

		navigate("/landing/login");
	};

	return (
		<Paper
			elevation={3}
			sx={{
				padding: 4,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				width: "100%",
				maxWidth: "400px",
				borderRadius: 2,
				backgroundColor: "background.paper",
			}}
		>
			<Typography component="h1" variant="h5" gutterBottom>
				Choose a server
			</Typography>
			<Box
				component="form"
				sx={{
					mt: 1, // Margin top for spacing below the title
					width: "100%", // Ensure form takes full width of the Paper
				}}
				noValidate // Disable browser validation if using custom
				onSubmit={submitHandler}
			>
				<TextField
					margin="normal"
					required
					fullWidth
					id="ip"
					label="Server IP"
					name="ip"
					placeholder="https://ultra.jplanelles.cat"
					autoFocus
				/>
				<Button
					type="submit"
					fullWidth
					variant="filled"
					sx={{ mt: 2, mb: 2 }} // Margin top and bottom
				>
					Connect
				</Button>
			</Box>
		</Paper>
	);
}
