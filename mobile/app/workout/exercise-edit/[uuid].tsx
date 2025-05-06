import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import "react-native-get-random-values";
import {
  Appbar,
  Button,
  Dialog,
  HelperText,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import { SaveIcon, TrashCanIcon } from "../../../components/Icons";
import { ExternalChoiceBox } from "../../../components/ui/ChoiceBox";
import Header from "../../../components/ui/Header";
import { ThemedView } from "../../../components/ui/screen/Screen";
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
  name: z.string(),
  // type: z.enum(Object.values(exerciseTypes) as [string, ...string[]]),
  // bodyPart: z.enum(Object.values(bodyParts) as [string, ...string[]]),
  type: z.nativeEnum(exerciseTypes),
  bodyPart: z.nativeEnum(bodyParts),
  description: z.string().optional(),
});

type FormSchemaType = z.infer<typeof schema>;

export default function ExerciseEditPage() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { apiClient, token } = useAuthStore(
    useShallow((state) => ({
      apiClient: state.apiClient,
      token: state.token,
    })),
  );

  const exerciseQuery = useQuery({
    queryKey: ["user", "/user/exercises/", params.uuid?.toString()],
    queryFn: async () =>
      await apiClient.get("/user/exercises/:exercise_uuid", {
        params: { exercise_uuid: params.uuid.toString() },
        headers: { Authorization: `Bearer ${token}` },
      }),
    enabled:
      params.uuid !== undefined && params.defaultExerciseUUID === undefined,
  });
  const defaultExerciseQuery = useQuery({
    queryKey: [
      "user",
      "/default-exercises",
      params.defaultExerciseUUID?.toString(),
    ],
    queryFn: async () =>
      await apiClient.get("/default-exercises/:exercise_uuid", {
        params: { exercise_uuid: params.defaultExerciseUUID.toString() },
        headers: { Authorization: `Bearer ${token}` },
      }),
    enabled:
      params.uuid === undefined && params.defaultExerciseUUID !== undefined,
  });

  useEffect(() => {
    if (exerciseQuery.isSuccess) {
      setValue("name", exerciseQuery.data.name);
      setValue("description", exerciseQuery.data?.description || "");
      setValue(
        "type",
        exerciseTypes[exerciseQuery.data.type as keyof typeof exerciseTypes],
      );
      setValue(
        "bodyPart",
        bodyParts[exerciseQuery.data.body_part as keyof typeof bodyParts],
      );
    }
    if (defaultExerciseQuery.isSuccess) {
      setValue("name", defaultExerciseQuery.data.name);
      setValue("description", defaultExerciseQuery.data?.description || "");
      setValue(
        "type",
        exerciseTypes[
          defaultExerciseQuery.data.type as keyof typeof exerciseTypes
        ],
      );
      setValue(
        "bodyPart",
        bodyParts[
          defaultExerciseQuery.data.body_part as keyof typeof bodyParts
        ],
      );
    }
  }, [
    exerciseQuery.data,
    exerciseQuery.isSuccess,
    defaultExerciseQuery.data,
    defaultExerciseQuery.isSuccess,
  ]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setValue,
  } = useForm<FormSchemaType>({ resolver: zodResolver(schema) });

  const submitHandler = async (data: FormSchemaType) => {
    try {
      function getKeyByValue<T extends Record<string, any>>(
        obj: T,
        value: any,
      ): keyof T | undefined {
        const entry = Object.entries(obj).find(([_, val]) => val === value);
        return entry ? (entry[0] as keyof T) : undefined;
      }

      const exerciseData = {
        name: data.name,
        description: data.description,
        type: getKeyByValue(exerciseTypes, data.type) as exercise["type"],
        bodyPart: getKeyByValue(
          bodyParts,
          data.bodyPart,
        ) as exercise["bodyPart"],
      };

      if (params.uuid === undefined) {
        await apiClient.post(
          "/user/exercises",
          {
            uuid: uuidv4(),
            name: exerciseData.name,
            description: exerciseData.description,
            type: exerciseData.type,
            body_part: exerciseData.bodyPart,
            default_exercise_uuid: params.defaultExerciseUUID?.toString(),
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      } else {
        await apiClient.put(
          "/user/exercises/:exercise_uuid",
          {
            uuid: params.uuid.toString(),
            name: exerciseData.name,
            description: exerciseData.description,
            type: exerciseData.type,
            body_part: exerciseData.bodyPart,
          },
          {
            params: {
              exercise_uuid: params.uuid.toString(),
            },
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        queryClient.invalidateQueries({
          queryKey: ["user", "/user/exercises/", params.uuid?.toString()],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["user", "/user/exercises"] });

      router.back();
    } catch (error: any) {
      if (error instanceof AxiosError) {
        setError("root", { type: "manual", message: error.message });
      }
    }
  };

  const deleteExerciseHandler = async () => {
    setDeleteDialogVisible(false);

    await apiClient.delete("/user/exercises/:exercise_uuid", undefined, {
      params: {
        exercise_uuid: params.uuid.toString(),
      },
      headers: { Authorization: `Bearer ${token}` },
    });

    queryClient.invalidateQueries({
      queryKey: ["user", "/user/exercises/", params.uuid?.toString()],
    });
    queryClient.invalidateQueries({ queryKey: ["user", "/user/exercises"] });

    router.back();
  };

  const [deleteDialogVisible, setDeleteDialogVisible] =
    useState<boolean>(false);

  const disableControls =
    isSubmitting || exerciseQuery.isLoading || defaultExerciseQuery.isLoading;

  return (
    <ThemedView>
      <Header
        title={
          params.uuid === undefined ? "Create exercise" : "Modify exercise"
        }
      >
        <Appbar.Action
          animated={false}
          icon={({ color }) => <SaveIcon color={color} />}
          onPress={handleSubmit(submitHandler)}
          disabled={disableControls}
        />
      </Header>

      <View className="gap-4 px-2">
        <Controller
          control={control}
          name="name"
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Bench Press"
              mode="outlined"
              error={errors.name != undefined}
              disabled={disableControls}
            />
          )}
        />

        {errors.name && (
          <HelperText type="error">{errors.name?.message}</HelperText>
        )}

        <Controller
          control={control}
          name="type"
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <ExternalChoiceBox
              label="Type"
              elements={Object.values(exerciseTypes)}
              mode="outlined"
              setSelectedValue={onChange}
              value={value}
              disabled={disableControls}
              error={errors.type !== undefined}
            />
          )}
        />

        {errors.type && (
          <HelperText type="error">{errors.type?.message}</HelperText>
        )}

        <Controller
          control={control}
          name="bodyPart"
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <ExternalChoiceBox
              label="Body Part"
              elements={Object.values(bodyParts)}
              mode="outlined"
              setSelectedValue={onChange}
              value={value}
              disabled={disableControls}
              error={errors.bodyPart !== undefined}
            />
          )}
        />

        {errors.bodyPart && (
          <HelperText type="error">{errors.bodyPart?.message}</HelperText>
        )}

        <Controller
          control={control}
          name="description"
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              mode="outlined"
              label="Description"
              multiline
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              disabled={disableControls}
            />
          )}
        />

        {errors.description && (
          <HelperText type="error">{errors.description?.message}</HelperText>
        )}

        {errors.root && (
          <HelperText type="error">{errors.root?.message}</HelperText>
        )}

        {params.defaultExerciseUUID && (
          <HelperText type="info">
            You are now modifying a default exercise. When you save it, a copy
            will be created and you must only use it. When you delete the copy,
            you will be able to create a new exercise again from the template.
          </HelperText>
        )}

        {isSubmitting && (
          <HelperText type="info">Saving exercise...</HelperText>
        )}

        {params.uuid !== undefined && (
          <Button
            mode="outlined"
            icon={(props) => <TrashCanIcon {...props} />}
            onPress={() => setDeleteDialogVisible(true)}
            disabled={disableControls}
          >
            Delete exercise
          </Button>
        )}

        <Portal>
          <Dialog
            visible={deleteDialogVisible}
            onDismiss={() => setDeleteDialogVisible(false)}
          >
            <Dialog.Content>
              <Text variant="bodyMedium">
                Do you wish to remove the current exercise?
              </Text>
            </Dialog.Content>
            <Dialog.Content>
              <Text variant="bodySmall">
                This action will not remove the entries in your workouts nor in
                the ones that you have shared.
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setDeleteDialogVisible(false)}>
                Cancel
              </Button>
              <Button onPress={deleteExerciseHandler}>Delete</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </ThemedView>
  );
}
