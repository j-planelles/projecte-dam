import { create } from "zustand";
import { api, createApiClient } from "../lib/apiClient";

type AuthStoreType = {
  serverIp: string;
  serverName: string;
  apiClient: typeof api;
  setServerIp: (serverIp: string, serverName: string) => void;

  username: string;
  setUsername: (username: string) => void;
  passwordHash: string;
  setPasswordHash: (passwordHash: string) => void;
  hashPassword: (password: string) => void;

  token: string | null;
  setToken: (token: string | null) => void;

  connectionTested: boolean;
  setConnectionTest: (result: boolean) => void;
};

export const useAuthStore = create<AuthStoreType>((set) => ({
  serverIp: "http://192.168.96.234:8002",
  serverName: "Ultra Server",
  apiClient: api,
  setServerIp: (serverIp: string, serverName: string) =>
    set({
      serverIp: serverIp,
      serverName: serverName,
      apiClient: createApiClient(serverIp),
    }),
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
  connectionTested: false,
  setConnectionTest: (result: boolean) => set({ connectionTested: result }),
}));
