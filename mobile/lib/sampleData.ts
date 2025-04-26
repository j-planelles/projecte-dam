export const SAMPLE_WORKOUTS: workout[] = [
  {
    uuid: "w1-a7b3-c9d2-e5f4-g8h6",
    title: "Full Body Strength",
    timestamp: 1717075200000, // July 30, 2024
    duration: 60,
    gym: "Fitness First",
    creator: "Alex Johnson",
    description: "Complete full body workout targeting all major muscle groups",
    exercises: [
      {
        exercise: {
          uuid: "ex1-2a3b-4c5d-6e7f-8g9h",
          name: "Barbell Squat",
          type: "barbell",
          bodyPart: "legs",
          description:
            "Classic compound movement targeting quadriceps, hamstrings, and glutes",
        },
        sets: [
          { type: "normal", reps: 10, weight: 135 },
          { type: "normal", reps: 8, weight: 155 },
          { type: "normal", reps: 6, weight: 175 },
        ],
      },
      {
        exercise: {
          uuid: "ex2-3b4c-5d6e-7f8g-9h1i",
          name: "Bench Press",
          type: "barbell",
          bodyPart: "chest",
          description:
            "Horizontal pressing movement for chest, shoulders, and triceps",
        },
        sets: [
          { type: "normal", reps: 10, weight: 135 },
          { type: "normal", reps: 8, weight: 155 },
          { type: "normal", reps: 8, weight: 155 },
        ],
      },
      {
        exercise: {
          uuid: "ex3-4c5d-6e7f-8g9h-1i2j",
          name: "Bent Over Row",
          type: "barbell",
          bodyPart: "back",
          description: "Compound pulling movement for back thickness",
        },
        sets: [
          { type: "normal", reps: 10, weight: 95 },
          { type: "normal", reps: 10, weight: 115 },
          { type: "normal", reps: 8, weight: 135 },
        ],
      },
      {
        exercise: {
          uuid: "ex4-5d6e-7f8g-9h1i-2j3k",
          name: "Overhead Press",
          type: "barbell",
          bodyPart: "shoulders",
          description: "Vertical pressing movement for shoulder development",
        },
        sets: [
          { type: "normal", reps: 10, weight: 65 },
          { type: "normal", reps: 8, weight: 75 },
          { type: "normal", reps: 8, weight: 75 },
        ],
      },
      {
        exercise: {
          uuid: "ex5-6e7f-8g9h-1i2j-3k4l",
          name: "Plank",
          type: "bodyweight",
          bodyPart: "core",
          description: "Isometric core exercise for stability",
        },
        sets: [
          { type: "normal", reps: 1, weight: 0 },
          { type: "normal", reps: 1, weight: 0 },
          { type: "normal", reps: 1, weight: 0 },
        ],
      },
    ],
  },
  {
    uuid: "w2-b8c4-d1e3-f9g7-h5i2",
    title: "Upper Body Focus",
    timestamp: 1716988800000, // July 29, 2024
    duration: 45,
    gym: "Gold's Gym",
    creator: "Maria Santos",
    description: "Intense upper body workout targeting chest, back, and arms",
    exercises: [
      {
        exercise: {
          uuid: "ex6-7f8g-9h1i-2j3k-4l5m",
          name: "Incline Dumbbell Press",
          type: "dumbell",
          bodyPart: "chest",
          description: "Upper chest focused pressing movement",
        },
        sets: [
          { type: "normal", reps: 12, weight: 30 },
          { type: "normal", reps: 10, weight: 35 },
          { type: "normal", reps: 8, weight: 40 },
        ],
      },
      {
        exercise: {
          uuid: "ex7-8g9h-1i2j-3k4l-5m6n",
          name: "Lat Pulldown",
          type: "machine",
          bodyPart: "back",
          description: "Vertical pulling movement for back width",
        },
        sets: [
          { type: "normal", reps: 12, weight: 100 },
          { type: "normal", reps: 10, weight: 120 },
          { type: "normal", reps: 10, weight: 120 },
        ],
      },
      {
        exercise: {
          uuid: "ex8-9h1i-2j3k-4l5m-6n7o",
          name: "Seated Dumbbell Shoulder Press",
          type: "dumbell",
          bodyPart: "shoulders",
          description: "Seated pressing movement for shoulder development",
        },
        sets: [
          { type: "normal", reps: 12, weight: 20 },
          { type: "normal", reps: 10, weight: 25 },
          { type: "normal", reps: 8, weight: 30 },
        ],
      },
      {
        exercise: {
          uuid: "ex9-1i2j-3k4l-5m6n-7o8p",
          name: "Tricep Pushdown",
          type: "machine",
          bodyPart: "arms",
          description: "Isolation movement for triceps",
        },
        sets: [
          { type: "normal", reps: 15, weight: 50 },
          { type: "normal", reps: 12, weight: 60 },
          { type: "normal", reps: 10, weight: 70 },
        ],
      },
      {
        exercise: {
          uuid: "ex10-2j3k-4l5m-6n7o-8p9q",
          name: "Bicep Curl",
          type: "dumbell",
          bodyPart: "arms",
          description: "Isolation movement for biceps",
        },
        sets: [
          { type: "normal", reps: 12, weight: 20 },
          { type: "normal", reps: 10, weight: 25 },
          { type: "normal", reps: 10, weight: 25 },
        ],
      },
    ],
  },
  {
    uuid: "w3-c9d5-e2f4-g1h8-i6j3",
    title: "Lower Body Power",
    timestamp: 1716902400000, // July 28, 2024
    duration: 50,
    gym: "Planet Fitness",
    creator: "Jamal Williams",
    description: "Leg-focused workout emphasizing strength and power",
    exercises: [
      {
        exercise: {
          uuid: "ex11-3k4l-5m6n-7o8p-9q1r",
          name: "Deadlift",
          type: "barbell",
          bodyPart: "legs",
          description: "Compound pulling movement targeting posterior chain",
        },
        sets: [
          { type: "normal", reps: 8, weight: 185 },
          { type: "normal", reps: 6, weight: 225 },
          { type: "normal", reps: 4, weight: 255 },
        ],
      },
      {
        exercise: {
          uuid: "ex12-4l5m-6n7o-8p9q-1r2s",
          name: "Leg Press",
          type: "machine",
          bodyPart: "legs",
          description: "Machine-based leg pressing movement",
        },
        sets: [
          { type: "normal", reps: 12, weight: 225 },
          { type: "normal", reps: 10, weight: 270 },
          { type: "normal", reps: 8, weight: 315 },
        ],
      },
      {
        exercise: {
          uuid: "ex13-5m6n-7o8p-9q1r-2s3t",
          name: "Walking Lunges",
          type: "dumbell",
          bodyPart: "legs",
          description: "Dynamic movement for legs and balance",
        },
        sets: [
          { type: "normal", reps: 20, weight: 15 },
          { type: "normal", reps: 20, weight: 20 },
          { type: "normal", reps: 16, weight: 25 },
        ],
      },
      {
        exercise: {
          uuid: "ex14-6n7o-8p9q-1r2s-3t4u",
          name: "Leg Extension",
          type: "machine",
          bodyPart: "legs",
          description: "Isolation movement for quadriceps",
        },
        sets: [
          { type: "normal", reps: 15, weight: 90 },
          { type: "normal", reps: 12, weight: 110 },
          { type: "normal", reps: 10, weight: 130 },
        ],
      },
      {
        exercise: {
          uuid: "ex15-7o8p-9q1r-2s3t-4u5v",
          name: "Seated Leg Curl",
          type: "machine",
          bodyPart: "legs",
          description: "Isolation movement for hamstrings",
        },
        sets: [
          { type: "normal", reps: 15, weight: 70 },
          { type: "normal", reps: 12, weight: 80 },
          { type: "normal", reps: 10, weight: 90 },
        ],
      },
    ],
  },
  {
    uuid: "w4-d1e7-f3g5-h9i2-j4k6",
    title: "HIIT Cardio Blast",
    timestamp: 1716816000000, // July 27, 2024
    duration: 30,
    gym: "CrossFit Zone",
    creator: "Sophia Chen",
    description: "High-intensity interval training for maximum calorie burn",
    exercises: [
      {
        exercise: {
          uuid: "ex16-8p9q-1r2s-3t4u-5v6w",
          name: "Burpees",
          type: "bodyweight",
          bodyPart: "full-body",
          description: "Explosive full body movement",
        },
        sets: [
          { type: "normal", reps: 15, weight: 0 },
          { type: "normal", reps: 15, weight: 0 },
          { type: "normal", reps: 15, weight: 0 },
        ],
      },
      {
        exercise: {
          uuid: "ex17-9q1r-2s3t-4u5v-6w7x",
          name: "Mountain Climbers",
          type: "bodyweight",
          bodyPart: "full-body",
          description: "Dynamic core and cardio movement",
        },
        sets: [
          { type: "normal", reps: 30, weight: 0 },
          { type: "normal", reps: 30, weight: 0 },
          { type: "normal", reps: 30, weight: 0 },
        ],
      },
      {
        exercise: {
          uuid: "ex18-1r2s-3t4u-5v6w-7x8y",
          name: "Box Jumps",
          type: "bodyweight",
          bodyPart: "legs",
          description: "Explosive lower body movement",
        },
        sets: [
          { type: "normal", reps: 12, weight: 0 },
          { type: "normal", reps: 12, weight: 0 },
          { type: "normal", reps: 12, weight: 0 },
        ],
      },
      {
        exercise: {
          uuid: "ex19-2s3t-4u5v-6w7x-8y9z",
          name: "Kettlebell Swings",
          type: "other",
          bodyPart: "full-body",
          description: "Explosive hip hinge movement",
        },
        sets: [
          { type: "normal", reps: 20, weight: 35 },
          { type: "normal", reps: 20, weight: 35 },
          { type: "normal", reps: 20, weight: 35 },
        ],
      },
      {
        exercise: {
          uuid: "ex20-3t4u-5v6w-7x8y-9z1a",
          name: "Battle Ropes",
          type: "cardio",
          bodyPart: "full-body",
          description: "High-intensity rope movement",
        },
        sets: [
          { type: "normal", reps: 30, weight: 0 },
          { type: "normal", reps: 30, weight: 0 },
          { type: "normal", reps: 30, weight: 0 },
        ],
      },
    ],
  },
  {
    uuid: "w5-e2f8-g4h6-i1j3-k7l9",
    title: "Core and Stability",
    timestamp: 1716729600000, // July 26, 2024
    duration: 40,
    gym: "Home Workout",
    creator: "David Kim",
    description: "Focus on core strength and overall stability",
    exercises: [
      {
        exercise: {
          uuid: "ex21-4u5v-6w7x-8y9z-1a2b",
          name: "Plank Variations",
          type: "bodyweight",
          bodyPart: "core",
          description: "Isometric core exercises with variations",
        },
        sets: [
          { type: "normal", reps: 3, weight: 0 },
          { type: "normal", reps: 3, weight: 0 },
          { type: "normal", reps: 3, weight: 0 },
        ],
      },
      {
        exercise: {
          uuid: "ex22-5v6w-7x8y-9z1a-2b3c",
          name: "Russian Twists",
          type: "bodyweight",
          bodyPart: "core",
          description: "Rotational core movement",
        },
        sets: [
          { type: "normal", reps: 20, weight: 10 },
          { type: "normal", reps: 20, weight: 10 },
          { type: "normal", reps: 20, weight: 10 },
        ],
      },
      {
        exercise: {
          uuid: "ex23-6w7x-8y9z-1a2b-3c4d",
          name: "Hanging Leg Raises",
          type: "bodyweight",
          bodyPart: "core",
          description: "Dynamic lower core movement",
        },
        sets: [
          { type: "normal", reps: 12, weight: 0 },
          { type: "normal", reps: 12, weight: 0 },
          { type: "normal", reps: 10, weight: 0 },
        ],
      },
      {
        exercise: {
          uuid: "ex24-7x8y-9z1a-2b3c-4d5e",
          name: "Stability Ball Rollouts",
          type: "bodyweight",
          bodyPart: "core",
          description: "Anti-extension core exercise",
        },
        sets: [
          { type: "normal", reps: 12, weight: 0 },
          { type: "normal", reps: 10, weight: 0 },
          { type: "normal", reps: 8, weight: 0 },
        ],
      },
      {
        exercise: {
          uuid: "ex25-8y9z-1a2b-3c4d-5e6f",
          name: "Side Planks",
          type: "bodyweight",
          bodyPart: "core",
          description: "Lateral core stabilization",
        },
        sets: [
          { type: "normal", reps: 2, weight: 0 },
          { type: "normal", reps: 2, weight: 0 },
          { type: "normal", reps: 2, weight: 0 },
        ],
      },
    ],
  },
  {
    uuid: "w6-f3g9-h5i7-j2k4-l8m1",
    title: "Push Pull Legs - Day 1 (Push)",
    timestamp: 1716643200000, // July 25, 2024
    duration: 55,
    gym: "24 Hour Fitness",
    creator: "Ryan Garcia",
    description:
      "Focus on all pushing movements for chest, shoulders, and triceps",
    exercises: [
      {
        exercise: {
          uuid: "ex26-9z1a-2b3c-4d5e-6f7g",
          name: "Flat Bench Press",
          type: "barbell",
          bodyPart: "chest",
          description: "Horizontal pressing movement",
        },
        sets: [
          { type: "normal", reps: 10, weight: 135 },
          { type: "normal", reps: 8, weight: 155 },
          { type: "normal", reps: 6, weight: 175 },
          { type: "normal", reps: 6, weight: 175 },
        ],
      },
      {
        exercise: {
          uuid: "ex27-1a2b-3c4d-5e6f-7g8h",
          name: "Incline Dumbbell Press",
          type: "dumbell",
          bodyPart: "chest",
          description: "Upper chest focused press",
        },
        sets: [
          { type: "normal", reps: 10, weight: 35 },
          { type: "normal", reps: 10, weight: 40 },
          { type: "normal", reps: 8, weight: 45 },
        ],
      },
      {
        exercise: {
          uuid: "ex28-2b3c-4d5e-6f7g-8h9i",
          name: "Seated Military Press",
          type: "barbell",
          bodyPart: "shoulders",
          description: "Vertical pressing movement",
        },
        sets: [
          { type: "normal", reps: 10, weight: 85 },
          { type: "normal", reps: 8, weight: 95 },
          { type: "normal", reps: 8, weight: 95 },
        ],
      },
      {
        exercise: {
          uuid: "ex29-3c4d-5e6f-7g8h-9i1j",
          name: "Lateral Raises",
          type: "dumbell",
          bodyPart: "shoulders",
          description: "Lateral shoulder isolation",
        },
        sets: [
          { type: "normal", reps: 15, weight: 15 },
          { type: "normal", reps: 12, weight: 15 },
          { type: "normal", reps: 12, weight: 15 },
        ],
      },
      {
        exercise: {
          uuid: "ex30-4d5e-6f7g-8h9i-1j2k",
          name: "Tricep Dips",
          type: "bodyweight",
          bodyPart: "arms",
          description: "Compound tricep movement",
        },
        sets: [
          { type: "normal", reps: 12, weight: 0 },
          { type: "normal", reps: 10, weight: 0 },
          { type: "normal", reps: 8, weight: 0 },
        ],
      },
    ],
  },
  {
    uuid: "w7-g4h1-i6j8-k3l5-m9n2",
    title: "Push Pull Legs - Day 2 (Pull)",
    timestamp: 1716556800000, // July 24, 2024
    duration: 55,
    gym: "24 Hour Fitness",
    creator: "Ryan Garcia",
    description: "Focus on all pulling movements for back and biceps",
    exercises: [
      {
        exercise: {
          uuid: "ex31-5e6f-7g8h-9i1j-2k3l",
          name: "Deadlift",
          type: "barbell",
          bodyPart: "back",
          description: "Compound pulling movement",
        },
        sets: [
          { type: "normal", reps: 8, weight: 185 },
          { type: "normal", reps: 6, weight: 225 },
          { type: "normal", reps: 4, weight: 255 },
        ],
      },
      {
        exercise: {
          uuid: "ex32-6f7g-8h9i-1j2k-3l4m",
          name: "Pull-Ups",
          type: "bodyweight",
          bodyPart: "back",
          description: "Vertical pulling movement",
        },
        sets: [
          { type: "normal", reps: 10, weight: 0 },
          { type: "normal", reps: 8, weight: 0 },
          { type: "normal", reps: 8, weight: 0 },
        ],
      },
      {
        exercise: {
          uuid: "ex33-7g8h-9i1j-2k3l-4m5n",
          name: "Seated Cable Row",
          type: "machine",
          bodyPart: "back",
          description: "Horizontal pulling movement",
        },
        sets: [
          { type: "normal", reps: 12, weight: 120 },
          { type: "normal", reps: 10, weight: 140 },
          { type: "normal", reps: 8, weight: 160 },
        ],
      },
      {
        exercise: {
          uuid: "ex34-8h9i-1j2k-3l4m-5n6o",
          name: "Face Pulls",
          type: "machine",
          bodyPart: "shoulders",
          description: "Rear deltoid and rotator cuff movement",
        },
        sets: [
          { type: "normal", reps: 15, weight: 50 },
          { type: "normal", reps: 15, weight: 50 },
          { type: "normal", reps: 15, weight: 50 },
        ],
      },
      {
        exercise: {
          uuid: "ex35-9i1j-2k3l-4m5n-6o7p",
          name: "Barbell Bicep Curl",
          type: "barbell",
          bodyPart: "arms",
          description: "Compound bicep movement",
        },
        sets: [
          { type: "normal", reps: 12, weight: 45 },
          { type: "normal", reps: 10, weight: 55 },
          { type: "normal", reps: 8, weight: 65 },
        ],
      },
    ],
  },
  {
    uuid: "w8-h5i2-j7k9-l4m6-n1o3",
    title: "Push Pull Legs - Day 3 (Legs)",
    timestamp: 1716470400000, // July 23, 2024
    duration: 55,
    gym: "24 Hour Fitness",
    creator: "Ryan Garcia",
    description: "Focus on all leg movements for quads, hamstrings, and calves",
    exercises: [
      {
        exercise: {
          uuid: "ex36-1j2k-3l4m-5n6o-7p8q",
          name: "Barbell Back Squat",
          type: "barbell",
          bodyPart: "legs",
          description: "Compound leg movement",
        },
        sets: [
          { type: "normal", reps: 10, weight: 155 },
          { type: "normal", reps: 8, weight: 185 },
          { type: "normal", reps: 6, weight: 205 },
        ],
      },
      {
        exercise: {
          uuid: "ex37-2k3l-4m5n-6o7p-8q9r",
          name: "Romanian Deadlift",
          type: "barbell",
          bodyPart: "legs",
          description: "Hamstring focused movement",
        },
        sets: [
          { type: "normal", reps: 10, weight: 135 },
          { type: "normal", reps: 10, weight: 155 },
          { type: "normal", reps: 8, weight: 175 },
        ],
      },
      {
        exercise: {
          uuid: "ex38-3l4m-5n6o-7p8q-9r1s",
          name: "Leg Press",
          type: "machine",
          bodyPart: "legs",
          description: "Compound leg machine movement",
        },
        sets: [
          { type: "normal", reps: 12, weight: 270 },
          { type: "normal", reps: 10, weight: 360 },
          { type: "normal", reps: 8, weight: 450 },
        ],
      },
      {
        exercise: {
          uuid: "ex39-4m5n-6o7p-8q9r-1s2t",
          name: "Walking Lunges",
          type: "dumbell",
          bodyPart: "legs",
          description: "Unilateral leg movement",
        },
        sets: [
          { type: "normal", reps: 20, weight: 20 },
          { type: "normal", reps: 20, weight: 25 },
          { type: "normal", reps: 16, weight: 30 },
        ],
      },
      {
        exercise: {
          uuid: "ex40-5n6o-7p8q-9r1s-2t3u",
          name: "Standing Calf Raises",
          type: "machine",
          bodyPart: "legs",
          description: "Isolated calf movement",
        },
        sets: [
          { type: "normal", reps: 15, weight: 120 },
          { type: "normal", reps: 15, weight: 140 },
          { type: "normal", reps: 15, weight: 140 },
        ],
      },
    ],
  },
  {
    uuid: "w9-i6j3-k8l1-m5n7-o2p4",
    title: "Endurance Training",
    timestamp: 1716384000000, // July 22, 2024
    duration: 45,
    gym: "Running Track",
    creator: "Emma Lewis",
    description: "Cardio-focused workout to build endurance",
    exercises: [
      {
        exercise: {
          uuid: "ex41-6o7p-8q9r-1s2t-3u4v",
          name: "Treadmill Run",
          type: "cardio",
          bodyPart: "cardio",
          description: "Steady state running",
        },
        sets: [
          { type: "normal", reps: 1, weight: 0 }, // 20 minutes straight
        ],
      },
      {
        exercise: {
          uuid: "ex42-7p8q-9r1s-2t3u-4v5w",
          name: "Sprint Intervals",
          type: "cardio",
          bodyPart: "cardio",
          description: "30 second sprint, 90 second recovery",
        },
        sets: [{ type: "normal", reps: 8, weight: 0 }],
      },
      {
        exercise: {
          uuid: "ex43-8q9r-1s2t-3u4v-5w6x",
          name: "Jumping Jacks",
          type: "cardio",
          bodyPart: "cardio",
          description: "Full body cardio movement",
        },
        sets: [
          { type: "normal", reps: 50, weight: 0 },
          { type: "normal", reps: 50, weight: 0 },
        ],
      },
      {
        exercise: {
          uuid: "ex44-9r1s-2t3u-4v5w-6x7y",
          name: "Jump Rope",
          type: "cardio",
          bodyPart: "cardio",
          description: "Coordination and cardio",
        },
        sets: [
          { type: "normal", reps: 100, weight: 0 },
          { type: "normal", reps: 100, weight: 0 },
        ],
      },
    ],
  },
  {
    uuid: "w10-j7k4-l9m2-n6o8-p3q5",
    title: "Bodyweight Circuit",
    timestamp: 1716297600000, // July 21, 2024
    duration: 35,
    gym: "Home Workout",
    creator: "Tomas Rivera",
    description: "No equipment needed full body circuit",
    exercises: [
      {
        exercise: {
          uuid: "ex45-1s2t-3u4v-5w6x-7y8z",
          name: "Push-Ups",
          type: "bodyweight",
          bodyPart: "chest",
          description: "Classic bodyweight chest exercise",
        },
        sets: [
          { type: "normal", reps: 20, weight: 0 },
          { type: "normal", reps: 15, weight: 0 },
          { type: "normal", reps: 15, weight: 0 },
        ],
      },
      {
        exercise: {
          uuid: "ex46-2t3u-4v5w-6x7y-8z9a",
          name: "Bodyweight Squats",
          type: "bodyweight",
          bodyPart: "legs",
          description: "Basic leg movement",
        },
        sets: [
          { type: "normal", reps: 25, weight: 0 },
          { type: "normal", reps: 25, weight: 0 },
          { type: "normal", reps: 25, weight: 0 },
        ],
      },
      {
        exercise: {
          uuid: "ex47-3u4v-5w6x-7y8z-9a1b",
          name: "Pull-Ups",
          type: "bodyweight",
          bodyPart: "back",
          description: "Upper body pulling movement",
        },
        sets: [
          { type: "normal", reps: 10, weight: 0 },
          { type: "normal", reps: 8, weight: 0 },
          { type: "normal", reps: 6, weight: 0 },
        ],
      },
      {
        exercise: {
          uuid: "ex48-4v5w-6x7y-8z9a-1b2c",
          name: "Dips",
          type: "bodyweight",
          bodyPart: "arms",
          description: "Tricep and chest exercise",
        },
        sets: [
          { type: "normal", reps: 15, weight: 0 },
          { type: "normal", reps: 12, weight: 0 },
          { type: "normal", reps: 10, weight: 0 },
        ],
      },
      {
        exercise: {
          uuid: "ex49-5w6x-7y8z-9a1b-2c3d",
          name: "Plank",
          type: "bodyweight",
          bodyPart: "core",
          description: "Core stabilization exercise",
        },
        sets: [
          { type: "normal", reps: 1, weight: 0 },
          { type: "normal", reps: 1, weight: 0 },
          { type: "normal", reps: 1, weight: 0 },
        ],
      },
    ],
  },
  {
    uuid: "w11-k8l5-m1n3-o7p9-q4r6",
    title: "Olympic Lifting Session",
    timestamp: 1716211200000, // July 20, 2024
    duration: 70,
    gym: "CrossFit Box",
    creator: "Marcus Johnson",
    description:
      "Technical Olympic lifting workout for power and explosiveness",
    exercises: [
      {
        exercise: {
          uuid: "ex50-6x7y-8z9a-1b2c-3d4e",
          name: "Clean and Jerk",
          type: "barbell",
          bodyPart: "olympic",
          description: "Full Olympic lift",
        },
        sets: [
          { type: "normal", reps: 5, weight: 95 },
          { type: "normal", reps: 3, weight: 115 },
          { type: "normal", reps: 3, weight: 135 },
          { type: "normal", reps: 2, weight: 155 },
        ],
      },
      {
        exercise: {
          uuid: "ex51-7y8z-9a1b-2c3d-4e5f",
          name: "Snatch",
          type: "barbell",
          bodyPart: "olympic",
          description: "Technical full-body Olympic lift",
        },
        sets: [
          { type: "normal", reps: 5, weight: 75 },
          { type: "normal", reps: 3, weight: 95 },
          { type: "normal", reps: 3, weight: 115 },
          { type: "normal", reps: 2, weight: 135 },
        ],
      },
      {
        exercise: {
          uuid: "ex52-8z9a-1b2c-3d4e-5f6g",
          name: "Front Squats",
          type: "barbell",
          bodyPart: "legs",
          description: "Olympic-style front-loaded squat",
        },
        sets: [
          { type: "normal", reps: 6, weight: 135 },
          { type: "normal", reps: 6, weight: 155 },
          { type: "normal", reps: 4, weight: 175 },
        ],
      },
      {
        exercise: {
          uuid: "ex53-9a1b-2c3d-4e5f-6g7h",
          name: "Overhead Squats",
          type: "barbell",
          bodyPart: "full-body",
          description: "Stability and mobility focused squat",
        },
        sets: [
          { type: "normal", reps: 8, weight: 75 },
          { type: "normal", reps: 6, weight: 95 },
          { type: "normal", reps: 4, weight: 115 },
        ],
      },
    ],
  },
  {
    uuid: "w12-l9m6-n2o4-p8q1-r5s7",
    title: "Back and Biceps",
    timestamp: 1716124800000, // July 19, 2024
    duration: 50,
    gym: "LA Fitness",
    creator: "Olivia Parker",
    description: "Focus on back thickness and width, plus bicep development",
    exercises: [
      {
        exercise: {
          uuid: "ex54-1b2c-3d4e-5f6g-7h8i",
          name: "Deadlift",
          type: "barbell",
          bodyPart: "back",
          description: "Compound posterior chain exercise",
        },
        sets: [
          { type: "normal", reps: 8, weight: 185 },
          { type: "normal", reps: 6, weight: 225 },
          { type: "normal", reps: 4, weight: 275 },
        ],
      },
      {
        exercise: {
          uuid: "ex55-2c3d-4e5f-6g7h-8i9j",
          name: "Barbell Rows",
          type: "barbell",
          bodyPart: "back",
          description: "Horizontal pulling for back thickness",
        },
        sets: [
          { type: "normal", reps: 10, weight: 135 },
          { type: "normal", reps: 8, weight: 155 },
          { type: "normal", reps: 8, weight: 155 },
        ],
      },
      {
        exercise: {
          uuid: "ex56-3d4e-5f6g-7h8i-9j1k",
          name: "Pull-Ups",
          type: "bodyweight",
          bodyPart: "back",
          description: "Vertical pulling for back width",
        },
        sets: [
          { type: "normal", reps: 10, weight: 0 },
          { type: "normal", reps: 8, weight: 0 },
          { type: "normal", reps: 8, weight: 0 },
        ],
      },
      {
        exercise: {
          uuid: "ex57-4e5f-6g7h-8i9j-1k2l",
          name: "Preacher Curls",
          type: "barbell",
          bodyPart: "arms",
          description: "Isolated bicep exercise",
        },
        sets: [
          { type: "normal", reps: 12, weight: 65 },
          { type: "normal", reps: 10, weight: 75 },
          { type: "normal", reps: 8, weight: 85 },
        ],
      },
      {
        exercise: {
          uuid: "ex58-5f6g-7h8i-9j1k-2l3m",
          name: "Hammer Curls",
          type: "dumbell",
          bodyPart: "arms",
          description: "Bicep and brachialis exercise",
        },
        sets: [
          { type: "normal", reps: 12, weight: 25 },
          { type: "normal", reps: 10, weight: 30 },
          { type: "normal", reps: 10, weight: 30 },
        ],
      },
    ],
  },
  {
    uuid: "w13-m1n7-o3p5-q9r2-s6t8",
    title: "Chest and Triceps",
    timestamp: 1716038400000, // July 18, 2024
    duration: 50,
    gym: "LA Fitness",
    creator: "Olivia Parker",
    description: "Focus on chest development and tricep strength",
    exercises: [
      {
        exercise: {
          uuid: "ex59-6g7h-8i9j-1k2l-3m4n",
          name: "Barbell Bench Press",
          type: "barbell",
          bodyPart: "chest",
          description: "Horizontal pressing movement",
        },
        sets: [
          { type: "normal", reps: 10, weight: 135 },
          { type: "normal", reps: 8, weight: 155 },
          { type: "normal", reps: 6, weight: 175 },
          { type: "normal", reps: 4, weight: 185 },
        ],
      },
      {
        exercise: {
          uuid: "ex60-7h8i-9j1k-2l3m-4n5o",
          name: "Incline Dumbbell Press",
          type: "dumbell",
          bodyPart: "chest",
          description: "Upper chest focused pressing",
        },
        sets: [
          { type: "normal", reps: 10, weight: 40 },
          { type: "normal", reps: 8, weight: 45 },
          { type: "normal", reps: 8, weight: 50 },
        ],
      },
      {
        exercise: {
          uuid: "ex61-8i9j-1k2l-3m4n-5o6p",
          name: "Cable Flyes",
          type: "machine",
          bodyPart: "chest",
          description: "Chest isolation movement",
        },
        sets: [
          { type: "normal", reps: 12, weight: 20 },
          { type: "normal", reps: 12, weight: 25 },
          { type: "normal", reps: 10, weight: 30 },
        ],
      },
      {
        exercise: {
          uuid: "ex62-9j1k-2l3m-4n5o-6p7q",
          name: "Skull Crushers",
          type: "barbell",
          bodyPart: "arms",
          description: "Tricep isolation exercise",
        },
        sets: [
          { type: "normal", reps: 12, weight: 45 },
          { type: "normal", reps: 10, weight: 55 },
          { type: "normal", reps: 8, weight: 65 },
        ],
      },
      {
        exercise: {
          uuid: "ex63-1k2l-3m4n-5o6p-7q8r",
          name: "Tricep Pushdowns",
          type: "machine",
          bodyPart: "arms",
          description: "Cable tricep isolation",
        },
        sets: [
          { type: "normal", reps: 15, weight: 50 },
          { type: "normal", reps: 12, weight: 60 },
          { type: "normal", reps: 10, weight: 70 },
        ],
      },
    ],
  },
  {
    uuid: "w14-n2o8-p4q6-r1s3-t7u9",
    title: "Shoulder Focus",
    timestamp: 1715952000000, // July 17, 2024
    duration: 45,
    gym: "LA Fitness",
    creator: "Olivia Parker",
    description: "Comprehensive shoulder development workout",
    exercises: [
      {
        exercise: {
          uuid: "ex64-2l3m-4n5o-6p7q-8r9s",
          name: "Seated Barbell Press",
          type: "barbell",
          bodyPart: "shoulders",
          description: "Compound shoulder pressing",
        },
        sets: [
          { type: "normal", reps: 10, weight: 65 },
          { type: "normal", reps: 8, weight: 85 },
          { type: "normal", reps: 6, weight: 105 },
        ],
      },
      {
        exercise: {
          uuid: "ex65-3m4n-5o6p-7q8r-9s1t",
          name: "Lateral Raises",
          type: "dumbell",
          bodyPart: "shoulders",
          description: "Lateral deltoid isolation",
        },
        sets: [
          { type: "normal", reps: 15, weight: 15 },
          { type: "normal", reps: 12, weight: 17.5 },
          { type: "normal", reps: 12, weight: 20 },
        ],
      },
      {
        exercise: {
          uuid: "ex66-4n5o-6p7q-8r9s-1t2u",
          name: "Front Raises",
          type: "dumbell",
          bodyPart: "shoulders",
          description: "Anterior deltoid isolation",
        },
        sets: [
          { type: "normal", reps: 12, weight: 15 },
          { type: "normal", reps: 12, weight: 17.5 },
          { type: "normal", reps: 10, weight: 20 },
        ],
      },
      {
        exercise: {
          uuid: "ex67-5o6p-7q8r-9s1t-2u3v",
          name: "Reverse Flyes",
          type: "dumbell",
          bodyPart: "shoulders",
          description: "Posterior deltoid isolation",
        },
        sets: [
          { type: "normal", reps: 15, weight: 10 },
          { type: "normal", reps: 15, weight: 12.5 },
          { type: "normal", reps: 12, weight: 15 },
        ],
      },
      {
        exercise: {
          uuid: "ex68-6p7q-8r9s-1t2u-3v4w",
          name: "Shrugs",
          type: "dumbell",
          bodyPart: "shoulders",
          description: "Trapezius isolation",
        },
        sets: [
          { type: "normal", reps: 15, weight: 40 },
          { type: "normal", reps: 15, weight: 45 },
          { type: "normal", reps: 12, weight: 50 },
        ],
      },
    ],
  },
  {
    uuid: "w15-o3p9-q5r7-s2t4-u8v1",
    title: "5x5 Strength",
    timestamp: 1715865600000, // July 16, 2024
    duration: 60,
    gym: "Strength Factory",
    creator: "Mike Thompson",
    description: "Classic 5x5 strength program focusing on compound lifts",
    exercises: [
      {
        exercise: {
          uuid: "ex69-7q8r-9s1t-2u3v-4w5x",
          name: "Barbell Squat",
          type: "barbell",
          bodyPart: "legs",
          description: "Compound lower body movement",
        },
        sets: [
          { type: "normal", reps: 5, weight: 135 },
          { type: "normal", reps: 5, weight: 185 },
          { type: "normal", reps: 5, weight: 225 },
          { type: "normal", reps: 5, weight: 225 },
          { type: "normal", reps: 5, weight: 225 },
        ],
      },
      {
        exercise: {
          uuid: "ex70-8r9s-1t2u-3v4w-5x6y",
          name: "Bench Press",
          type: "barbell",
          bodyPart: "chest",
          description: "Compound upper body push",
        },
        sets: [
          { type: "normal", reps: 5, weight: 135 },
          { type: "normal", reps: 5, weight: 155 },
          { type: "normal", reps: 5, weight: 175 },
          { type: "normal", reps: 5, weight: 175 },
          { type: "normal", reps: 5, weight: 175 },
        ],
      },
      {
        exercise: {
          uuid: "ex71-9s1t-2u3v-4w5x-6y7z",
          name: "Barbell Row",
          type: "barbell",
          bodyPart: "back",
          description: "Compound upper body pull",
        },
        sets: [
          { type: "normal", reps: 5, weight: 95 },
          { type: "normal", reps: 5, weight: 115 },
          { type: "normal", reps: 5, weight: 135 },
          { type: "normal", reps: 5, weight: 135 },
          { type: "normal", reps: 5, weight: 135 },
        ],
      },
    ],
  },
  {
    uuid: "w16-p4q1-r6s8-t3u5-v9w2",
    title: "Powerlifting",
    timestamp: 1715779200000, // July 15, 2024
    duration: 75,
    gym: "Strength Factory",
    creator: "Mike Thompson",
    description: "Heavy compound lifts for strength development",
    exercises: [
      {
        exercise: {
          uuid: "ex72-1t2u-3v4w-5x6y-7z8a",
          name: "Deadlift",
          type: "barbell",
          bodyPart: "back",
          description: "Heavy posterior chain movement",
        },
        sets: [
          { type: "normal", reps: 5, weight: 185 },
          { type: "normal", reps: 5, weight: 225 },
          { type: "normal", reps: 3, weight: 275 },
          { type: "normal", reps: 1, weight: 315 },
          { type: "normal", reps: 1, weight: 335 },
        ],
      },
      {
        exercise: {
          uuid: "ex73-2u3v-4w5x-6y7z-8a9b",
          name: "Squat",
          type: "barbell",
          bodyPart: "legs",
          description: "Heavy compound leg movement",
        },
        sets: [
          { type: "normal", reps: 5, weight: 185 },
          { type: "normal", reps: 5, weight: 225 },
          { type: "normal", reps: 3, weight: 255 },
          { type: "normal", reps: 2, weight: 275 },
        ],
      },
      {
        exercise: {
          uuid: "ex74-3v4w-5x6y-7z8a-9b1c",
          name: "Bench Press",
          type: "barbell",
          bodyPart: "chest",
          description: "Heavy horizontal pressing",
        },
        sets: [
          { type: "normal", reps: 5, weight: 135 },
          { type: "normal", reps: 5, weight: 155 },
          { type: "normal", reps: 3, weight: 185 },
          { type: "normal", reps: 2, weight: 205 },
          { type: "normal", reps: 1, weight: 225 },
        ],
      },
    ],
  },
  {
    uuid: "w17-q5r2-s7t9-u4v6-w1x3",
    title: "Functional Training",
    timestamp: 1715692800000, // July 14, 2024
    duration: 55,
    gym: "CrossFit Zone",
    creator: "Lisa Wang",
    description:
      "Movements that mimic everyday activities for practical strength",
    exercises: [
      {
        exercise: {
          uuid: "ex75-4w5x-6y7z-8a9b-1c2d",
          name: "Kettlebell Swings",
          type: "other",
          bodyPart: "full-body",
          description: "Explosive hip hinge movement",
        },
        sets: [
          { type: "normal", reps: 20, weight: 35 },
          { type: "normal", reps: 15, weight: 44 },
          { type: "normal", reps: 15, weight: 53 },
        ],
      },
      {
        exercise: {
          uuid: "ex76-5x6y-7z8a-9b1c-2d3e",
          name: "Medicine Ball Slams",
          type: "other",
          bodyPart: "full-body",
          description: "Explosive power movement",
        },
        sets: [
          { type: "normal", reps: 15, weight: 15 },
          { type: "normal", reps: 15, weight: 15 },
          { type: "normal", reps: 15, weight: 15 },
        ],
      },
      {
        exercise: {
          uuid: "ex77-6y7z-8a9b-1c2d-3e4f",
          name: "TRX Rows",
          type: "bodyweight",
          bodyPart: "back",
          description: "Suspension trainer pulling",
        },
        sets: [
          { type: "normal", reps: 15, weight: 0 },
          { type: "normal", reps: 12, weight: 0 },
          { type: "normal", reps: 12, weight: 0 },
        ],
      },
      {
        exercise: {
          uuid: "ex78-7z8a-9b1c-2d3e-4f5g",
          name: "Farmer's Carry",
          type: "other",
          bodyPart: "full-body",
          description: "Loaded walking for grip and core",
        },
        sets: [
          { type: "normal", reps: 1, weight: 70 },
          { type: "normal", reps: 1, weight: 70 },
          { type: "normal", reps: 1, weight: 70 },
        ],
      },
      {
        exercise: {
          uuid: "ex79-8a9b-1c2d-3e4f-5g6h",
          name: "Battle Ropes",
          type: "cardio",
          bodyPart: "full-body",
          description: "High-intensity conditioning",
        },
        sets: [
          { type: "normal", reps: 30, weight: 0 },
          { type: "normal", reps: 30, weight: 0 },
          { type: "normal", reps: 30, weight: 0 },
        ],
      },
    ],
  },
  {
    uuid: "w18-r6s3-t8u1-v5w7-x2y4",
    title: "HIIT and Core",
    timestamp: 1715606400000, // July 13, 2024
    duration: 40,
    gym: "Home Workout",
    creator: "Jamie Fisher",
    description: "High-intensity intervals mixed with core strengthening",
    exercises: [
      {
        exercise: {
          uuid: "ex80-9b1c-2d3e-4f5g-6h7i",
          name: "Burpees",
          type: "bodyweight",
          bodyPart: "full-body",
          description: "Full body explosive movement",
        },
        sets: [
          { type: "normal", reps: 15, weight: 0 },
          { type: "normal", reps: 15, weight: 0 },
          { type: "normal", reps: 15, weight: 0 },
        ],
      },
      {
        exercise: {
          uuid: "ex81-1c2d-3e4f-5g6h-7i8j",
          name: "Mountain Climbers",
          type: "bodyweight",
          bodyPart: "full-body",
          description: "Dynamic core and cardio",
        },
        sets: [
          { type: "normal", reps: 30, weight: 0 },
          { type: "normal", reps: 30, weight: 0 },
          { type: "normal", reps: 30, weight: 0 },
        ],
      },
      {
        exercise: {
          uuid: "ex82-2d3e-4f5g-6h7i-8j9k",
          name: "Russian Twists",
          type: "bodyweight",
          bodyPart: "core",
          description: "Rotational core movement",
        },
        sets: [
          { type: "normal", reps: 20, weight: 10 },
          { type: "normal", reps: 20, weight: 10 },
          { type: "normal", reps: 20, weight: 10 },
        ],
      },
      {
        exercise: {
          uuid: "ex83-3e4f-5g6h-7i8j-9k1l",
          name: "Bicycle Crunches",
          type: "bodyweight",
          bodyPart: "core",
          description: "Dynamic core exercise",
        },
        sets: [
          { type: "normal", reps: 30, weight: 0 },
          { type: "normal", reps: 30, weight: 0 },
          { type: "normal", reps: 30, weight: 0 },
        ],
      },
      {
        exercise: {
          uuid: "ex84-4f5g-6h7i-8j9k-1l2m",
          name: "Plank Shoulder Taps",
          type: "bodyweight",
          bodyPart: "core",
          description: "Anti-rotation core exercise",
        },
        sets: [
          { type: "normal", reps: 20, weight: 0 },
          { type: "normal", reps: 20, weight: 0 },
          { type: "normal", reps: 20, weight: 0 },
        ],
      },
    ],
  },
  {
    uuid: "w19-s7t4-u9v2-w6x8-y3z5",
    title: "Active Recovery",
    timestamp: 1715520000000, // July 12, 2024
    duration: 30,
    gym: "Home Workout",
    creator: "Sarah Miller",
    description: "Low-intensity workout for recovery and mobility",
    exercises: [
      {
        exercise: {
          uuid: "ex85-5g6h-7i8j-9k1l-2m3n",
          name: "Walking",
          type: "cardio",
          bodyPart: "cardio",
          description: "Low-intensity steady state cardio",
        },
        sets: [
          { type: "normal", reps: 1, weight: 0 }, // 15 minutes
        ],
      },
      {
        exercise: {
          uuid: "ex86-6h7i-8j9k-1l2m-3n4o",
          name: "Dynamic Stretching",
          type: "bodyweight",
          bodyPart: "full-body",
          description: "Movement-based flexibility work",
        },
        sets: [
          { type: "normal", reps: 10, weight: 0 }, // 10 minutes of various stretches
        ],
      },
      {
        exercise: {
          uuid: "ex87-7i8j-9k1l-2m3n-4o5p",
          name: "Foam Rolling",
          type: "other",
          bodyPart: "full-body",
          description: "Self-myofascial release",
        },
        sets: [
          { type: "normal", reps: 1, weight: 0 }, // 5 minutes on various body parts
        ],
      },
    ],
  },
  {
    uuid: "w20-t8u5-v1w3-x7y9-z4a6",
    title: "CrossFit WOD",
    timestamp: 1715433600000, // July 11, 2024
    duration: 20,
    gym: "CrossFit Box",
    creator: "Coach Anderson",
    description: "High-intensity CrossFit workout of the day",
    exercises: [
      {
        exercise: {
          uuid: "ex88-8j9k-1l2m-3n4o-5p6q",
          name: "Thrusters",
          type: "barbell",
          bodyPart: "full-body",
          description: "Combination of front squat and overhead press",
        },
        sets: [
          { type: "normal", reps: 21, weight: 95 },
          { type: "normal", reps: 15, weight: 95 },
          { type: "normal", reps: 9, weight: 95 },
        ],
      },
      {
        exercise: {
          uuid: "ex89-9k1l-2m3n-4o5p-6q7r",
          name: "Pull-Ups",
          type: "bodyweight",
          bodyPart: "back",
          description: "Upper body pulling movement",
        },
        sets: [
          { type: "normal", reps: 21, weight: 0 },
          { type: "normal", reps: 15, weight: 0 },
          { type: "normal", reps: 9, weight: 0 },
        ],
      },
    ],
  },
  {
    uuid: "w21-u9v6-w2x4-y8z1-a5b7",
    title: "Mobility and Flexibility",
    timestamp: 1715347200000, // July 10, 2024
    duration: 45,
    gym: "Yoga Studio",
    creator: "Emma Lewis",
    description: "Focus on increasing range of motion and preventing injury",
    exercises: [
      {
        exercise: {
          uuid: "ex90-1l2m-3n4o-5p6q-7r8s",
          name: "Dynamic Hip Stretches",
          type: "bodyweight",
          bodyPart: "legs",
          description: "Series of movements to open hip mobility",
        },
        sets: [
          { type: "normal", reps: 15, weight: 0 },
          { type: "normal", reps: 15, weight: 0 },
        ],
      },
      {
        exercise: {
          uuid: "ex91-2m3n-4o5p-6q7r-8s9t",
          name: "Shoulder Mobility",
          type: "bodyweight",
          bodyPart: "shoulders",
          description: "Series of movements for shoulder health",
        },
        sets: [
          { type: "normal", reps: 15, weight: 0 },
          { type: "normal", reps: 15, weight: 0 },
        ],
      },
      {
        exercise: {
          uuid: "ex92-3n4o-5p6q-7r8s-9t1u",
          name: "Thoracic Spine Rotations",
          type: "bodyweight",
          bodyPart: "back",
          description: "Improving thoracic mobility",
        },
        sets: [
          { type: "normal", reps: 10, weight: 0 },
          { type: "normal", reps: 10, weight: 0 },
        ],
      },
      {
        exercise: {
          uuid: "ex93-4o5p-6q7r-8s9t-1u2v",
          name: "Ankle Mobility",
          type: "bodyweight",
          bodyPart: "legs",
          description: "Improving ankle range of motion",
        },
        sets: [
          { type: "normal", reps: 15, weight: 0 },
          { type: "normal", reps: 15, weight: 0 },
        ],
      },
    ],
  },
  {
    uuid: "w22-v1w7-x3y5-z9a2-b6c8",
    title: "Strongman Training",
    timestamp: 1715260800000, // July 9, 2024
    duration: 60,
    gym: "Strength Factory",
    creator: "Brian Wilson",
    description: "Unconventional strength training with strongman implements",
    exercises: [
      {
        exercise: {
          uuid: "ex94-5p6q-7r8s-9t1u-2v3w",
          name: "Atlas Stone Lifts",
          type: "other",
          bodyPart: "full-body",
          description: "Lifting a stone from ground to shoulder",
        },
        sets: [
          { type: "normal", reps: 5, weight: 150 },
          { type: "normal", reps: 3, weight: 175 },
          { type: "normal", reps: 3, weight: 200 },
        ],
      },
      {
        exercise: {
          uuid: "ex95-6q7r-8s9t-1u2v-3w4x",
          name: "Farmer's Walk",
          type: "other",
          bodyPart: "full-body",
          description: "Heavy loaded carry",
        },
        sets: [
          { type: "normal", reps: 1, weight: 160 },
          { type: "normal", reps: 1, weight: 180 },
          { type: "normal", reps: 1, weight: 200 },
        ],
      },
      {
        exercise: {
          uuid: "ex96-7r8s-9t1u-2v3w-4x5y",
          name: "Tire Flips",
          type: "other",
          bodyPart: "full-body",
          description: "Explosive movement flipping a heavy tire",
        },
        sets: [
          { type: "normal", reps: 8, weight: 400 },
          { type: "normal", reps: 6, weight: 400 },
          { type: "normal", reps: 6, weight: 400 },
        ],
      },
      {
        exercise: {
          uuid: "ex97-8s9t-1u2v-3w4x-5y6z",
          name: "Log Press",
          type: "other",
          bodyPart: "shoulders",
          description: "Pressing a thick log overhead",
        },
        sets: [
          { type: "normal", reps: 5, weight: 140 },
          { type: "normal", reps: 5, weight: 160 },
          { type: "normal", reps: 3, weight: 180 },
        ],
      },
    ],
  },
  {
    uuid: "w23-w2x8-y4z6-a1b3-c7d9",
    title: "Boxing Conditioning",
    timestamp: 1715174400000, // July 8, 2024
    duration: 50,
    gym: "Boxing Gym",
    creator: "Tony Ramirez",
    description: "Boxing-inspired cardio and conditioning workout",
    exercises: [
      {
        exercise: {
          uuid: "ex98-9t1u-2v3w-4x5y-6z7a",
          name: "Jump Rope",
          type: "cardio",
          bodyPart: "cardio",
          description: "Boxing warm-up and footwork",
        },
        sets: [
          { type: "normal", reps: 1, weight: 0 }, // 5 minutes straight
        ],
      },
      {
        exercise: {
          uuid: "ex99-1u2v-3w4x-5y6z-7a8b",
          name: "Heavy Bag Work",
          type: "cardio",
          bodyPart: "full-body",
          description: "Striking combinations on heavy bag",
        },
        sets: [
          { type: "normal", reps: 3, weight: 0 }, // 3 rounds of 3 minutes
        ],
      },
      {
        exercise: {
          uuid: "ex100-2v3w-4x5y-6z7a-8b9c",
          name: "Shadow Boxing",
          type: "cardio",
          bodyPart: "full-body",
          description: "Technique and movement practice",
        },
        sets: [
          { type: "normal", reps: 3, weight: 0 }, // 3 rounds of 3 minutes
        ],
      },
      {
        exercise: {
          uuid: "ex101-3w4x-5y6z-7a8b-9c1d",
          name: "Speed Bag",
          type: "cardio",
          bodyPart: "arms",
          description: "Rhythm and coordination training",
        },
        sets: [
          { type: "normal", reps: 2, weight: 0 }, // 2 rounds of 2 minutes
        ],
      },
      {
        exercise: {
          uuid: "ex102-4x5y-6z7a-8b9c-1d2e",
          name: "Footwork Drills",
          type: "cardio",
          bodyPart: "legs",
          description: "Boxing movement patterns",
        },
        sets: [
          { type: "normal", reps: 3, weight: 0 }, // 3 rounds of 2 minutes
        ],
      },
    ],
  },
];

export const SAMPLE_MESSAGES: message[] = [
  {
    uuid: "123e4567-e89b-12d3-a456-426655440000",
    text: "Hello, how are you?",
    sentByTrainer: true,
  },
  {
    uuid: "123e4567-e89b-12d3-a456-426655440001",
    text: "I'm good, thanks!",
    sentByTrainer: false,
  },
  {
    uuid: "123e4567-e89b-12d3-a456-426655440002",
    text: "What's up?",
    sentByTrainer: true,
  },
  {
    uuid: "123e4567-e89b-12d3-a456-426655440003",
    text: "Not much, just chillin'",
    sentByTrainer: false,
  },
  {
    uuid: "123e4567-e89b-12d3-a456-426655440004",
    text: "That sounds cool",
    sentByTrainer: true,
  },
  {
    uuid: "123e4567-e89b-12d3-a456-426655440005",
    text: "Yeah, it is",
    sentByTrainer: false,
  },
  {
    uuid: "123e4567-e89b-12d3-a456-426655440006",
    text: "Do you want to meet up?",
    sentByTrainer: true,
  },
  {
    uuid: "123e4567-e89b-12d3-a456-426655440007",
    text: "Maybe later",
    sentByTrainer: false,
  },
  {
    uuid: "123e4567-e89b-12d3-a456-426655440008",
    text: "Okay, sounds good",
    sentByTrainer: true,
  },
  {
    uuid: "123e4567-e89b-12d3-a456-426655440009",
    text: "I'll talk to you later",
    sentByTrainer: false,
  },
  {
    uuid: "123e4567-e89b-12d3-a456-426655440010",
    text: "Later!",
    sentByTrainer: true,
  },
  {
    uuid: "123e4567-e89b-12d3-a456-426655440011",
    text: "Hey, what's up?",
    sentByTrainer: false,
  },
  {
    uuid: "123e4567-e89b-12d3-a456-426655440012",
    text: "Not much, just got back from a run",
    sentByTrainer: true,
  },
  {
    uuid: "123e4567-e89b-12d3-a456-426655440013",
    text: "Nice! How was it?",
    sentByTrainer: false,
  },
  {
    uuid: "123e4567-e89b-12d3-a456-426655440014",
    text: "It was good, I needed the exercise",
    sentByTrainer: true,
  },
  {
    uuid: "123e4567-e89b-12d3-a456-426655440015",
    text: "Yeah, exercise is important",
    sentByTrainer: false,
  },
  {
    uuid: "123e4567-e89b-12d3-a456-426655440016",
    text: "Definitely, I feel more energized now",
    sentByTrainer: true,
  },
  {
    uuid: "123e4567-e89b-12d3-a456-426655440017",
    text: "That's great to hear",
    sentByTrainer: false,
  },
  {
    uuid: "123e4567-e89b-12d3-a456-426655440018",
    text: "Yeah, I'm feeling good",
    sentByTrainer: true,
  },
  {
    uuid: "123e4567-e89b-12d3-a456-426655440019",
    text: "I'm glad to hear that",
    sentByTrainer: false,
  },
  {
    uuid: "126e4567-e89b-12d3-a456-426655440019",
    text: "I'm glad to hear that",
    sentByTrainer: false,
  },
];

export const SAMPLE_EXERCISES: exercise[] = [
  {
    uuid: "ex1-2a3b-4c5d-6e7f-8g9h",
    name: "Barbell Squat",
    type: "barbell",
    bodyPart: "legs",
    description:
      "Classic compound movement targeting quadriceps, hamstrings, and glutes",
  },
  {
    uuid: "ex2-3b4c-5d6e-7f8g-9h1i",
    name: "Bench Press",
    type: "barbell",
    bodyPart: "chest",
    description:
      "Horizontal pressing movement for chest, shoulders, and triceps",
  },
  {
    uuid: "ex3-4c5d-6e7f-8g9h-1i2j",
    name: "Running (Threadmill)",
    type: "cardio",
    bodyPart: "legs",
    description: "Compound pulling movement for back thickness",
  },
  {
    uuid: "ex4-5d6e-7f8g-9h1i-2j3k",
    name: "Overhead Press",
    type: "barbell",
    bodyPart: "shoulders",
    description: "Vertical pressing movement for shoulder development",
  },
  {
    uuid: "ex5-6e7f-8g9h-1i2j-3k4l",
    name: "Deadlift",
    type: "barbell",
    bodyPart: "back",
    description: "Compound posterior chain exercise",
  },
  {
    uuid: "ex6-7f8g-9h1i-2j3k-4l5m",
    name: "Dumbbell Chest Press",
    type: "dumbell",
    bodyPart: "chest",
    description: "Horizontal pressing with independent arm movement",
  },
  {
    uuid: "ex7-8g9h-1i2j-3k4l-5m6n",
    name: "Dumbbell Shoulder Press",
    type: "dumbell",
    bodyPart: "shoulders",
    description: "Vertical pressing with dumbbells for shoulder strength",
  },
  {
    uuid: "ex8-9h1i-2j3k-4l5m-6n7o",
    name: "Dumbbell Lateral Raise",
    type: "dumbell",
    bodyPart: "shoulders",
    description: "Isolation exercise for lateral deltoids",
  },
  {
    uuid: "ex9-1i2j-3k4l-5m6n-7o8p",
    name: "Dumbbell Bicep Curl",
    type: "dumbell",
    bodyPart: "arms",
    description: "Isolation exercise for biceps",
  },
  {
    uuid: "ex10-2j3k-4l5m-6n7o-8p9q",
    name: "Romanian Deadlift",
    type: "barbell",
    bodyPart: "legs",
    description: "Hip hinge movement targeting hamstrings and glutes",
  },
  {
    uuid: "ex11-3k4l-5m6n-7o8p-9q1r",
    name: "Pull-Ups",
    type: "bodyweight",
    bodyPart: "back",
    description: "Vertical pulling movement using bodyweight",
  },
  {
    uuid: "ex12-4l5m-6n7o-8p9q-1r2s",
    name: "Push-Ups",
    type: "bodyweight",
    bodyPart: "chest",
    description: "Horizontal pushing movement using bodyweight",
  },
  {
    uuid: "ex13-5m6n-7o8p-9q1r-2s3t",
    name: "Lunges",
    type: "bodyweight",
    bodyPart: "legs",
    description: "Unilateral lower body exercise",
  },
  {
    uuid: "ex14-6n7o-8p9q-1r2s-3t4u",
    name: "Plank",
    type: "bodyweight",
    bodyPart: "core",
    description: "Isometric core strengthening exercise",
  },
  {
    uuid: "ex15-7o8p-9q1r-2s3t-4u5v",
    name: "Leg Press",
    type: "machine",
    bodyPart: "legs",
    description: "Machine-based leg pressing movement",
  },
  {
    uuid: "ex16-8p9q-1r2s-3t4u-5v6w",
    name: "Lat Pulldown",
    type: "machine",
    bodyPart: "back",
    description: "Vertical pulling movement on a machine",
  },
  {
    uuid: "ex17-9q1r-2s3t-4u5v-6w7x",
    name: "Chest Fly Machine",
    type: "machine",
    bodyPart: "chest",
    description: "Isolation exercise for chest",
  },
  {
    uuid: "ex18-1r2s-3t4u-5v6w-7x8y",
    name: "Leg Extension",
    type: "machine",
    bodyPart: "legs",
    description: "Isolation exercise for quadriceps",
  },
  {
    uuid: "ex19-2s3t-4u5v-6w7x-8y9z",
    name: "Leg Curl",
    type: "machine",
    bodyPart: "legs",
    description: "Isolation exercise for hamstrings",
  },
  {
    uuid: "ex20-3t4u-5v6w-7x8y-9z1a",
    name: "Cable Tricep Pushdown",
    type: "machine",
    bodyPart: "arms",
    description: "Isolation exercise for triceps using cable machine",
  },
  {
    uuid: "ex21-4u5v-6w7x-8y9z-1a2b",
    name: "Cable Bicep Curl",
    type: "machine",
    bodyPart: "arms",
    description: "Isolation exercise for biceps using cable machine",
  },
  {
    uuid: "ex22-5v6w-7x8y-9z1a-2b3c",
    name: "Assisted Pull-Up",
    type: "assisted-bodyweight",
    bodyPart: "back",
    description:
      "Vertical pulling with assistance for those unable to do full pull-ups",
  },
  {
    uuid: "ex23-6w7x-8y9z-1a2b-3c4d",
    name: "Assisted Dip",
    type: "assisted-bodyweight",
    bodyPart: "chest",
    description:
      "Pushing exercise with assistance for those unable to do full dips",
  },
  {
    uuid: "ex24-7x8y-9z1a-2b3c-4d5e",
    name: "Kettlebell Swing",
    type: "other",
    bodyPart: "full-body",
    description: "Dynamic hip hinge movement with kettlebell",
  },
  {
    uuid: "ex25-8y9z-1a2b-3c4d-5e6f",
    name: "Battle Ropes",
    type: "other",
    bodyPart: "full-body",
    description: "High-intensity exercise using heavy ropes",
  },
  {
    uuid: "ex26-9z1a-2b3c-4d5e-6f7g",
    name: "Box Jumps",
    type: "bodyweight",
    bodyPart: "legs",
    description: "Explosive plyometric exercise",
  },
  {
    uuid: "ex27-1a2b-3c4d-5e6f-7g8h",
    name: "Treadmill Run",
    type: "cardio",
    bodyPart: "cardio",
    description: "Running on a treadmill at various speeds and inclines",
  },
  {
    uuid: "ex28-2b3c-4d5e-6f7g-8h9i",
    name: "Cycling",
    type: "cardio",
    bodyPart: "cardio",
    description: "Cycling on a stationary bike",
  },
  {
    uuid: "ex29-3c4d-5e6f-7g8h-9i1j",
    name: "Rowing",
    type: "cardio",
    bodyPart: "full-body",
    description: "Full-body cardio exercise on a rowing machine",
  },
  {
    uuid: "ex30-4d5e-6f7g-8h9i-1j2k",
    name: "Elliptical",
    type: "cardio",
    bodyPart: "cardio",
    description: "Low-impact cardio on an elliptical machine",
  },
  {
    uuid: "ex31-5e6f-7g8h-9i1j-2k3l",
    name: "Russian Twists",
    type: "bodyweight",
    bodyPart: "core",
    description: "Rotational core exercise",
  },
  {
    uuid: "ex32-6f7g-8h9i-1j2k-3l4m",
    name: "Crunches",
    type: "bodyweight",
    bodyPart: "core",
    description: "Basic abdominal flexion exercise",
  },
  {
    uuid: "ex33-7g8h-9i1j-2k3l-4m5n",
    name: "Mountain Climbers",
    type: "bodyweight",
    bodyPart: "full-body",
    description: "Dynamic core and cardio exercise",
  },
  {
    uuid: "ex34-8h9i-1j2k-3l4m-5n6o",
    name: "Burpees",
    type: "bodyweight",
    bodyPart: "full-body",
    description: "High-intensity full body exercise",
  },
  {
    uuid: "ex35-9i1j-2k3l-4m5n-6o7p",
    name: "Clean and Jerk",
    type: "barbell",
    bodyPart: "olympic",
    description: "Olympic weightlifting movement",
  },
  {
    uuid: "ex36-1j2k-3l4m-5n6o-7p8q",
    name: "Snatch",
    type: "barbell",
    bodyPart: "olympic",
    description: "Technical Olympic weightlifting movement",
  },
  {
    uuid: "ex37-2k3l-4m5n-6o7p-8q9r",
    name: "Front Squat",
    type: "barbell",
    bodyPart: "legs",
    description: "Barbell squat with front rack position",
  },
  {
    uuid: "ex38-3l4m-5n6o-7p8q-9r1s",
    name: "Hip Thrust",
    type: "barbell",
    bodyPart: "legs",
    description: "Glute-focused horizontal hip extension",
  },
  {
    uuid: "ex39-4m5n-6o7p-8q9r-1s2t",
    name: "Face Pull",
    type: "machine",
    bodyPart: "shoulders",
    description: "Rear deltoid and rotator cuff exercise using cables",
  },
  {
    uuid: "ex40-5n6o-7p8q-9r1s-2t3u",
    name: "Dumbbell Row",
    type: "dumbell",
    bodyPart: "back",
    description: "Unilateral back exercise with dumbbell",
  },
  {
    uuid: "ex41-6o7p-8q9r-1s2t-3u4v",
    name: "Dumbbell Lunges",
    type: "dumbell",
    bodyPart: "legs",
    description: "Weighted unilateral leg exercise",
  },
  {
    uuid: "ex42-7p8q-9r1s-2t3u-4v5w",
    name: "Hanging Leg Raise",
    type: "bodyweight",
    bodyPart: "core",
    description: "Advanced core exercise hanging from a bar",
  },
  {
    uuid: "ex43-8q9r-1s2t-3u4v-5w6x",
    name: "Step-Ups",
    type: "dumbell",
    bodyPart: "legs",
    description: "Unilateral leg exercise using a box or bench",
  },
  {
    uuid: "ex44-9r1s-2t3u-4v5w-6x7y",
    name: "Dumbbell Fly",
    type: "dumbell",
    bodyPart: "chest",
    description: "Isolation exercise for chest with dumbbells",
  },
  {
    uuid: "ex45-1s2t-3u4v-5w6x-7y8z",
    name: "Cable Woodchop",
    type: "machine",
    bodyPart: "core",
    description: "Rotational core exercise using cable machine",
  },
  {
    uuid: "ex46-2t3u-4v5w-6x7y-8z9a",
    name: "Reverse Hyper",
    type: "machine",
    bodyPart: "back",
    description: "Posterior chain exercise focusing on lower back",
  },
  {
    uuid: "ex47-3u4v-5w6x-7y8z-9a1b",
    name: "Jump Rope",
    type: "cardio",
    bodyPart: "cardio",
    description: "Coordination and cardio exercise using a rope",
  },
  {
    uuid: "ex48-4v5w-6x7y-8z9a-1b2c",
    name: "Hammer Curl",
    type: "dumbell",
    bodyPart: "arms",
    description: "Bicep and brachialis exercise with neutral grip",
  },
  {
    uuid: "ex49-5w6x-7y8z-9a1b-2c3d",
    name: "Skull Crushers",
    type: "barbell",
    bodyPart: "arms",
    description: "Lying tricep extension exercise",
  },
  {
    uuid: "ex50-6x7y-8z9a-1b2c-3d4e",
    name: "Glute Bridge",
    type: "bodyweight",
    bodyPart: "legs",
    description: "Hip extension exercise targeting glutes",
  },
];

export const SAMPLE_GYMS: gym[] = [
  {
    uuid: "1",
    name: "City Fitness Center",
    address: "123 Main Street, Cityville",
  },
  {
    uuid: "2",
    name: "Mountain Gym",
    address: "456 Alpine Rd, Mountainview",
  },
  {
    uuid: "3",
    name: "Beachside Fitness Hub",
    address: "789 Ocean Blvd, Beachtown",
  },
  {
    uuid: "4",
    name: "Downtown Workout",
    address: "321 Central Plaza, Metropolis",
  },
  {
    uuid: "5",
    name: "Urban Bootcamp",
    address: "654 Park Ave, Urbania",
  },
  {
    uuid: "6",
    name: "Suburban Gym",
    address: "987 Suburb St, Suburbia",
  },
  {
    uuid: "7",
    name: "Riverside Fitness",
    address: "135 River Rd, Riverside",
  },
  {
    uuid: "8",
    name: "Lakeside Gym",
    address: "246 Lake Lane, Lakeview",
  },
  {
    uuid: "9",
    name: "Valley Strength",
    address: "357 Valley Blvd, Valley City",
  },
  {
    uuid: "10",
    name: "Highland Workout",
    address: "468 Highland Dr, Highville",
  },
  {
    uuid: "11",
    name: "Prestige Fitness",
    address: "579 Prestige Pkwy, Uptown",
  },
  {
    uuid: "12",
    name: "Prime Bodyworks",
    address: "680 Prime St, Bodytown",
  },
  {
    uuid: "13",
    name: "Revamp Fitness",
    address: "791 Revamp Ave, Fitnessville",
  },
  {
    uuid: "14",
    name: "Peak Performance Gym",
    address: "802 Summit Rd, Peak City",
  },
  {
    uuid: "15",
    name: "Infinity Fitness",
    address: "913 Infinity Blvd, Looptown",
  },
  {
    uuid: "16",
    name: "Momentum Gym",
    address: "124 Momentum Way, Fasttown",
  },
  {
    uuid: "17",
    name: "Dynamic Fitness",
    address: "235 Dynamic Ave, Power City",
  },
  {
    uuid: "18",
    name: "Core Strength Club",
    address: "346 Core Rd, Vitality",
  },
  {
    uuid: "19",
    name: "Elite Workout",
    address: "457 Elite St, Champ City",
  },
  {
    uuid: "20",
    name: "Ultimate Gym",
    address: "568 Ultimate Blvd, Victory",
  },
];

export const SAMPLE_TRAINERS: trainer[] = [
  {
    username: "trainer1",
    name: "John Doe",
    description: "A beginner trainer with a passion for Pokémon.",
  },
  {
    username: "trainer2",
    name: "Jane Doe",
    description: "An experienced trainer with a team of powerful Pokémon.",
  },
  {
    username: "trainer3",
    name: "Bob Smith",
    description: "A young trainer with a dream to become a Pokémon Master.",
  },
  {
    username: "trainer4",
    name: "Alice Johnson",
    description: "A skilled trainer with a talent for battling.",
  },
  {
    username: "trainer5",
    name: "Mike Brown",
    description: "A dedicated trainer with a love for Pokémon.",
  },
  {
    username: "trainer6",
    name: "Emily Davis",
    description: "A beginner trainer with a passion for Pokémon.",
  },
  {
    username: "trainer7",
    name: "David Lee",
    description: "An experienced trainer with a team of powerful Pokémon.",
  },
  {
    username: "trainer8",
    name: "Sarah Taylor",
    description: "A young trainer with a dream to become a Pokémon Master.",
  },
  {
    username: "trainer9",
    name: "Kevin White",
    description: "A skilled trainer with a talent for battling.",
  },
  {
    username: "trainer10",
    name: "Rebecca Martin",
    description: "A dedicated trainer with a love for Pokémon.",
  },
  {
    username: "trainer11",
    name: "James Wilson",
    description: "A beginner trainer with a passion for Pokémon.",
  },
  {
    username: "trainer12",
    name: "Jessica Thompson",
    description: "An experienced trainer with a team of powerful Pokémon.",
  },
  {
    username: "trainer13",
    name: "William Harris",
    description: "A young trainer with a dream to become a Pokémon Master.",
  },
  {
    username: "trainer14",
    name: "Amanda Garcia",
    description: "A skilled trainer with a talent for battling.",
  },
  {
    username: "trainer15",
    name: "Matthew Rodriguez",
    description: "A dedicated trainer with a love for Pokémon.",
  },
  {
    username: "trainer16",
    name: "Heather Lopez",
    description: "A beginner trainer with a passion for Pokémon.",
  },
  {
    username: "trainer17",
    name: "Brian Hall",
    description: "An experienced trainer with a team of powerful Pokémon.",
  },
  {
    username: "trainer18",
    name: "Nicole Brooks",
    description: "A young trainer with a dream to become a Pokémon Master.",
  },
  {
    username: "trainer19",
    name: "Daniel Jenkins",
    description: "A skilled trainer with a talent for battling.",
  },
  {
    username: "trainer20",
    name: "Lisa Nguyen",
    description: "A dedicated trainer with a love for Pokémon.",
  },
  {
    username: "trainer21",
    name: "Michael Sanders",
    description: "A beginner trainer with a passion for Pokémon.",
  },
  {
    username: "trainer22",
    name: "Elizabeth Russell",
    description: "An experienced trainer with a team of powerful Pokémon.",
  },
  {
    username: "trainer23",
    name: "Christopher Reynolds",
    description: "A young trainer with a dream to become a Pokémon Master.",
  },
  {
    username: "trainer24",
    name: "Katherine Foster",
    description: "A skilled trainer with a talent for battling.",
  },
  {
    username: "trainer25",
    name: "Anthony Cooper",
    description: "A dedicated trainer with a love for Pokémon.",
  },
  {
    username: "trainer26",
    name: "Samantha Peterson",
    description: "A beginner trainer with a passion for Pokémon.",
  },
  {
    username: "trainer27",
    name: "Andrew Jackson",
    description: "An experienced trainer with a team of powerful Pokémon.",
  },
  {
    username: "trainer28",
    name: "Melissa Sanchez",
    description: "A young trainer with a dream to become a Pokémon Master.",
  },
  {
    username: "trainer29",
    name: "Joshua Price",
    description: "A skilled trainer with a talent for battling.",
  },
  {
    username: "trainer30",
    name: "Lauren Lewis",
    description: "A dedicated trainer with a love for Pokémon.",
  },
];
