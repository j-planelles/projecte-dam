import {
  Drawer,
  Toolbar,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import type { ReactNode } from "react";
import { useLocation, Link } from "react-router";

export type NavigationBarItem = {
  name: string;
  path: string;
  icon: ReactNode;
};

export type NavigationBarSection = {
  title?: string;
  items: NavigationBarItem[];
};

/**
 * Barra de navegació lateral per a l'aplicació.
 * Mostra seccions i ítems de navegació, amb selecció visual segons la ruta actual.
 * @param items Llista de seccions i ítems de navegació.
 * @returns {JSX.Element} El component de la barra de navegació.
 */
export default function NavigationBar({
  items,
}: { items: NavigationBarSection[] }) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
        },
      }}
    >
      {/* Espai per la barra superior */}
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        {items.map((section) => (
          <List
            key={section.title}
            subheader={
              <ListSubheader sx={{ backgroundColor: "transparent" }}>
                {section.title}
              </ListSubheader>
            }
          >
            {section.items.map((item) => (
              <ListItem key={item.path}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={currentPath.startsWith(item.path)}
                  sx={
                    currentPath.startsWith(item.path)
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
                      currentPath.startsWith(item.path)
                        ? { color: "primary.main" }
                        : {}
                    }
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        ))}
      </Box>
    </Drawer>
  );
}
