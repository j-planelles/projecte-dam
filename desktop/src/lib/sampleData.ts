import { v4 as uuidv4 } from "uuid";

const now = Math.floor(Date.now() / 1000);
const day = 86400; // Seconds in a day

export const SAMPLE_WORKOUTS: workout[] = [
	// Workout 1: Full Body Strength A
	{
		uuid: uuidv4(),
		title: "Full Body Strength A",
		timestamp: now - 14 * day,
		duration: 3800,
		creator: "user123",
		exercises: [
			{
				exercise: {
					uuid: uuidv4(),
					name: "Barbell Squats",
					type: "barbell",
					bodyPart: "legs",
				},
				sets: [
					{ reps: 5, weight: 100, type: "normal", complete: true },
					{ reps: 5, weight: 100, type: "normal", complete: true },
					{ reps: 5, weight: 100, type: "normal", complete: true },
				],
				weightUnit: "metric",
				restCountdownDuration: 120,
			},
			{
				exercise: {
					uuid: uuidv4(),
					name: "Bench Press",
					type: "barbell",
					bodyPart: "chest",
				},
				sets: [
					{ reps: 8, weight: 70, type: "normal", complete: true },
					{ reps: 8, weight: 70, type: "normal", complete: true },
					{ reps: 6, weight: 70, type: "failture", complete: true },
				],
				weightUnit: "metric",
				restCountdownDuration: 90,
			},
			{
				exercise: {
					uuid: uuidv4(),
					name: "Bent Over Rows",
					type: "barbell",
					bodyPart: "back",
				},
				sets: [
					{ reps: 10, weight: 60, type: "normal", complete: true },
					{ reps: 10, weight: 60, type: "normal", complete: true },
					{ reps: 10, weight: 60, type: "normal", complete: true },
				],
				weightUnit: "metric",
				restCountdownDuration: 75,
			},
		],
	},
	// Workout 2: Cardio & Core
	{
		uuid: uuidv4(),
		title: "Cardio & Core Blast",
		timestamp: now - 13 * day,
		duration: 2700,
		creator: "user456",
		description: "HIIT cardio followed by core work.",
		exercises: [
			{
				exercise: {
					uuid: uuidv4(),
					name: "Treadmill Sprints",
					type: "cardio",
					bodyPart: "cardio",
				},
				sets: [
					// Representing 8 rounds of 30s sprint (reps=30), 60s rest (weight=60?)
					{ reps: 30, weight: 15, type: "normal", complete: true }, // Speed 15
					{ reps: 30, weight: 15, type: "normal", complete: true },
					{ reps: 30, weight: 15, type: "normal", complete: true },
					{ reps: 30, weight: 15, type: "normal", complete: true },
					{ reps: 30, weight: 15, type: "normal", complete: true },
					{ reps: 30, weight: 15, type: "normal", complete: true },
					{ reps: 30, weight: 15, type: "normal", complete: true },
					{ reps: 30, weight: 15, type: "normal", complete: true },
				],
				weightUnit: "metric", // km/h
				restCountdownDuration: 60, // Rest between sprints
			},
			{
				exercise: {
					uuid: uuidv4(),
					name: "Crunches",
					type: "bodyweight",
					bodyPart: "core",
				},
				sets: [
					{ reps: 25, weight: 0, type: "normal", complete: true },
					{ reps: 25, weight: 0, type: "normal", complete: true },
					{ reps: 20, weight: 0, type: "normal", complete: true },
				],
				restCountdownDuration: 30,
			},
			{
				exercise: {
					uuid: uuidv4(),
					name: "Leg Raises",
					type: "bodyweight",
					bodyPart: "core",
				},
				sets: [
					{ reps: 15, weight: 0, type: "normal", complete: true },
					{ reps: 15, weight: 0, type: "normal", complete: true },
					{ reps: 12, weight: 0, type: "failture", complete: true },
				],
				restCountdownDuration: 30,
			},
		],
	},
	// Workout 3: Upper Body Hypertrophy
	{
		uuid: uuidv4(),
		title: "Upper Body Hypertrophy",
		timestamp: now - 12 * day,
		duration: 4800,
		gym: "Local Fitness Center",
		creator: "user789",
		description: "Volume focus for chest, back, shoulders, arms.",
		exercises: [
			{
				exercise: {
					uuid: uuidv4(),
					name: "Incline Dumbbell Press",
					type: "dumbell",
					bodyPart: "chest",
				},
				sets: [
					{ reps: 12, weight: 50, type: "normal", complete: true },
					{ reps: 10, weight: 55, type: "normal", complete: true },
					{ reps: 10, weight: 55, type: "normal", complete: true },
					{ reps: 8, weight: 55, type: "dropset", complete: true },
				],
				weightUnit: "imperial", // lbs
				restCountdownDuration: 75,
			},
			{
				exercise: {
					uuid: uuidv4(),
					name: "Seated Cable Rows",
					type: "machine",
					bodyPart: "back",
				},
				sets: [
					{ reps: 15, weight: 100, type: "normal", complete: true },
					{ reps: 12, weight: 110, type: "normal", complete: true },
					{ reps: 12, weight: 110, type: "normal", complete: true },
				],
				weightUnit: "imperial",
				restCountdownDuration: 60,
			},
			{
				exercise: {
					uuid: uuidv4(),
					name: "Lateral Raises",
					type: "dumbell",
					bodyPart: "shoulders",
				},
				sets: [
					{ reps: 15, weight: 15, type: "normal", complete: true },
					{ reps: 15, weight: 15, type: "normal", complete: true },
					{ reps: 12, weight: 15, type: "failture", complete: true },
				],
				weightUnit: "imperial",
				restCountdownDuration: 45,
			},
			{
				exercise: {
					uuid: uuidv4(),
					name: "Hammer Curls",
					type: "dumbell",
					bodyPart: "arms",
				},
				sets: [
					{ reps: 10, weight: 30, type: "normal", complete: true },
					{ reps: 10, weight: 30, type: "normal", complete: true },
					{ reps: 8, weight: 30, type: "normal", complete: true },
				],
				weightUnit: "imperial",
				restCountdownDuration: 45,
			},
			{
				exercise: {
					uuid: uuidv4(),
					name: "Overhead Tricep Extension",
					type: "dumbell",
					bodyPart: "arms",
				},
				sets: [
					{ reps: 12, weight: 40, type: "normal", complete: true },
					{ reps: 12, weight: 40, type: "normal", complete: true },
					{ reps: 10, weight: 40, type: "normal", complete: true },
				],
				weightUnit: "imperial",
				restCountdownDuration: 45,
			},
		],
	},
	// Workout 4: Lower Body Power
	{
		uuid: uuidv4(),
		title: "Lower Body Power",
		timestamp: now - 11 * day,
		duration: 4200,
		gym: "Iron Paradise",
		creator: "user123",
		description: "Strength and power for legs.",
		exercises: [
			{
				exercise: {
					uuid: uuidv4(),
					name: "Deadlift",
					type: "barbell",
					bodyPart: "legs", // Or back/full-body
				},
				sets: [
					{ reps: 3, weight: 140, type: "normal", complete: true },
					{ reps: 3, weight: 140, type: "normal", complete: true },
					{ reps: 3, weight: 140, type: "normal", complete: true },
				],
				weightUnit: "metric",
				restCountdownDuration: 150,
			},
			{
				exercise: {
					uuid: uuidv4(),
					name: "Leg Press",
					type: "machine",
					bodyPart: "legs",
				},
				sets: [
					{ reps: 10, weight: 180, type: "normal", complete: true },
					{ reps: 10, weight: 180, type: "normal", complete: true },
					{ reps: 8, weight: 190, type: "normal", complete: true },
				],
				weightUnit: "metric",
				restCountdownDuration: 90,
			},
			{
				exercise: {
					uuid: uuidv4(),
					name: "Hamstring Curls",
					type: "machine",
					bodyPart: "legs",
				},
				sets: [
					{ reps: 12, weight: 50, type: "normal", complete: true },
					{ reps: 12, weight: 50, type: "normal", complete: true },
					{ reps: 10, weight: 50, type: "failture", complete: true },
				],
				weightUnit: "metric",
				restCountdownDuration: 60,
			},
			{
				exercise: {
					uuid: uuidv4(),
					name: "Calf Raises",
					type: "machine", // Or bodyweight
					bodyPart: "legs",
				},
				sets: [
					{ reps: 20, weight: 80, type: "normal", complete: true },
					{ reps: 20, weight: 80, type: "normal", complete: true },
					{ reps: 15, weight: 80, type: "normal", complete: true },
				],
				weightUnit: "metric",
				restCountdownDuration: 45,
			},
		],
	},
	// Workout 5: Full Body Strength B
	{
		uuid: uuidv4(),
		title: "Full Body Strength B",
		timestamp: now - 10 * day,
		duration: 3900,
		gym: "Iron Paradise",
		creator: "user123",
		description: "Alternate compound lifts.",
		exercises: [
			{
				exercise: {
					uuid: uuidv4(),
					name: "Overhead Press",
					type: "barbell",
					bodyPart: "shoulders",
				},
				sets: [
					{ reps: 5, weight: 50, type: "normal", complete: true },
					{ reps: 5, weight: 50, type: "normal", complete: true },
					{ reps: 5, weight: 50, type: "normal", complete: true },
				],
				weightUnit: "metric",
				restCountdownDuration: 100,
			},
			{
				exercise: {
					uuid: uuidv4(),
					name: "Pull Ups",
					type: "assisted-bodyweight",
					bodyPart: "back",
				},
				sets: [
					{ reps: 8, weight: -10, type: "normal", complete: true }, // 10kg assistance
					{ reps: 6, weight: -10, type: "normal", complete: true },
					{ reps: 5, weight: -5, type: "failture", complete: true },
				],
				weightUnit: "metric",
				restCountdownDuration: 90,
			},
			{
				exercise: {
					uuid: uuidv4(),
					name: "Romanian Deadlifts",
					type: "barbell",
					bodyPart: "legs", // Hamstring focus
				},
				sets: [
					{ reps: 10, weight: 80, type: "normal", complete: true },
					{ reps: 10, weight: 80, type: "normal", complete: true },
					{ reps: 8, weight: 80, type: "normal", complete: true },
				],
				weightUnit: "metric",
				restCountdownDuration: 90,
			},
		],
	},
	// Workout 6: Active Recovery / Light Cardio
	{
		uuid: uuidv4(),
		title: "Active Recovery",
		timestamp: now - 9 * day,
		duration: 1800, // 30 minutes
		creator: "user456",
		description: "Light activity for recovery.",
		exercises: [
			{
				exercise: {
					uuid: uuidv4(),
					name: "Stationary Bike",
					type: "cardio",
					bodyPart: "cardio",
				},
				sets: [
					// 25 minutes (reps=1500s) at low intensity (weight=3)
					{ reps: 1500, weight: 3, type: "normal", complete: true },
				],
				weightUnit: "metric", // Intensity level
			},
			{
				exercise: {
					uuid: uuidv4(),
					name: "Foam Rolling",
					type: "other",
					bodyPart: "full-body",
				},
				sets: [
					// 5 minutes (reps=300s)
					{ reps: 300, weight: 0, type: "normal", complete: true },
				],
			},
		],
	},
	// Workout 7: Push Day (PPL Split)
	{
		uuid: uuidv4(),
		title: "Push Day - PPL",
		timestamp: now - 8 * day,
		duration: 4500,
		gym: "Local Fitness Center",
		creator: "userPPL",
		description: "Chest, Shoulders, Triceps focus.",
		exercises: [
			{
				exercise: {
					uuid: uuidv4(),
					name: "Flat Dumbbell Press",
					type: "dumbell",
					bodyPart: "chest",
				},
				sets: [
					{ reps: 10, weight: 60, type: "normal", complete: true },
					{ reps: 10, weight: 60, type: "normal", complete: true },
					{ reps: 8, weight: 65, type: "normal", complete: true },
				],
				weightUnit: "imperial",
				restCountdownDuration: 75,
			},
			{
				exercise: {
					uuid: uuidv4(),
					name: "Seated Dumbbell Shoulder Press",
					type: "dumbell",
					bodyPart: "shoulders",
				},
				sets: [
					{ reps: 12, weight: 40, type: "normal", complete: true },
					{ reps: 10, weight: 40, type: "normal", complete: true },
					{ reps: 10, weight: 40, type: "normal", complete: true },
				],
				weightUnit: "imperial",
				restCountdownDuration: 60,
			},
			{
				exercise: {
					uuid: uuidv4(),
					name: "Cable Crossover",
					type: "machine",
					bodyPart: "chest",
				},
				sets: [
					{ reps: 15, weight: 30, type: "normal", complete: true },
					{ reps: 12, weight: 35, type: "normal", complete: true },
					{ reps: 12, weight: 35, type: "dropset", complete: true },
				],
				weightUnit: "imperial",
				restCountdownDuration: 60,
			},
			{
				exercise: {
					uuid: uuidv4(),
					name: "Skullcrushers",
					type: "barbell", // EZ bar often used
					bodyPart: "arms",
				},
				sets: [
					{ reps: 12, weight: 50, type: "normal", complete: true },
					{ reps: 10, weight: 50, type: "normal", complete: true },
					{ reps: 10, weight: 50, type: "failture", complete: true },
				],
				weightUnit: "imperial",
				restCountdownDuration: 60,
			},
		],
	},
	// Workout 8: Pull Day (PPL Split)
	{
		uuid: uuidv4(),
		title: "Pull Day - PPL",
		timestamp: now - 7 * day,
		duration: 4600,
		gym: "Local Fitness Center",
		creator: "userPPL",
		description: "Back and Biceps focus.",
		exercises: [
			{
				exercise: {
					uuid: uuidv4(),
					name: "Barbell Rows",
					type: "barbell",
					bodyPart: "back",
				},
				sets: [
					{ reps: 8, weight: 135, type: "normal", complete: true },
					{ reps: 8, weight: 135, type: "normal", complete: true },
					{ reps: 6, weight: 145, type: "normal", complete: true },
				],
				weightUnit: "imperial",
				restCountdownDuration: 90,
			},
			{
				exercise: {
					uuid: uuidv4(),
					name: "Lat Pulldown (Wide Grip)",
					type: "machine",
					bodyPart: "back",
				},
				sets: [
					{ reps: 12, weight: 120, type: "normal", complete: true },
					{ reps: 10, weight: 130, type: "normal", complete: true },
					{ reps: 10, weight: 130, type: "normal", complete: true },
				],
				weightUnit: "imperial",
				restCountdownDuration: 75,
			},
			{
				exercise: {
					uuid: uuidv4(),
					name: "Face Pulls",
					type: "machine", // Cable machine
					bodyPart: "shoulders", // Rear delts/upper back
				},
				sets: [
					{ reps: 15, weight: 40, type: "normal", complete: true },
					{ reps: 15, weight: 40, type: "normal", complete: true },
					{ reps: 12, weight: 40, type: "normal", complete: true },
				],
				weightUnit: "imperial",
				restCountdownDuration: 45,
			},
			{
				exercise: {
					uuid: uuidv4(),
					name: "Barbell Curls",
					type: "barbell",
					bodyPart: "arms",
				},
				sets: [
					{ reps: 10, weight: 60, type: "normal", complete: true },
					{ reps: 8, weight: 65, type: "normal", complete: true },
					{ reps: 8, weight: 65, type: "failture", complete: true },
				],
				weightUnit: "imperial",
				restCountdownDuration: 60,
			},
		],
	},
	// Workout 9: Leg Day (PPL Split)
	{
		uuid: uuidv4(),
		title: "Leg Day - PPL",
		timestamp: now - 6 * day,
		duration: 5000,
		gym: "Local Fitness Center",
		creator: "userPPL",
		description: "Quads, Hamstrings, Glutes, Calves focus.",
		exercises: [
			{
				exercise: {
					uuid: uuidv4(),
					name: "Front Squats",
					type: "barbell",
					bodyPart: "legs",
				},
				sets: [
					{ reps: 8, weight: 70, type: "normal", complete: true },
					{ reps: 8, weight: 70, type: "normal", complete: true },
					{ reps: 6, weight: 75, type: "normal", complete: true },
				],
				weightUnit: "metric",
				restCountdownDuration: 100,
			},
			{
				exercise: {
					uuid: uuidv4(),
					name: "Stiff-Leg Deadlifts",
					type: "barbell",
					bodyPart: "legs",
				},
				sets: [
					{ reps: 12, weight: 80, type: "normal", complete: true },
					{ reps: 10, weight: 85, type: "normal", complete: true },
					{ reps: 10, weight: 85, type: "normal", complete: true },
				],
				weightUnit: "metric",
				restCountdownDuration: 90,
			},
			{
				exercise: {
					uuid: uuidv4(),
					name: "Leg Extensions",
					type: "machine",
					bodyPart: "legs",
				},
				sets: [
					{ reps: 15, weight: 60, type: "normal", complete: true },
					{ reps: 12, weight: 65, type: "dropset", complete: true },
					{ reps: 12, weight: 65, type: "normal", complete: true },
				],
				weightUnit: "metric",
				restCountdownDuration: 60,
			},
			{
				exercise: {
					uuid: uuidv4(),
					name: "Seated Calf Raises",
					type: "machine",
					bodyPart: "legs",
				},
				sets: [
					{ reps: 20, weight: 40, type: "normal", complete: true },
					{ reps: 15, weight: 45, type: "normal", complete: true },
					{ reps: 15, weight: 45, type: "failture", complete: true },
				],
				weightUnit: "metric",
				restCountdownDuration: 45,
			},
		],
	},
];

export const SAMPLE_USERS: user[] = [
	{
		uuid: uuidv4(),
		username: "xX_Frig0laPr0_Xx",
		name: "Adrià Frigola Alaminos",
	},
	{
		uuid: uuidv4(),
		username: "J3nniD4m_Snip3z",
		name: "Jennifer Dam Alsina",
		description:
			"Just a noia building in Minecraft & breaking hearts 💔 Sempre grinding ✨ Controller in hand, world off.",
	},
	{
		uuid: uuidv4(),
		username: "Alm3ndr0sKilla_12",
		name: "Alex Almendros Castillo",
		description:
			"💀 Living in the nit 🌙 Playing games till dawn. Potser sad, potser just bored. 🔥",
	},
	{
		uuid: uuidv4(),
		username: "C4rl3s_MLG_B4rreda",
		name: "Carles Barreda Comas",
		description:
			"👑 High K/D, low expectations. Sempre chasing the dub. Life is a petit game. 🎮",
	},
	{
		uuid: uuidv4(),
		username: "S0fianJ_DutyCraft",
		name: "Sofian Jamal Fatmi",
		description:
			"Minecraft architect, Warzone demon. 🖤 My ànima is pixelated. Mai offline. ✨",
	},
	{
		uuid: uuidv4(),
		username: "xX_S3rraF10_HD_Xx",
		name: "Àlex Serra Fiodarav",
		description:
			"🎮 Fosc vibes only. Headshots & heartbreaks. Potser I care, potser not. 💀",
	},
	{
		uuid: uuidv4(),
		username: "J0rdiB0ss_CraftKilla",
		name: "Jordi Bossacoma I Frigola",
		description:
			"Building empires, taking names. 👑 Cor fred, mans ràpides. Lost in the game sempre. 🖤",
	},
	{
		uuid: uuidv4(),
		username: "Cr1sReca_G4m3rGurl",
		name: "Cristina Recasens Gafas",
		description:
			"💔 Noia amb un cor trencat i un bon aim. Playing through the pain. ✨ Nit eterna.",
	},
	{
		uuid: uuidv4(),
		username: "R1c4rdG_Pr0f3ss0r", // Adapted style slightly
		name: "Ricard Galvany Mendez",
		description:
			"Teaching noobs, owning lobbies. 🎮 Sempre learning, sempre winning. Knowledge is power. 👑",
	},
	{
		uuid: uuidv4(),
		username: "A1t0rP_G4rr1d0_MLG",
		name: "Aitor Pérez I Garrido",
		description:
			"💀 In the shadows, online. Ànima fosca, high score. Mai surrender. 🔥",
	},
	{
		uuid: uuidv4(),
		username: "Pr0fL3ct0r_N00bKilla", // Generic but styled
		name: "Professor Lector",
		description:
			"Just observing the game... potser. 🖤 Controller collecting dust? Mai. 🎮",
	},
	{
		uuid: uuidv4(),
		username: "J4um3F_M0ntG3_xX",
		name: "Jaume Feliu Montgé",
		description:
			"Short time online, long time grinding. ✨ Petit moments, big plays. Cor digital. 💔",
	},
	{
		uuid: uuidv4(),
		username: "Ang3lC_M0ra_Sn1p3r",
		name: "Angel Israel Carvallo Mora",
		description:
			"Guardian angel with a sniper rifle. 🎮 Nit watcher. Sempre on target. 💀",
	},
	{
		uuid: uuidv4(),
		username: "Ani0lM0r3n0_Beast",
		name: "Aniol Moreno Batlle",
		description:
			"Unleashing the beast mode. 🔥 Ànima salvatge. Lost in pixels and dolç sorrow. 🖤",
	},
	{
		uuid: uuidv4(),
		username: "N4rcisN_CraftMast3r",
		name: "Narcís Navarro",
		description:
			"Building my world, block by block. 👑 Potser lonely, potser focused. Cor quiet. ✨",
	},
	{
		uuid: uuidv4(),
		username: "Pabl0Riv_N4v4rr0_HD",
		name: "Pablo Antonio Rivera Navarro",
		description:
			"HD gameplay, low-res feelings. 💔 Sempre online, mai truly present. Nit rider. 🎮",
	},
	{
		uuid: uuidv4(),
		username: "J0rdiPlan_Pr0_Pwnz",
		name: "Jordi Planelles Pérez",
		description:
			"Just logged in, already winning. 💀 Quick plays, fosc thoughts. Life moves fast. 🔥",
	},
	{
		uuid: uuidv4(),
		username: "Andr3sV_Y0su3_Killa",
		name: "Andrés Yosue Villegas Perozo",
		description:
			"Venezuelan voltage, gamer soul. 🇻⚡ Corazón fuerte, ànima gamer. Sempre ready. 👑🎮",
	},
];

const createExercise = (
	name: string,
	type: exercise["type"],
	bodyPart: exercise["bodyPart"],
	description?: string,
	isDefault = true,
): exerciseList => {
	const id = uuidv4(); // Generate a real UUID
	return {
		uuid: id,
		name,
		type,
		bodyPart,
		description,
		isDefault,
		default_exercise_uuid: isDefault ? id : "", // Reference self if default
	};
};

export const SAMPLE_EXERCISES: exerciseList[] = [
	createExercise("Barbell Bench Press", "barbell", "chest"),
	createExercise(
		"Dumbbell Bench Press",
		"dumbell",
		"chest",
		"Lie on a flat bench holding dumbbells, lower them towards your chest, and press back up.",
	),
	createExercise(
		"Push-ups",
		"bodyweight",
		"chest",
		"Start in a plank position, lower your chest towards the ground, and push back up.",
	),
	createExercise(
		"Barbell Squat",
		"barbell",
		"legs",
		"Place a barbell on your upper back, squat down until your thighs are parallel to the ground, and stand back up.",
	),
	createExercise(
		"Dumbbell Lunges",
		"dumbell",
		"legs",
		"Hold dumbbells at your sides, step forward with one leg, lower your hips until both knees are bent at 90 degrees, and return.",
	),
	createExercise(
		"Leg Press",
		"machine",
		"legs",
		"Sit in the leg press machine, place your feet on the platform, push the platform away, and control its return.",
	),
	createExercise(
		"Deadlift",
		"barbell",
		"back", // Often considered full-body too
		"Lift a loaded barbell off the floor until you are standing upright, keeping your back straight.",
	),
	createExercise(
		"Pull-ups",
		"bodyweight",
		"back",
		"Hang from a bar with an overhand grip, pull your body up until your chin is over the bar, and lower back down.",
	),
	createExercise(
		"Assisted Pull-ups",
		"assisted-bodyweight",
		"back",
		"Use a machine or band to assist in performing the pull-up motion.",
	),
	createExercise(
		"Lat Pulldown",
		"machine",
		"back",
		"Sit at the lat pulldown machine, grasp the bar, pull it down towards your chest, and control its return.",
	),
	createExercise(
		"Barbell Rows",
		"barbell",
		"back",
		"Bend over with a barbell, pull the bar towards your lower chest/upper abdomen, and lower it back down.",
	),
	createExercise(
		"Overhead Press",
		"barbell",
		"shoulders",
		"Stand or sit, press a barbell from your upper chest/shoulders overhead until arms are fully extended.",
	),
	createExercise(
		"Dumbbell Lateral Raises",
		"dumbell",
		"shoulders",
		"Stand holding dumbbells at your sides, raise them out to the sides until they reach shoulder height.",
	),
	createExercise(
		"Shoulder Press Machine",
		"machine",
		"shoulders",
		"Sit in the shoulder press machine, push the handles upward until arms are extended.",
	),
	createExercise(
		"Barbell Bicep Curls",
		"barbell",
		"arms",
		"Stand holding a barbell, curl it upwards towards your shoulders, keeping elbows tucked in.",
	),
	createExercise(
		"Dumbbell Hammer Curls",
		"dumbell",
		"arms",
		"Stand holding dumbbells with palms facing each other, curl them upwards.",
	),
	createExercise(
		"Triceps Pushdowns",
		"machine",
		"arms",
		"Use a cable machine with an attachment, push the attachment down until your arms are fully extended.",
	),
	createExercise(
		"Dips",
		"bodyweight",
		"arms", // Also hits chest
		"Support yourself on parallel bars, lower your body by bending your elbows, and push back up.",
	),
	createExercise(
		"Plank",
		"duration",
		"core",
		"Hold a push-up like position, resting on forearms or hands, keeping the body in a straight line.",
	),
	createExercise(
		"Crunches",
		"reps-only",
		"core",
		"Lie on your back, knees bent, lift your upper body towards your knees.",
	),
	createExercise(
		"Russian Twists",
		"reps-only",
		"core",
		"Sit on the floor, lean back slightly, twist your torso from side to side, optionally holding a weight.",
	),
	createExercise(
		"Running",
		"cardio",
		"cardio",
		"Run outdoors or on a treadmill at a sustained pace.",
	),
	createExercise(
		"Cycling",
		"cardio",
		"cardio",
		"Ride a stationary or outdoor bicycle.",
	),
	createExercise(
		"Rowing",
		"machine",
		"cardio", // Also full-body
		"Use a rowing machine, engaging legs, core, and back.",
	),
	createExercise(
		"Burpees",
		"bodyweight",
		"full-body",
		"A full body exercise involving a squat, push-up, and jump.",
	),
	createExercise(
		"Kettlebell Swings",
		"other",
		"full-body", // Primarily targets posterior chain
		"Swing a kettlebell from between your legs up to chest or eye level using hip thrust.",
	),
	createExercise(
		"Clean and Jerk",
		"barbell",
		"olympic",
		"An Olympic weightlifting movement involving lifting a barbell from the floor to overhead in two motions.",
	),
	createExercise(
		"Snatch",
		"barbell",
		"olympic",
		"An Olympic weightlifting movement involving lifting a barbell from the floor to overhead in one continuous motion.",
	),
	createExercise(
		"Calf Raises",
		"bodyweight", // Can also be machine or weighted
		"legs",
		"Stand with feet flat, raise your heels off the ground, pushing through the balls of your feet.",
	),
	createExercise(
		"Wall Sit",
		"duration",
		"legs",
		"Lean against a wall with knees bent at 90 degrees, as if sitting in a chair.",
	),
];
