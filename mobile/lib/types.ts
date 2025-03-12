type exercise = {
  uuid?: string;
  name: string;
};

type exerciseSet = {
  reps: number;
  weight: number;
};

type workoutExercise = {
  exercise: exercise;
  sets: exerciseSet[];
};

type workout = {
  uuid: string;
  title: string;
  timestamp: number;
  duration: number;
  gym: string;
  creator: string;
  description: string;
  exercises: workoutExercise[];
};

type message = {
  uuid: string;
  text: string;
  sentByTrainer: boolean;
}

type trainer = {
  username: string;
  name: string;
  description: string;
}

type gym = {
  uuid: string;
  name: string;
  address: string;
}
