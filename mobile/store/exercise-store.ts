import { create } from "zustand";
import { SAMPLE_EXERCISES } from "../lib/sampleData";

type ExerciseStoreType = {
	exercises: exercise[];
	createExercise: (exercise: exercise) => void;
	updateExercise: (exercise: exercise) => void;
	removeExercise: (uuid: string) => void;
	loadSampleData: () => void;
};

export const useExerciseStore = create<ExerciseStoreType>((set) => ({
	exercises: [],
	createExercise: (exercise: exercise) =>
		set((state) => ({ exercises: [...state.exercises, exercise] })),
	updateExercise: (exercise) =>
		set((state) => ({
			exercises: state.exercises.map((item) =>
				item.uuid === exercise.uuid ? exercise : item,
			),
		})),
	removeExercise: (uuid) =>
		set((state) => ({
			exercises: state.exercises.filter((item) => item.uuid !== uuid),
		})),
	loadSampleData: () => set({ exercises: SAMPLE_EXERCISES }),
}));
