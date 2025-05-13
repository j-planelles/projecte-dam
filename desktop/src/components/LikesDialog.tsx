import CheckIcon from "@mui/icons-material/Check";
import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useShallow } from "zustand/react/shallow";
import { useAuthStore } from "../store/auth-store";

export default function LikesDialog({
  open,
  onClose,
  onSuccess,
  dismissable = true,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  dismissable?: boolean;
}) {
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );
  const { data, isSuccess } = useQuery({
    queryKey: ["user", "/user/trainer/interests"],
    queryFn: async () =>
      await apiClient.get("/user/trainer/interests", {
        headers: { Authorization: `Bearer ${token}` },
      }),
  });

  const [likes, setLikes] = useState<string[]>([]);
  const navigationDisabled = likes.length < 1;

  const addLike = (newItem: string) => {
    setLikes((state) => [...state, newItem]);
  };

  const removeLike = (newItem: string) => {
    setLikes((state) => state.filter((item) => item !== newItem));
  };

  useEffect(() => {
    if (data) {
      setLikes(data.filter((item) => item.selected).map((item) => item.uuid));
    }
  }, [data]);

  const checkClickHandler = (newItem: string) => {
    if (likes.includes(newItem)) {
      removeLike(newItem);
    } else {
      addLike(newItem);
    }
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [queryError, setQueryError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    setQueryError(null);
    try {
      await apiClient.post("/user/trainer/interests", likes, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onSuccess();
    } catch (error: unknown) {
      setQueryError(error?.message);
    }
    setIsLoading(false);
  };
  return (
    <Dialog
      open={open}
      onClose={() => {
        !isLoading && onClose();
      }}
      fullWidth
    >
      <DialogTitle>Review your interests</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Your interests will help users to find your profile. You can always
          change them in the settings page.
        </DialogContentText>
      </DialogContent>
      <DialogContent className="flex flex-row flex-wrap overflow-scroll gap-2">
        {isSuccess ? (
          data.map((item) => (
            <Chip
              key={item.uuid}
              icon={likes.includes(item.uuid) ? <CheckIcon /> : <AddIcon />}
              variant={likes.includes(item.uuid) ? "filled" : "outlined"}
              onClick={() => checkClickHandler(item.uuid)}
              label={item.name}
            />
          ))
        ) : (
          <Box className="flex-1 justify-center">
            <CircularProgress size="large" />
          </Box>
        )}
        {queryError && <Typography color="error">{queryError}</Typography>}
        {navigationDisabled && (
          <DialogContentText>
            Please select at least one interest.
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        {dismissable && (
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          disabled={isLoading || navigationDisabled}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
