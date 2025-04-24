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
	userNote?: string;
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
	uuid: string;
	title: string;
	timestamp: number;
	duration: number;
	gym?: string;
	creator?: string;
	description?: string;
	exercises: workoutExercise[];
};

type message = {
	uuid: string;
	text: string;
	sentByTrainer: boolean;
};

type user = {
	uuid: string;
	username: string;
	name: string;
	description?: string;
};

type gym = {
	uuid: string;
	name: string;
	address: string;
};
