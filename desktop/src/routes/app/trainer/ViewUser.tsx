import AddIcon from "@mui/icons-material/Add";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Skeleton,
  Snackbar,
  Typography,
} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useShallow } from "zustand/react/shallow";
import SearchField from "../../../components/SearchField";
import WorkoutCard from "../../../components/WorkoutCard";
import WorkoutViewer from "../../../components/WorkoutViewer";
import { handleError } from "../../../lib/errorHandler";
import { useAuthStore } from "../../../store/auth-store";

export default function TrainerViewUserPage() {
  return (
    <Container>
      <UserInfo />
      <RecommendedWorkouts />
    </Container>
  );
}

const UserInfo = () => {
  const { "user-uuid": userUuid } = useParams();
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );
  const { data, isSuccess } = useQuery({
    queryKey: ["user", "trainer", userUuid, "/trainer/users/:user_uuid/info"],
    queryFn: async () =>
      await apiClient.get("/trainer/users/:user_uuid/info", {
        params: { user_uuid: userUuid ? userUuid : "" },
        headers: { Authorization: `Bearer ${token}` },
      }),
  });

  return (
    <Box className="flex flex-row gap-6 items-center">
      <Box className="flex">
        {!isSuccess ? (
          <Skeleton variant="circular" width={128} height={128} />
        ) : (
          <Avatar sx={{ height: 128, width: 128, fontSize: 64 }}>
            {data.full_name.charAt(0).toUpperCase()}
          </Avatar>
        )}
      </Box>
      <Box className="flex flex-grow flex-col">
        <Typography variant="h3">
          {!isSuccess ? <Skeleton /> : data.full_name}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {!isSuccess ? <Skeleton /> : data.username}
        </Typography>
        <Typography sx={{ marginTop: 1 }}>
          {!isSuccess ? <Skeleton /> : data.biography}
        </Typography>
      </Box>
      <Box className="flex flex-col items-top">{isSuccess && <UserMenu />}</Box>
    </Box>
  );
};

const UserMenu = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { "user-uuid": userUuid } = useParams();
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [queryError, setQueryError] = useState<string | null>(null);

  const unlinkUserHandler = async () => {
    setIsLoading(true);
    setQueryError(null);
    try {
      await apiClient.post("/trainer/users/:user_uuid/unpair", undefined, {
        params: { user_uuid: userUuid ? userUuid : "" },
        headers: { Authorization: `Bearer ${token}` },
      });
      queryClient.invalidateQueries({
        queryKey: ["user", "trainer"],
      });
      handleClose();
      navigate("/app/trainer/users");
    } catch (error) {
      setQueryError(handleError(error));
    }
    setIsLoading(false);
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <Link to={`/app/trainer/users/${userUuid}/messages`}>
          <MenuItem disabled={isLoading}>
            <ListItemIcon>
              <ChatIcon />
            </ListItemIcon>
            <ListItemText>Message Board</ListItemText>
          </MenuItem>
        </Link>
        <MenuItem
          onClick={() => {
            handleClose();
            setDialogOpen(true);
          }}
          disabled={isLoading}
        >
          <ListItemIcon>
            <PersonRemoveIcon />
          </ListItemIcon>
          <ListItemText>Unlink user</ListItemText>
        </MenuItem>
      </Menu>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Unlink user</DialogTitle>
        <DialogContent>
          <DialogContentText>
            After unlinking, the user will need to create a new request to
            re-link again. Your recommended workouts will be unrecommended.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDialogOpen(false);
            }}
            startIcon={<CloseIcon />}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setDialogOpen(false);
              unlinkUserHandler();
            }}
            startIcon={<PersonRemoveIcon />}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={!!queryError}
        onClose={() => setQueryError(null)}
        message={queryError}
      />
    </>
  );
};

const RecommendedWorkouts = () => {
  const [workoutModalUUID, setWorkoutModalUUID] = useState<string | null>(null);
  const [showWorkoutAddModal, setShowWorkoutAddModal] =
    useState<boolean>(false);

  return (
    <>
      <Box className="mt-4">
        <Box className="flex flex-row gap-4">
          <Typography variant="h6" className="flex-grow">
            Recommended Templates
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => {
              setShowWorkoutAddModal(true);
            }}
          >
            Add template
          </Button>
        </Box>
        <RecommendedWorkoutsList setWorkoutModalUUID={setWorkoutModalUUID} />
      </Box>
      <WorkoutInfoModal
        workoutUUID={workoutModalUUID}
        onClose={() => {
          setWorkoutModalUUID(null);
        }}
      />
      <WorkoutAddModal
        show={showWorkoutAddModal}
        onClose={() => {
          setShowWorkoutAddModal(false);
        }}
      />
    </>
  );
};

const RecommendedWorkoutsList = ({
  setWorkoutModalUUID,
}: {
  setWorkoutModalUUID: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const { "user-uuid": userUuid } = useParams();
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );
  const { data, isSuccess } = useQuery({
    queryKey: [
      "user",
      "trainer",
      userUuid,
      "/trainer/users/:user_uuid/recommendation",
    ],
    queryFn: async () =>
      await apiClient.get("/trainer/users/:user_uuid/recommendation", {
        params: { user_uuid: userUuid ? userUuid : "" },
        headers: { Authorization: `Bearer ${token}` },
      }),
  });

  return isSuccess ? (
    <Box className="flex flex-1 flex-col gap-4 mt-4">
      {data.length > 0 ? (
        data
          .map(
            (data) =>
              ({
                uuid: data.uuid,
                title: data.name,
                description: data.description,
                timestamp: data.instance?.timestamp_start || 0,
                duration: data.instance?.duration || 0,
                exercises: data.entries.map((entry) => ({
                  restCountdownDuration: entry.rest_countdown_duration,
                  weightUnit: entry.weight_unit,
                  exercise: {
                    uuid: entry.exercise.uuid,
                    name: entry.exercise.name,
                    description: entry.exercise.description,
                    bodyPart: entry.exercise.body_part,
                    type: entry.exercise.type,
                  },
                  sets: entry.sets.map((set) => ({
                    reps: set.reps,
                    weight: set.weight,
                  })),
                })),
              }) as workout,
          )
          .map((workout) => (
            <WorkoutCard
              key={workout.uuid}
              workout={workout}
              showTimestamp={false}
              onClick={() => {
                setWorkoutModalUUID(workout.uuid);
              }}
            />
          ))
      ) : (
        <Box className="flex flex-col items-center gap-4">
          <FitnessCenterIcon sx={{ width: 180, height: 180 }} />
          <Typography variant="h4">No workouts assigned...</Typography>
        </Box>
      )}
    </Box>
  ) : (
    <Box className="flex items-center justify-center">
      <CircularProgress />
    </Box>
  );
};

const WorkoutInfoModal = ({
  workoutUUID,
  onClose,
}: { workoutUUID: string | null; onClose: () => void }) => {
  const queryClient = useQueryClient();
  const { "user-uuid": userUuid } = useParams();
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );
  const { data, isSuccess } = useQuery({
    queryKey: ["user", "/user/templates", workoutUUID],
    queryFn: async () =>
      await apiClient.get("/user/templates/:template_uuid", {
        params: {
          template_uuid: workoutUUID !== null ? workoutUUID.toString() : "",
        },
        headers: { Authorization: `Bearer ${token}` },
      }),
    enabled: workoutUUID !== null,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [queryError, setQueryError] = useState<string | null>(null);

  const unrecommendHandler = async () => {
    setIsLoading(true);
    setQueryError(null);
    try {
      await apiClient.delete(
        "/trainer/users/:user_uuid/recommendation",
        undefined,
        {
          params: { user_uuid: userUuid ? userUuid : "" },
          queries: {
            workout_uuid: workoutUUID !== null ? workoutUUID.toString() : "",
          },
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      queryClient.invalidateQueries({
        queryKey: ["user", "trainer", userUuid],
      });
      onClose();
    } catch (error) {
      setQueryError(handleError(error));
    }
    setIsLoading(false);
  };

  const workout = useMemo(
    () =>
      ({
        uuid: data?.uuid,
        title: data?.name,
        description: data?.description,
        timestamp: data?.instance?.timestamp_start || 0,
        duration: data?.instance?.duration || 0,
        exercises: data?.entries.map((entry) => ({
          restCountdownDuration: entry.rest_countdown_duration,
          weightUnit: entry.weight_unit,
          exercise: {
            uuid: entry.exercise.uuid,
            name: entry.exercise.name,
            description: entry.exercise.description,
            bodyPart: entry.exercise.body_part,
            type: entry.exercise.type,
          },
          sets: entry.sets.map((set) => ({
            reps: set.reps,
            weight: set.weight,
            type: set.set_type,
          })),
        })),
      }) as workout,
    [data],
  );

  return (
    <Dialog
      open={workoutUUID !== null}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      {isSuccess ? (
        <>
          <DialogContent>
            {workout && <WorkoutViewer workout={workout} timestamp={false} />}
            {queryError && <Typography color="error">{queryError}</Typography>}
          </DialogContent>
          <DialogActions>
            <Link to={`/app/templates/${workoutUUID}/edit`}>
              <Button startIcon={<EditIcon />}>Edit</Button>
            </Link>
            <Button
              onClick={unrecommendHandler}
              startIcon={<RemoveIcon />}
              disabled={isLoading}
            >
              Remove
            </Button>
            <Button onClick={onClose} startIcon={<CloseIcon />}>
              Close
            </Button>
          </DialogActions>
        </>
      ) : (
        <DialogContent className="flex items-center justify-center">
          <CircularProgress />
        </DialogContent>
      )}
    </Dialog>
  );
};

const WorkoutAddModal = ({
  show,
  onClose,
}: { show: boolean; onClose: () => void }) => {
  const queryClient = useQueryClient();
  const { "user-uuid": userUuid } = useParams();
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );
  const { data, isSuccess } = useQuery({
    queryKey: [
      "user",
      "trainer",
      userUuid,
      "/trainer/users/:user_uuid/templates",
    ],
    queryFn: async () =>
      await apiClient.get("/trainer/users/:user_uuid/templates", {
        params: { user_uuid: userUuid ? userUuid : "" },
        headers: { Authorization: `Bearer ${token}` },
      }),
  });

  const [searchTerm, setSearchTerm] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [queryError, setQueryError] = useState<string | null>(null);

  const addHandler = async (selectedWorkoutUUID: string) => {
    setIsLoading(true);
    setQueryError(null);
    try {
      await apiClient.post(
        "/trainer/users/:user_uuid/recommendation",
        undefined,
        {
          params: { user_uuid: userUuid ? userUuid : "" },
          queries: { workout_uuid: selectedWorkoutUUID },
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      queryClient.invalidateQueries({
        queryKey: ["user", "trainer", userUuid],
      });
      onClose();
    } catch (error) {
      setQueryError(handleError(error));
    }
    setIsLoading(false);
  };

  return (
    <Dialog
      open={show}
      onClose={() => {
        !isLoading && onClose();
      }}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle>Add a template</DialogTitle>
      <DialogContent>
        {isSuccess && !isLoading ? (
          <Box className="flex flex-1 flex-col gap-4">
            {data.length > 0 ? (
              <>
                <SearchField
                  value={searchTerm}
                  onValueChange={(event) => {
                    setSearchTerm(event.target.value);
                  }}
                  placeholder="Search templates"
                />

                {data
                  .map(
                    (data) =>
                      ({
                        uuid: data.uuid,
                        title: data.name,
                        description: data.description,
                        timestamp: data.instance?.timestamp_start || 0,
                        duration: data.instance?.duration || 0,
                        exercises: data.entries.map((entry) => ({
                          restCountdownDuration: entry.rest_countdown_duration,
                          weightUnit: entry.weight_unit,
                          exercise: {
                            uuid: entry.exercise.uuid,
                            name: entry.exercise.name,
                            description: entry.exercise.description,
                            bodyPart: entry.exercise.body_part,
                            type: entry.exercise.type,
                          },
                          sets: entry.sets.map((set) => ({
                            reps: set.reps,
                            weight: set.weight,
                          })),
                        })),
                      }) as workout,
                  )
                  .filter(
                    (workout) =>
                      !searchTerm ||
                      workout.title
                        .trim()
                        .toLowerCase()
                        .indexOf(searchTerm.trim().toLowerCase()) !== -1,
                  )
                  .map((workout) => (
                    <WorkoutCard
                      key={workout.uuid}
                      workout={workout}
                      showTimestamp={false}
                      onClick={() => addHandler(workout.uuid)}
                    />
                  ))}
              </>
            ) : (
              <Box className="flex flex-col items-center gap-4">
                <FitnessCenterIcon sx={{ width: 80, height: 80 }} />
                <Typography variant="h5">No workouts found...</Typography>
              </Box>
            )}
          </Box>
        ) : (
          <Box className="flex items-center justify-center">
            <CircularProgress />
          </Box>
        )}
        {queryError && <Typography color="error">{queryError}</Typography>}
      </DialogContent>
      {!isLoading && (
        <DialogActions>
          <Button onClick={onClose} startIcon={<CloseIcon />}>
            Cancel
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};
