import { create } from "zustand";
import { api, createApiClient } from "../lib/apiClient";

type AuthStoreType = {
	serverIp: string;
	apiClient: typeof api;
	setServerIp: (serverIp: string) => void;

	username: string;
	setUsername: (username: string) => void;
	passwordHash: string;
	setPasswordHash: (passwordHash: string) => void;
	hashPassword: (password: string) => void;

	token: string | null;
	setToken: (token: string | null) => void;
};

export const useAuthStore = create<AuthStoreType>((set) => ({
	serverIp: "http://127.0.0.1:8002",
	apiClient: api,
	setServerIp: (serverIp: string) =>
		set({ serverIp: serverIp, apiClient: createApiClient(serverIp) }),
	username: "",
	setUsername: (username: string) => set({ username: username }),
	passwordHash: "",
	setPasswordHash: (passwordHash: string) =>
		set({ passwordHash: passwordHash }),
	hashPassword: (password: string) => {
		set({ passwordHash: password }); // TODO: Implement hashing
	},
	token: null,
	setToken: (token: string | null) => set({ token: token }),
}));
