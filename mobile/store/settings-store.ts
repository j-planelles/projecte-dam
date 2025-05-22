import { create } from "zustand";

// Store de Zustand per desar la configuració de l'aplicació

type SettingsStoreType = {
  enableLastSet: boolean;
  setEnableLastLest(enableLastSet: boolean): void;
};

export const useSettingsStore = create<SettingsStoreType>((set) => ({
  enableLastSet: true, // Habilitar botó per mostrar l'últim set a la pantalla d'entrenament.
  setEnableLastLest: (enableLastSet: boolean) =>
    set({ enableLastSet: enableLastSet }),
}));
