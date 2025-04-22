import HomeIcon from "@mui/icons-material/Home";
import {
	AppBar,
	Box,
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Toolbar,
	Typography,
} from "@mui/material";
import { Link, Outlet, useLocation } from "react-router";

const drawerWidth = 240;

const navItems = [{ text: "Home", path: "/", icon: <HomeIcon /> }];

function Layout() {
	const location = useLocation();
	const currentPath = location.pathname;

	return (
		<Box sx={{ display: "flex", height: "100vh", overflow: "clip" }}>
			<AppBar
				position="fixed"
				sx={{
					zIndex: (theme) => theme.zIndex.drawer + 1,
				}}
			>
				<Toolbar>
					<Typography variant="h6" noWrap component="div">
						My App with Layout
					</Typography>
				</Toolbar>
			</AppBar>

			<Drawer
				variant="permanent"
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					"& .MuiDrawer-paper": {
						width: drawerWidth,
						boxSizing: "border-box",
					},
				}}
			>
				<Toolbar />
				<Box sx={{ overflow: "auto" }}>
					<List>
						{navItems.map((item) => (
							<ListItem key={item.text}>
								<ListItemButton
									component={Link}
									to={item.path}
									selected={currentPath === item.path}
									sx={
										currentPath === item.path
											? {
													backgroundColor: "action.selected",
													"&:hover": {
														backgroundColor: "action.hover",
													},
												}
											: {}
									}
								>
									<ListItemIcon
										sx={
											currentPath === item.path ? { color: "primary.main" } : {}
										}
									>
										{item.icon}
									</ListItemIcon>
									<ListItemText primary={item.text} />
								</ListItemButton>
							</ListItem>
						))}
					</List>
				</Box>
			</Drawer>

			<Box
				component="main"
				sx={{
					flexGrow: 1,
					flex: "1 1 auto",
					p: 3,
					backgroundColor: "background.paper",
					borderTopLeftRadius: "32px",
					borderTopRightRadius: "32px",
					marginTop: "64px",
					marginRight: "16px",
					overflow: "scroll",
				}}
			>
				<Outlet />
			</Box>
		</Box>
	);
}

export default Layout;
