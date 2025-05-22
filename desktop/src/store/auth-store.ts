import { create } from "zustand";
import { api, createApiClient } from "../lib/apiClient";

// Store de Zustand per desar l'informació d'autenticació amb el backend

type AuthStoreType = {
  serverIp: string;
  serverName: string;
  apiClient: typeof api;
  setServerIp: (serverIp: string, serverName: string) => void;

  username: string;
  setUsername: (username: string) => void;

  token: string | null;
  setToken: (token: string | null) => void;
};

export const useAuthStore = create<AuthStoreType>((set) => ({
  serverIp: "https://ultra.jplanelles.cat", // URL del servidor predeterminada
  serverName: "Ultra Server", // Nom del servidor predeterminat
  apiClient: api, // Objecte apiClient
  // Canvia la URL del servidor
  setServerIp: (serverIp: string, serverName: string) =>
    set({
      serverIp: serverIp,
      serverName: serverName,
      apiClient: createApiClient(serverIp), // Torna a crear l'apiClient
    }),
  username: "", // Nom d'usuari de l'usuari actual
  setUsername: (username: string) => set({ username: username }),
  token: null, // Token JWT
  setToken: (token: string | null) => set({ token: token }),
}));