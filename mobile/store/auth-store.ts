import { create } from "zustand";
import { api, createApiClient } from "../lib/apiClient";

type AuthStoreType = {
  serverIp: string;
  serverName: string;
  apiClient: typeof api;
  setServerIp: (serverIp: string, serverName: string) => void;

  username: string;
  setUsername: (username: string) => void;

  token: string | null;
  setToken: (token: string | null) => void;

  connectionTested: boolean;
  setConnectionTest: (result: boolean) => void;
};

export const useAuthStore = create<AuthStoreType>((set) => ({
  serverIp: "https://ultra.jplanelles.cat",
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
  token: null,
  setToken: (token: string | null) => set({ token: token }),
  connectionTested: false,
  setConnectionTest: (result: boolean) => set({ connectionTested: result }),
}));
