import "react-native-get-random-values";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import {
	Appbar,
	Button,
	Dialog,
	HelperText,
	Portal,
	TextInput,
	Text,
} from "react-native-paper";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import { SaveIcon, TrashCanIcon } from "../../../components/Icons";
import { ExternalChoiceBox } from "../../../components/ui/ChoiceBox";
import Header from "../../../components/ui/Header";
import { useExerciseStore } from "../../../store/exercise-store";
import { ThemedView } from "../../../components/ui/screen/Screen";

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
	const { exercises, updateExercise, createExercise, removeExercise } =
		useExerciseStore(
			useShallow((state) => ({
				exercises: state.exercises,
				updateExercise: state.updateExercise,
				createExercise: state.createExercise,
				removeExercise: state.removeExercise,
			})),
		);

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
		setError,
		setValue,
	} = useForm<FormSchemaType>({ resolver: zodResolver(schema) });

	const submitHandler = async (data: FormSchemaType) => {
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
			bodyPart: getKeyByValue(bodyParts, data.bodyPart) as exercise["bodyPart"],
		};

		if (params.uuid === undefined) {
			createExercise({
				uuid: uuidv4(),
				...exerciseData,
			} as exercise);
		} else {
			updateExercise({
				uuid: params.uuid,
				...exerciseData,
			} as exercise);
		}

		router.back();
	};

	const deleteExerciseHandler = () => {
		setDeleteDialogVisible(false);
		removeExercise(params.uuid as string);
		router.back();
	};

	useEffect(() => {
		if (params.uuid !== undefined) {
			const filteredArray = exercises.filter(
				(item) => item.uuid === params.uuid,
			);

			if (filteredArray.length === 0) {
				setError("root", new Error("Failed to load exercise."));
				return;
			}

			const exercise = filteredArray[0];

			setValue("name", exercise.name);
			setValue("description", exercise.description);
			setValue(
				"type",
				exerciseTypes[exercise.type as keyof typeof exerciseTypes],
			);
			setValue(
				"bodyPart",
				bodyParts[exercise.bodyPart as keyof typeof bodyParts],
			);

			console.log("exercise.type:", JSON.stringify(exercise.type));
			console.log("Available keys:", Object.keys(exerciseTypes));
			console.log("Type check:", exercise.type in exerciseTypes);
			console.log(exercise);
		}
	}, [params.uuid]);

	const [deleteDialogVisible, setDeleteDialogVisible] =
		useState<boolean>(false);

	return (
		<ThemedView>
			<Header
				title={
					params.uuid === undefined ? "Create exercise" : "Modify exercise"
				}
			>
				<Appbar.Action
					icon={({ color }) => <SaveIcon color={color} />}
					onPress={handleSubmit(submitHandler)}
					disabled={isSubmitting}
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
							disabled={isSubmitting}
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
							disabled={isSubmitting}
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
							disabled={isSubmitting}
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
							disabled={isSubmitting}
						/>
					)}
				/>

				{errors.description && (
					<HelperText type="error">{errors.description?.message}</HelperText>
				)}

				{errors.root && (
					<HelperText type="error">{errors.root?.message}</HelperText>
				)}

				{isSubmitting && (
					<HelperText type="info">Saving exercise...</HelperText>
				)}

				{params.uuid !== undefined && (
					<Button
						mode="outlined"
						icon={(props) => <TrashCanIcon {...props} />}
						onPress={() => setDeleteDialogVisible(true)}
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
