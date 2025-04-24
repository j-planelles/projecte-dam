import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {
	Avatar,
	Button,
	ButtonGroup,
	Container,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
} from "@mui/material";
import { SAMPLE_USERS } from "../../../lib/sampleData";

export default function TrainerRequestsPage() {
	return (
		<Container>
			<List>
				{SAMPLE_USERS.map((user) => (
					<ListItem
						key={user.uuid}
						secondaryAction={
							<ButtonGroup variant="outlined">
								<Button
									startIcon={<CheckIcon />}
									color="success"
									sx={{ backgroundColor: "background.paper" }}
								>
									Accept
								</Button>
								<Button
									startIcon={<CloseIcon />}
									color="error"
									sx={{ backgroundColor: "background.paper" }}
								>
									Deny
								</Button>
							</ButtonGroup>
						}
						className="rounded-full"
						sx={{
							paddingY: 1,
							"& .MuiListItemSecondaryAction-root": {
								opacity: 0, // Make it invisible by default
								visibility: "hidden", // Hide it completely including from screen readers initially
							},
							// Apply styles when the ListItem itself is hovered
							"&:hover": {
								backgroundColor: "background.default",
								"& .MuiListItemSecondaryAction-root": {
									opacity: 1, // Make it visible on hover
									visibility: "visible", // Make it accessible
								},
							},
						}}
					>
						<ListItemAvatar>
							<Avatar>{user.name.charAt(0).toUpperCase()}</Avatar>
						</ListItemAvatar>
						<ListItemText primary={user.name} secondary={user.description} />
					</ListItem>
				))}
			</List>
		</Container>
	);
}
