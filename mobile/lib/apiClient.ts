import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const Body_Get_OAuth2_token_auth_token_post = z
  .object({
    grant_type: z.union([z.string(), z.null()]).optional(),
    username: z.string(),
    password: z.string(),
    scope: z.string().optional().default(""),
    client_id: z.union([z.string(), z.null()]).optional(),
    client_secret: z.union([z.string(), z.null()]).optional(),
  })
  .passthrough();
const Token = z
  .object({ access_token: z.string(), token_type: z.string() })
  .passthrough();
const ValidationError = z
  .object({
    loc: z.array(z.union([z.string(), z.number()])),
    msg: z.string(),
    type: z.string(),
  })
  .passthrough();
const HTTPValidationError = z
  .object({ detail: z.array(ValidationError) })
  .partial()
  .passthrough();
const UserInfoSchema = z
  .object({
    uuid: z.string().uuid(),
    username: z.string(),
    full_name: z.string(),
    biography: z.string(),
    is_trainer: z.boolean().optional().default(false),
  })
  .passthrough();
const UserInputSchema = z
  .object({
    username: z.union([z.string(), z.null()]),
    full_name: z.union([z.string(), z.null()]),
    biography: z.union([z.string(), z.null()]),
  })
  .partial()
  .passthrough();
const UserSchema = z
  .object({
    uuid: z.string().uuid(),
    username: z.string(),
    full_name: z.string(),
    biography: z.string(),
  })
  .passthrough();
const BodyPart = z.enum([
  "none",
  "arms",
  "back",
  "shoulders",
  "cardio",
  "chest",
  "core",
  "full-body",
  "legs",
  "olympic",
  "other",
]);
const ExerciseType = z.enum([
  "barbell",
  "dumbell",
  "machine",
  "other",
  "bodyweight",
  "assisted-bodyweight",
  "reps-only",
  "cardio",
  "duration",
  "countdown",
]);
const DefaultExerciseModel = z
  .object({
    name: z.string(),
    description: z.union([z.string(), z.null()]).optional(),
    uuid: z.string().uuid(),
    body_part: BodyPart,
    type: ExerciseType,
  })
  .passthrough();
const ExerciseModel = z
  .object({
    name: z.string(),
    description: z.union([z.string(), z.null()]).optional(),
    uuid: z.string().uuid(),
    user_note: z.union([z.string(), z.null()]).optional(),
    is_disabled: z.boolean().optional().default(false),
    default_exercise_uuid: z.union([z.string(), z.null()]).optional(),
    body_part: BodyPart,
    type: ExerciseType,
    creator_uuid: z.string().uuid(),
  })
  .passthrough();
const ExerciseSchema = z
  .object({
    name: z.string(),
    description: z.union([z.string(), z.null()]).optional(),
    uuid: z.string().uuid(),
    user_note: z.union([z.string(), z.null()]).optional(),
    is_disabled: z.boolean().optional().default(false),
    default_exercise_uuid: z.union([z.string(), z.null()]).optional(),
    body_part: BodyPart,
    type: ExerciseType,
  })
  .passthrough();
const WorkoutInstanceSchema = z
  .object({ timestamp_start: z.number().int(), duration: z.number().int() })
  .passthrough();
const WeightUnit = z.enum(["metric", "imperial"]);
const ExerciseInputSchema = z
  .object({
    uuid: z.union([z.string(), z.null()]).optional(),
    user_note: z.union([z.string(), z.null()]).optional(),
    name: z.string(),
    description: z.union([z.string(), z.null()]).optional(),
    body_part: BodyPart,
    type: ExerciseType,
    default_exercise_uuid: z.union([z.string(), z.null()]).optional(),
  })
  .passthrough();
const SetType = z.enum(["normal", "dropset", "failture"]);
const WorkoutSetSchema = z
  .object({
    reps: z.union([z.number(), z.null()]).optional(),
    weight: z.number(),
    set_type: SetType,
  })
  .passthrough();
const WorkoutEntrySchema_Output = z
  .object({
    rest_countdown_duration: z.union([z.number(), z.null()]).optional(),
    note: z.union([z.string(), z.null()]).optional(),
    weight_unit: z.union([WeightUnit, z.null()]).optional(),
    exercise: ExerciseInputSchema,
    sets: z.array(WorkoutSetSchema),
  })
  .passthrough();
const GymSchema = z
  .object({
    uuid: z.string().uuid(),
    name: z.string(),
    description: z.string(),
    address: z.string(),
  })
  .passthrough();
const WorkoutContentSchema_Output = z
  .object({
    uuid: z.union([z.string(), z.null()]).optional(),
    name: z.string(),
    description: z.union([z.string(), z.null()]).optional(),
    isPublic: z.boolean().optional().default(false),
    instance: z.union([WorkoutInstanceSchema, z.null()]).optional(),
    entries: z.array(WorkoutEntrySchema_Output),
    gym_id: z.union([z.string(), z.null()]).optional(),
    gym: z.union([GymSchema, z.null()]).optional(),
  })
  .passthrough();
const WorkoutEntrySchema_Input = z
  .object({
    rest_countdown_duration: z.union([z.number(), z.null()]).optional(),
    note: z.union([z.string(), z.null()]).optional(),
    weight_unit: z.union([WeightUnit, z.null()]).optional(),
    exercise: ExerciseInputSchema,
    sets: z.array(WorkoutSetSchema),
  })
  .passthrough();
const WorkoutContentSchema_Input = z
  .object({
    uuid: z.union([z.string(), z.null()]).optional(),
    name: z.string(),
    description: z.union([z.string(), z.null()]).optional(),
    isPublic: z.boolean().optional().default(false),
    instance: z.union([WorkoutInstanceSchema, z.null()]).optional(),
    entries: z.array(WorkoutEntrySchema_Input),
    gym_id: z.union([z.string(), z.null()]).optional(),
    gym: z.union([GymSchema, z.null()]).optional(),
  })
  .passthrough();
const WorkoutTemplateSchema = z
  .object({
    uuid: z.union([z.string(), z.null()]).optional(),
    name: z.string(),
    description: z.union([z.string(), z.null()]).optional(),
    isPublic: z.boolean().optional().default(false),
    instance: z.null().optional(),
    entries: z.array(WorkoutEntrySchema_Input),
    gym_id: z.union([z.string(), z.null()]).optional(),
    gym: z.union([GymSchema, z.null()]).optional(),
  })
  .passthrough();
const UserModel = z
  .object({
    uuid: z.string().uuid(),
    username: z.string().optional().default(""),
    full_name: z.string().optional().default(""),
    biography: z.union([z.string(), z.null()]).optional(),
    trainer_uuid: z.union([z.string(), z.null()]).optional(),
  })
  .passthrough();
const TrainerModel = z.object({ user_uuid: z.string().uuid() }).passthrough();
const TrainerRequestSchema = z
  .object({
    user: UserModel,
    trainer: TrainerModel,
    is_processed: z.boolean().optional().default(false),
    created_at: z.number().int(),
  })
  .passthrough();
const HealthCheck = z.object({ name: z.string() }).passthrough();

export const schemas = {
  Body_Get_OAuth2_token_auth_token_post,
  Token,
  ValidationError,
  HTTPValidationError,
  UserInfoSchema,
  UserInputSchema,
  UserSchema,
  BodyPart,
  ExerciseType,
  DefaultExerciseModel,
  ExerciseModel,
  ExerciseSchema,
  WorkoutInstanceSchema,
  WeightUnit,
  ExerciseInputSchema,
  SetType,
  WorkoutSetSchema,
  WorkoutEntrySchema_Output,
  GymSchema,
  WorkoutContentSchema_Output,
  WorkoutEntrySchema_Input,
  WorkoutContentSchema_Input,
  WorkoutTemplateSchema,
  UserModel,
  TrainerModel,
  TrainerRequestSchema,
  HealthCheck,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/",
    alias: "health_check__get",
    description: `Health check`,
    requestFormat: "json",
    response: z.object({ name: z.string() }).passthrough(),
  },
  {
    method: "post",
    path: "/auth/disable",
    alias: "Disable_a_user_account_auth_disable_post",
    requestFormat: "json",
    response: z.unknown(),
  },
  {
    method: "get",
    path: "/auth/profile",
    alias: "Get_current_user_data_auth_profile_get",
    requestFormat: "json",
    response: UserInfoSchema,
  },
  {
    method: "post",
    path: "/auth/profile",
    alias: "Update_user_profile_data_auth_profile_post",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: UserInputSchema,
      },
    ],
    response: UserSchema,
    errors: [
      {
        status: 422,
        description: `Validation Error`,
        schema: HTTPValidationError,
      },
    ],
  },
  {
    method: "get",
    path: "/auth/publickey",
    alias: "Get_public_key_auth_publickey_get",
    requestFormat: "json",
    response: z.string(),
  },
  {
    method: "post",
    path: "/auth/register",
    alias: "Create_a_user_auth_register_post",
    requestFormat: "json",
    parameters: [
      {
        name: "username",
        type: "Query",
        schema: z.string(),
      },
      {
        name: "password",
        type: "Query",
        schema: z.string(),
      },
    ],
    response: z.unknown(),
    errors: [
      {
        status: 422,
        description: `Validation Error`,
        schema: HTTPValidationError,
      },
    ],
  },
  {
    method: "post",
    path: "/auth/register/trainer",
    alias: "Register_as_a_trainer_auth_register_trainer_post",
    requestFormat: "json",
    response: z.unknown(),
  },
  {
    method: "post",
    path: "/auth/token",
    alias: "Get_OAuth2_token_auth_token_post",
    requestFormat: "form-url",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Body_Get_OAuth2_token_auth_token_post,
      },
    ],
    response: Token,
    errors: [
      {
        status: 422,
        description: `Validation Error`,
        schema: HTTPValidationError,
      },
    ],
  },
  {
    method: "get",
    path: "/default-exercises",
    alias: "Get_default_exercises_default_exercises_get",
    requestFormat: "json",
    response: z.array(DefaultExerciseModel),
  },
  {
    method: "get",
    path: "/default-exercises/:exercise_uuid",
    alias: "Get_default_exercise_default_exercises__exercise_uuid__get",
    requestFormat: "json",
    parameters: [
      {
        name: "exercise_uuid",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: DefaultExerciseModel,
    errors: [
      {
        status: 422,
        description: `Validation Error`,
        schema: HTTPValidationError,
      },
    ],
  },
  {
    method: "get",
    path: "/trainer/requests",
    alias: "Get_requests_trainer_requests_get",
    requestFormat: "json",
    response: z.array(TrainerRequestSchema),
  },
  {
    method: "post",
    path: "/trainer/requests/:user_uuid",
    alias: "Handle_request_trainer_requests__user_uuid__post",
    requestFormat: "json",
    parameters: [
      {
        name: "user_uuid",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "action",
        type: "Query",
        schema: z.enum(["accept", "deny"]),
      },
    ],
    response: z.unknown(),
    errors: [
      {
        status: 422,
        description: `Validation Error`,
        schema: HTTPValidationError,
      },
    ],
  },
  {
    method: "get",
    path: "/trainer/users",
    alias: "Get_paired_users_trainer_users_get",
    requestFormat: "json",
    response: z.array(UserSchema),
  },
  {
    method: "get",
    path: "/trainer/users/:user_uuid/info",
    alias: "Get_paired_users_trainer_users__user_uuid__info_get",
    requestFormat: "json",
    parameters: [
      {
        name: "user_uuid",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: UserSchema,
    errors: [
      {
        status: 422,
        description: `Validation Error`,
        schema: HTTPValidationError,
      },
    ],
  },
  {
    method: "get",
    path: "/trainer/users/:user_uuid/recommendation",
    alias:
      "Get_assigned_recommendations_trainer_users__user_uuid__recommendation_get",
    requestFormat: "json",
    parameters: [
      {
        name: "user_uuid",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.array(WorkoutContentSchema_Output),
    errors: [
      {
        status: 422,
        description: `Validation Error`,
        schema: HTTPValidationError,
      },
    ],
  },
  {
    method: "post",
    path: "/trainer/users/:user_uuid/recommendation",
    alias:
      "Create_recommendation_trainer_users__user_uuid__recommendation_post",
    requestFormat: "json",
    parameters: [
      {
        name: "user_uuid",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "workout_uuid",
        type: "Query",
        schema: z.string(),
      },
    ],
    response: z.unknown(),
    errors: [
      {
        status: 422,
        description: `Validation Error`,
        schema: HTTPValidationError,
      },
    ],
  },
  {
    method: "delete",
    path: "/trainer/users/:user_uuid/recommendation",
    alias:
      "Create_recommendation_trainer_users__user_uuid__recommendation_delete",
    requestFormat: "json",
    parameters: [
      {
        name: "user_uuid",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "workout_uuid",
        type: "Query",
        schema: z.string(),
      },
    ],
    response: z.unknown(),
    errors: [
      {
        status: 422,
        description: `Validation Error`,
        schema: HTTPValidationError,
      },
    ],
  },
  {
    method: "get",
    path: "/trainer/users/:user_uuid/templates",
    alias:
      "Get_unrecommended_templates_trainer_users__user_uuid__templates_get",
    requestFormat: "json",
    parameters: [
      {
        name: "user_uuid",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.array(WorkoutContentSchema_Output),
    errors: [
      {
        status: 422,
        description: `Validation Error`,
        schema: HTTPValidationError,
      },
    ],
  },
  {
    method: "post",
    path: "/trainer/users/:user_uuid/unpair",
    alias: "Unpair_with_user_trainer_users__user_uuid__unpair_post",
    requestFormat: "json",
    parameters: [
      {
        name: "user_uuid",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.unknown(),
    errors: [
      {
        status: 422,
        description: `Validation Error`,
        schema: HTTPValidationError,
      },
    ],
  },
  {
    method: "get",
    path: "/user/archived-exercises",
    alias: "Get_user_archived__disabled__exercises_user_archived_exercises_get",
    requestFormat: "json",
    response: z.array(ExerciseModel),
  },
  {
    method: "get",
    path: "/user/exercises",
    alias: "Get_user_enabled_exercises_user_exercises_get",
    requestFormat: "json",
    response: z.array(ExerciseModel),
  },
  {
    method: "post",
    path: "/user/exercises",
    alias: "Create_exercise_user_exercises_post",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: ExerciseSchema,
      },
    ],
    response: z.unknown(),
    errors: [
      {
        status: 422,
        description: `Validation Error`,
        schema: HTTPValidationError,
      },
    ],
  },
  {
    method: "get",
    path: "/user/exercises/:exercise_uuid",
    alias: "Get_exercise_user_exercises__exercise_uuid__get",
    requestFormat: "json",
    parameters: [
      {
        name: "exercise_uuid",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: ExerciseModel,
    errors: [
      {
        status: 422,
        description: `Validation Error`,
        schema: HTTPValidationError,
      },
    ],
  },
  {
    method: "put",
    path: "/user/exercises/:exercise_uuid",
    alias: "Update_exercise_user_exercises__exercise_uuid__put",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: ExerciseSchema,
      },
      {
        name: "exercise_uuid",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.unknown(),
    errors: [
      {
        status: 422,
        description: `Validation Error`,
        schema: HTTPValidationError,
      },
    ],
  },
  {
    method: "delete",
    path: "/user/exercises/:exercise_uuid",
    alias: "Delete_exercise_user_exercises__exercise_uuid__delete",
    requestFormat: "json",
    parameters: [
      {
        name: "exercise_uuid",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.unknown(),
    errors: [
      {
        status: 422,
        description: `Validation Error`,
        schema: HTTPValidationError,
      },
    ],
  },
  {
    method: "get",
    path: "/user/templates",
    alias: "Get_user_templates_user_templates_get",
    requestFormat: "json",
    response: z.array(WorkoutContentSchema_Output),
  },
  {
    method: "post",
    path: "/user/templates",
    alias: "Create_template_user_templates_post",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: WorkoutTemplateSchema,
      },
    ],
    response: WorkoutContentSchema_Output,
    errors: [
      {
        status: 422,
        description: `Validation Error`,
        schema: HTTPValidationError,
      },
    ],
  },
  {
    method: "get",
    path: "/user/templates/:template_uuid",
    alias: "Get_user_template_user_templates__template_uuid__get",
    requestFormat: "json",
    parameters: [
      {
        name: "template_uuid",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: WorkoutContentSchema_Output,
    errors: [
      {
        status: 422,
        description: `Validation Error`,
        schema: HTTPValidationError,
      },
    ],
  },
  {
    method: "delete",
    path: "/user/templates/:template_uuid",
    alias: "Delete_user_template_user_templates__template_uuid__delete",
    requestFormat: "json",
    parameters: [
      {
        name: "template_uuid",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.unknown(),
    errors: [
      {
        status: 422,
        description: `Validation Error`,
        schema: HTTPValidationError,
      },
    ],
  },
  {
    method: "put",
    path: "/user/templates/:template_uuid",
    alias: "Update_template_user_templates__template_uuid__put",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: WorkoutTemplateSchema,
      },
      {
        name: "template_uuid",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: WorkoutContentSchema_Output,
    errors: [
      {
        status: 422,
        description: `Validation Error`,
        schema: HTTPValidationError,
      },
    ],
  },
  {
    method: "post",
    path: "/user/trainer/cancel-request",
    alias: "Cancel_trainer_request_user_trainer_cancel_request_post",
    requestFormat: "json",
    response: z.unknown(),
  },
  {
    method: "get",
    path: "/user/trainer/info",
    alias: "Get_trainer_info_user_trainer_info_get",
    requestFormat: "json",
    response: UserModel,
  },
  {
    method: "get",
    path: "/user/trainer/recommendation",
    alias: "Get_recommendations_user_trainer_recommendation_get",
    requestFormat: "json",
    response: z.array(WorkoutContentSchema_Output),
  },
  {
    method: "get",
    path: "/user/trainer/recommendation/:workout_uuid",
    alias: "Get_recommendation_user_trainer_recommendation__workout_uuid__get",
    requestFormat: "json",
    parameters: [
      {
        name: "workout_uuid",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: WorkoutContentSchema_Output,
    errors: [
      {
        status: 422,
        description: `Validation Error`,
        schema: HTTPValidationError,
      },
    ],
  },
  {
    method: "post",
    path: "/user/trainer/request",
    alias: "Create_a_request_user_trainer_request_post",
    requestFormat: "json",
    parameters: [
      {
        name: "trainer_uuid",
        type: "Query",
        schema: z.string(),
      },
    ],
    response: z.unknown(),
    errors: [
      {
        status: 422,
        description: `Validation Error`,
        schema: HTTPValidationError,
      },
    ],
  },
  {
    method: "get",
    path: "/user/trainer/search",
    alias: "Search_for_trainers_user_trainer_search_get",
    requestFormat: "json",
    response: z.array(UserModel),
  },
  {
    method: "get",
    path: "/user/trainer/status",
    alias: "Get_request_status_user_trainer_status_get",
    requestFormat: "json",
    response: UserModel,
  },
  {
    method: "post",
    path: "/user/trainer/unpair",
    alias: "Unpair_with_trainer_user_trainer_unpair_post",
    requestFormat: "json",
    response: z.unknown(),
  },
  {
    method: "get",
    path: "/user/workouts",
    alias: "Get_user_workouts_user_workouts_get",
    requestFormat: "json",
    parameters: [
      {
        name: "offset",
        type: "Query",
        schema: z.number().int().optional().default(0),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().optional().default(25),
      },
    ],
    response: z.array(WorkoutContentSchema_Output),
    errors: [
      {
        status: 422,
        description: `Validation Error`,
        schema: HTTPValidationError,
      },
    ],
  },
  {
    method: "post",
    path: "/user/workouts",
    alias: "Add_user_workout_to_history_user_workouts_post",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: WorkoutContentSchema_Input,
      },
    ],
    response: z.unknown(),
    errors: [
      {
        status: 422,
        description: `Validation Error`,
        schema: HTTPValidationError,
      },
    ],
  },
  {
    method: "get",
    path: "/user/workouts/:workout_uuid",
    alias: "Get_user_workouts_user_workouts__workout_uuid__get",
    requestFormat: "json",
    parameters: [
      {
        name: "workout_uuid",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: WorkoutContentSchema_Output,
    errors: [
      {
        status: 422,
        description: `Validation Error`,
        schema: HTTPValidationError,
      },
    ],
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
