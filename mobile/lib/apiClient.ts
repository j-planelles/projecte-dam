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
const UserModel = z
	.object({
		username: z.string().optional().default(""),
		full_name: z.string().optional().default(""),
		biography: z.union([z.string(), z.null()]).optional(),
		uuid: z.string().uuid(),
		hashed_password: z.string(),
	})
	.passthrough();
const UserSchema = z
	.object({
		username: z.union([z.string(), z.null()]),
		full_name: z.union([z.string(), z.null()]),
		biography: z.union([z.string(), z.null()]),
	})
	.partial()
	.passthrough();
const HealthCheck = z
	.object({ name: z.string(), version: z.string() })
	.passthrough();

export const schemas = {
	Body_Get_OAuth2_token_auth_token_post,
	Token,
	ValidationError,
	HTTPValidationError,
	UserModel,
	UserSchema,
	HealthCheck,
};

const endpoints = makeApi([
	{
		method: "get",
		path: "/",
		alias: "health_check__get",
		description: `Health check`,
		requestFormat: "json",
		response: HealthCheck,
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
		response: UserModel,
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
				schema: UserSchema,
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
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
	return new Zodios(baseUrl, endpoints, options);
}
