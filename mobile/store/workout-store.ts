import { v4 } from "uuid";
import { create } from "zustand";

type WorkoutStoreType = {
  isOngoingWorkout: boolean;
  startEmptyWorkout: () => void;
  loadEmptyWorkout: () => void;
  startWorkout: (workout: workout) => void;
  loadWorkout: (workout: workout) => void;
  cancelWorkout: () => void;
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  addExercises: (exercises: workoutExercise[]) => void;
  removeExercise: (exerciseIndex: number) => void;
  moveExercise: (exerciseIndex: number, newIndex: number) => void;
  addSet: (exerciseIndex: number) => void;
  removeSet: (exerciseIndex: number, setIndex: number) => void;
  updateSetReps: (
    exerciseIndex: number,
    setIndex: number,
    value: number,
  ) => void;
  updateSetWeight: (
    exerciseIndex: number,
    setIndex: number,
    value: number,
  ) => void;
  toggleSetCompletion: (exerciseIndex: number, setIndex: number) => void;
  updateSetType: (
    exerciseIndex: number,
    setIndex: number,
    value: "normal" | "dropset" | "failture",
  ) => void;
  updateExerciseWeightUnit: (
    exerciseIndex: number,
    weightUnit: WeightUnit & "default",
  ) => void;
  updateExerciseRestCountdownDuration: (
    exerciseIndex: number,
    duration: number | "default",
  ) => void;
} & workout;

export const useWorkoutStore = create<WorkoutStoreType>((set) => ({
  // Valors del tipus workout
  uuid: "", // UUID de l'entrenament
  title: "", // Nom de l'entrenament
  timestamp: 0, // Timestamp d'inici de l'entrenament
  duration: 0, // Duració de l'entrenament
  description: "", // Descripció de l'entrenament
  exercises: [], // Exercicis de l'entrenament

  // Valors propis de l'store

  // Aquest store també s'utilitza per l'editor de plantilles 
  isOngoingWorkout: false, // True si hi ha un entrenament en curs, False si hi ha una plantilla

  startEmptyWorkout: () =>
    // Iniciar un entrenament buit
    set({
      uuid: v4(),
      title: "New workout",
      timestamp: Date.now(),
      duration: 0,
      description: "",
      exercises: [],
      isOngoingWorkout: true,
    }),
  loadEmptyWorkout: () =>
    // Carregar un entrenament buit
    set({
      uuid: v4(),
      title: "New template",
      description: "",
      exercises: [],
      isOngoingWorkout: false,
    }),
  startWorkout: (
    workout: workout, // Carregar i iniciar un entrenament
  ) =>
    set({
      ...workout,
      uuid: v4(),
      timestamp: Date.now(),
      duration: 0,
      isOngoingWorkout: true,
    }),
  loadWorkout: (
    workout: workout, // Carregar un entrenament
  ) =>
    set({
      ...workout,
      uuid: v4(),
      timestamp: Date.now(),
      duration: 0,
      isOngoingWorkout: false,
    }),
  cancelWorkout: () => set({ isOngoingWorkout: false }), // Cancelar entrenament
  setName: (name: string) =>
    set({
      title: name,
    }),
  setDescription: (description: string) =>
    set({
      description: description,
    }),
  addExercises: (exercises: workoutExercise[]) =>
    set((state) => ({
      exercises: [...state.exercises, ...exercises],
    })),
  removeExercise: (exerciseIndex: number) =>
    set((state) => ({
      exercises: state.exercises.filter((_, index) => index !== exerciseIndex),
    })),
  moveExercise: (exerciseIndex: number, newIndex: number) =>
    set((state) => ({
      exercises: state.exercises.map((item, index) =>
        index === exerciseIndex
          ? state.exercises[newIndex]
          : index === newIndex
            ? state.exercises[exerciseIndex]
            : item,
      ),
    })),
  addSet: (exerciseIndex: number) =>
    set((state) => ({
      exercises: state.exercises.map((item, i) =>
        exerciseIndex === i
          ? {
              ...item,
              sets: [
                ...item.sets,
                { reps: 0, weight: 0, complete: false, type: "normal" },
              ],
            }
          : item,
      ),
    })),
  removeSet: (exerciseIndex: number, setIndex: number) =>
    set((state) => ({
      exercises: state.exercises.map((exercise, i) =>
        exerciseIndex === i
          ? {
              ...exercise,
              sets: exercise.sets.filter((_, j) => setIndex !== j),
            }
          : exercise,
      ),
    })),
  updateSetReps: (exerciseIndex: number, setIndex: number, value: number) =>
    set((state) => ({
      exercises: state.exercises.map((exercise, i) =>
        exerciseIndex === i
          ? {
              ...exercise,
              sets: exercise.sets.map((set, j) =>
                setIndex === j ? { ...set, reps: value } : set,
              ),
            }
          : exercise,
      ),
    })),
  updateSetWeight: (exerciseIndex: number, setIndex: number, value: number) =>
    set((state) => ({
      exercises: state.exercises.map((exercise, i) =>
        exerciseIndex === i
          ? {
              ...exercise,
              sets: exercise.sets.map((set, j) =>
                setIndex === j ? { ...set, weight: value } : set,
              ),
            }
          : exercise,
      ),
    })),
  toggleSetCompletion: (exerciseIndex: number, setIndex: number) =>
    set((state) => ({
      exercises: state.exercises.map((exercise, i) =>
        exerciseIndex === i
          ? {
              ...exercise,
              sets: exercise.sets.map((set, j) =>
                setIndex === j ? { ...set, complete: !set.complete } : set,
              ),
            }
          : exercise,
      ),
    })),
  updateSetType: (
    exerciseIndex: number,
    setIndex: number,
    value: "normal" | "failture" | "dropset",
  ) =>
    set((state) => ({
      exercises: state.exercises.map((exercise, i) =>
        exerciseIndex === i
          ? {
              ...exercise,
              sets: exercise.sets.map((set, j) =>
                setIndex === j ? { ...set, type: value } : set,
              ),
            }
          : exercise,
      ),
    })),
  updateExerciseWeightUnit: (
    exerciseIndex: number,
    weightUnit: WeightUnit & "default",
  ) =>
    set((state) => ({
      exercises: state.exercises.map((item, index) =>
        index === exerciseIndex
          ? {
              ...item,
              weightUnit: weightUnit === "default" ? undefined : weightUnit,
            }
          : item,
      ),
    })),
  updateExerciseRestCountdownDuration: (
    exerciseIndex: number,
    duration: number | "default",
  ) =>
    set((state) => ({
      exercises: state.exercises.map((item, index) =>
        index === exerciseIndex
          ? {
              ...item,
              restCountdownDuration:
                duration === "default" ? undefined : duration,
            }
          : item,
      ),
    })),
}));
