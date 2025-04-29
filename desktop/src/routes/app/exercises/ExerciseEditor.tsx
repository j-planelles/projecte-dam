import { zodResolver } from "@hookform/resolvers/zod";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import { useAuthStore } from "../../../store/auth-store";

const exerciseTypes = {
  barbell: "Barbell",
  dumbell: "Dumbell",
  machine: "Machine",
  bodyweight: "Bodyweight",
  "assisted-bodyweight": "Assisted-bodyweight",
  "reps-only": "Reps-only",
  cardio: "Cardio",
  duration: "Duration",
  countdown: "Countdown",
  other: "Other",
} as const;

const bodyParts = {
  none: "None",
  arms: "Arms",
  back: "Back",
  shoulders: "Shoulders",
  cardio: "Cardio",
  chest: "Chest",
  core: "Core",
  "full-body": "Full-body",
  legs: "Legs",
  olympic: "Olympic",
  other: "Other",
} as const;

const schema = z.object({
  name: z.string().min(1, { message: "Exercise name is required" }),
  type: z.enum(Object.keys(exerciseTypes) as [string, ...string[]], {
    errorMap: () => ({ message: "Please select a valid exercise type" }),
  }),
  bodyPart: z.enum(Object.keys(bodyParts) as [string, ...string[]], {
    errorMap: () => ({ message: "Please select a valid body part" }),
  }),
  description: z.string().optional(),
});

type ExerciseFormData = z.infer<typeof schema>;

export default function ExerciseEditPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { "exercise-uuid": exerciseUuid } = useParams();
  const [searchParams] = useSearchParams();
  const defaultExerciseUuid = searchParams.get("defaultExerciseUuid");

  const [updated, setUpdated] = useState<number>(0);

  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  const exerciseQuery = useQuery({
    queryKey: ["user", "/user/exercises/", exerciseUuid?.toString()],
    queryFn: async () =>
      await apiClient.get("/user/exercises/:exercise_uuid", {
        params: { exercise_uuid: exerciseUuid ? exerciseUuid : "" },
        headers: { Authorization: `Bearer ${token}` },
      }),
    enabled: exerciseUuid !== undefined && defaultExerciseUuid === null,
  });
  const defaultExerciseQuery = useQuery({
    queryKey: ["user", "/default-exercises", defaultExerciseUuid?.toString()],
    queryFn: async () =>
      await apiClient.get("/default-exercises/:exercise_uuid", {
        params: {
          exercise_uuid: defaultExerciseUuid ? defaultExerciseUuid : "",
        },
        headers: { Authorization: `Bearer ${token}` },
      }),
    enabled: exerciseUuid === undefined && defaultExerciseUuid !== null,
  });

  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ExerciseFormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (exerciseQuery.isSuccess) {
      setValue("name", exerciseQuery.data.name);
      setValue("description", exerciseQuery.data?.description || "");
      setValue("type", exerciseQuery.data.type);
      setValue("bodyPart", exerciseQuery.data.body_part);
    }
    if (defaultExerciseQuery.isSuccess) {
      setValue("name", defaultExerciseQuery.data.name);
      setValue("description", defaultExerciseQuery.data?.description || "");
      setValue("type", defaultExerciseQuery.data.type);
      setValue("bodyPart", defaultExerciseQuery.data.body_part);
    }

    setUpdated((value) => value + 1);
  }, [
    exerciseQuery.data,
    exerciseQuery.isSuccess,
    defaultExerciseQuery.data,
    defaultExerciseQuery.isSuccess,
  ]);

  const isLoading =
    exerciseQuery.isLoading || defaultExerciseQuery.isLoading || isSubmitting;

  const submitHandler = async (data: ExerciseFormData) => {
    try {
      if (!exerciseUuid) {
        await apiClient.post(
          "/user/exercises",
          {
            uuid: uuidv4(),
            name: data.name,
            description: data.description,
            type: data.type as keyof typeof exerciseTypes,
            body_part: data.bodyPart as keyof typeof bodyParts,
            default_exercise_uuid: defaultExerciseUuid?.toString(),
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      } else {
        await apiClient.put(
          "/user/exercises/:exercise_uuid",
          {
            uuid: exerciseUuid,
            name: data.name,
            description: data.description,
            type: data.type as keyof typeof exerciseTypes,
            body_part: data.bodyPart as keyof typeof bodyParts,
          },
          {
            params: {
              exercise_uuid: exerciseUuid ? exerciseUuid : "",
            },
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        queryClient.invalidateQueries({
          queryKey: [
            "user",
            "/user/exercises/",
            exerciseUuid ? exerciseUuid : "",
          ],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["user", "/user/exercises"] });
      navigate(-1);
    } catch (error: any) {
      setError("root", { type: "manual", message: error });
    }
  };

  return (
    <Container className="flex flex-col gap-4">
      <Typography variant="h6">
        {exerciseUuid
          ? "Edit exercise"
          : defaultExerciseUuid
            ? "Edit default exercise"
            : "Create exercise"}
      </Typography>

      <TextField
        key={`exercise-name-label-${updated}`}
        label="Name"
        variant="outlined"
        fullWidth
        {...register("name")}
        error={!!errors.name}
        helperText={errors.name?.message}
        disabled={isLoading}
      />

      <FormControl fullWidth error={!!errors.type}>
        <InputLabel id="exercise-type-label">Type</InputLabel>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select
              key={`exercise-type-label-${updated}`}
              labelId="exercise-type-label"
              label="Type"
              {...field}
              disabled={isLoading || !!exerciseUuid}
            >
              {Object.entries(exerciseTypes).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          )}
        />
        {exerciseUuid && (
          <FormHelperText>
            You cannot change an exercise's type once created. To do so, delete
            it and create it again.
          </FormHelperText>
        )}
        {errors.type && <FormHelperText>{errors.type.message}</FormHelperText>}
      </FormControl>

      <FormControl fullWidth error={!!errors.bodyPart}>
        <InputLabel id="body-part-label">Body Part</InputLabel>
        <Controller
          name="bodyPart"
          control={control}
          render={({ field }) => (
            <Select
              key={`body-part-label-${updated}`}
              labelId="body-part-label"
              label="Body Part"
              {...field}
              displayEmpty
              disabled={isLoading}
            >
              {Object.entries(bodyParts).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          )}
        />
        {errors.bodyPart && (
          <FormHelperText>{errors.bodyPart.message}</FormHelperText>
        )}
      </FormControl>

      <TextField
        key={`exercise-description-label-${updated}`}
        label="Description"
        variant="outlined"
        fullWidth
        multiline
        rows={3}
        {...register("description")}
        error={!!errors.description}
        helperText={errors.description?.message}
        disabled={isLoading}
      />

      <Button
        variant="outlined"
        color="primary"
        disabled={isLoading}
        startIcon={<SaveIcon />}
        onClick={handleSubmit(submitHandler)}
      >
        {exerciseUuid
          ? "Update exercise"
          : defaultExerciseUuid
            ? "Update default exercise"
            : "Create exercise"}
      </Button>

      {defaultExerciseUuid && (
        <FormHelperText>
          You are now modifying a default exercise. When you save it, a copy
          will be created and you must only use it. When you delete the copy,
          you will be able to create a new exercise again from the template.
        </FormHelperText>
      )}

      {exerciseUuid && <DeleteExerciseButton isLoading={isLoading} />}
    </Container>
  );
}

const DeleteExerciseButton = ({ isLoading }: { isLoading: boolean }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { "exercise-uuid": exerciseUuid } = useParams();
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  const [open, setOpen] = useState<boolean>(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteExerciseHandler = async () => {
    handleClose();

    await apiClient.delete("/user/exercises/:exercise_uuid", undefined, {
      params: {
        exercise_uuid: exerciseUuid ? exerciseUuid : "",
      },
      headers: { Authorization: `Bearer ${token}` },
    });

    queryClient.invalidateQueries({
      queryKey: ["user", "/user/exercises/", exerciseUuid?.toString()],
    });
    queryClient.invalidateQueries({ queryKey: ["user", "/user/exercises"] });
    navigate(-1);
  };

  return (
    <>
      <Button
        variant="outlined"
        color="error"
        disabled={isLoading}
        startIcon={<DeleteIcon />}
        onClick={handleClickOpen}
      >
        Delete exercise
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete exercise</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you wish to remove the current exercise?
          </DialogContentText>
          <DialogContentText>
            This action will not remove the entries in your workouts nor in the
            ones that you have shared.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={deleteExerciseHandler} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
