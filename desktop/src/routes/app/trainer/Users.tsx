import {
	Avatar,
	Container,
	List,
	ListItemAvatar,
	ListItemButton,
	ListItemText,
} from "@mui/material";
import { SAMPLE_USERS } from "../../../lib/sampleData";
import { Link } from "react-router";

export default function TrainerUsersPage() {
	return (
		<Container>
			<List>
				{SAMPLE_USERS.map((user) => (
					<Link key={user.uuid} to={`/app/trainer/users/${user.uuid}`}>
						<ListItemButton>
							<ListItemAvatar>
								<Avatar>{user.name.charAt(0).toUpperCase()}</Avatar>
							</ListItemAvatar>
							<ListItemText primary={user.name} secondary={user.description} />
						</ListItemButton>
					</Link>
				))}
			</List>
		</Container>
	);
}
