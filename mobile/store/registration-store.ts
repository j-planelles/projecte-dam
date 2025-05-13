import { create } from "zustand";

type UserRegistrationStoreType = {
  usualGymID: number | null;
  setUsualGymID: (usualGymID: number | null) => void;
};

export const useUserRegistrationStore = create<UserRegistrationStoreType>(
  (set) => ({
    usualGymID: null,
    setUsualGymID: (usualGymID: number | null) => set({ usualGymID }),
  }),
);
