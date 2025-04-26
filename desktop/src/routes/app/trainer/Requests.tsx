import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Container,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useAuthStore } from "../../../store/auth-store";

export default function TrainerRequestsPage() {
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  const { data, isLoading, isSuccess, error } = useQuery({
    queryKey: ["user", "trainer", "/trainer/requests"],
    queryFn: async () =>
      await apiClient.get("/trainer/requests", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    retry: false,
  });

  return (
    <Container>
      {isLoading && (
        <Box className="flex items-center justify-center">
          <CircularProgress />
        </Box>
      )}
      {error && <Typography color="error">{error.message}</Typography>}
      {isSuccess &&
        !!data &&
        (data.length > 0 ? (
          <List>
            {data.map((item) => (
              <UserListItem
                key={item.user.uuid}
                user={
                  {
                    uuid: item.user.uuid,
                    username: item.user.username,
                    name: item.user.full_name,
                    description: item.user.biography,
                  } as user
                }
              />
            ))}
          </List>
        ) : (
          <Box className="flex flex-col items-center">
            <GroupAddOutlinedIcon sx={{ width: 180, height: 180 }} />
            <Typography variant="h4">No requests found...</Typography>
          </Box>
        ))}
    </Container>
  );
}

const UserListItem = ({ user }: { user: user }) => {
  return (
    <ListItem
      secondaryAction={<UserListItemActions userUUID={user.uuid} />}
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
  );
};

const UserListItemActions = ({ userUUID }: { userUUID: string }) => {
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [input, setInput] = useState<null | "accept" | "deny">(null);

  const handleSubmit = async (userInput: "accept" | "deny") => {
    setIsLoading(true);
    setQueryError(null);
    setInput(null);
    try {
      await apiClient.post("/trainer/requests/:user_uuid", undefined, {
        params: { user_uuid: userUUID },
        queries: { action: userInput },
        headers: { Authorization: `Bearer ${token}` },
      });
      setInput(userInput);
    } catch (error: any) {
      if (error instanceof AxiosError) {
        setQueryError(`${error?.request?.status} ${error?.request?.response}.`);
      } else {
        setQueryError(`${error?.message}`);
      }
    }
    setIsLoading(false);
  };

  return (
    <Box className="flex flex-row gap-2 items-center">
      {queryError && <Typography color="error">{queryError}</Typography>}
      {isLoading ? (
        <>
          <CircularProgress size="25px" />
          <Typography color="primary" className="pr-2">
            Requesting...
          </Typography>
        </>
      ) : input === null ? (
        <ButtonGroup variant="outlined">
          <Button
            startIcon={<CheckIcon />}
            color="success"
            sx={{ backgroundColor: "background.paper" }}
            onClick={() => {
              handleSubmit("accept");
            }}
          >
            Accept
          </Button>
          <Button
            startIcon={<CloseIcon />}
            color="error"
            sx={{ backgroundColor: "background.paper" }}
            onClick={() => {
              handleSubmit("deny");
            }}
          >
            Deny
          </Button>
        </ButtonGroup>
      ) : (
        <Typography
          color={input === "accept" ? "success" : "error"}
          className="pr-2"
        >
          Request {input === "accept" ? "accepted" : "denied"}
        </Typography>
      )}
    </Box>
  );
};
