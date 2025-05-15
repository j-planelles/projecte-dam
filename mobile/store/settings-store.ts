import { create } from "zustand";

type SettingsStoreType = {
  enableLastSet: boolean;
  setEnableLastLest(enableLastSet: boolean): void;
};

export const useSettingsStore = create<SettingsStoreType>((set) => ({
  enableLastSet: true,
  setEnableLastLest: (enableLastSet: boolean) =>
    set({ enableLastSet: enableLastSet }),
}));
