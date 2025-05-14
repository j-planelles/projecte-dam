type WeightUnit = "metric" | "imperial";

type exercise = {
  uuid: string;
  name: string;
  type:
    | "barbell"
    | "dumbell"
    | "machine"
    | "other"
    | "bodyweight"
    | "assisted-bodyweight"
    | "reps-only"
    | "cardio"
    | "duration"
    | "countdown";
  bodyPart:
    | "none"
    | "arms"
    | "back"
    | "shoulders"
    | "cardio"
    | "chest"
    | "core"
    | "full-body"
    | "legs"
    | "olympic"
    | "other";
  description?: string;
};

type exerciseList = exercise & {
  isDefault: boolean;
  default_exercise_uuid: string;
};

type exerciseSet = {
  reps: number;
  weight: number;
  complete?: boolean;
  type: "normal" | "dropset" | "failture";
};

type workoutExercise = {
  exercise: exercise;
  sets: exerciseSet[];
  weightUnit?: WeightUnit;
  restCountdownDuration?: number;
};

type workout = {
  uuid?: string;
  title: string;
  timestamp: number;
  duration: number;
  description: string;
  exercises: workoutExercise[];
};

type message = {
  timestamp: number;
  content: string;
  sentByTrainer: boolean;
};

type trainer = {
  username: string;
  name: string;
  description: string;
};
