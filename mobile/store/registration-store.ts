import { create } from "zustand";

type UserRegistrationStoreType = {
	usualGymID: number | null;
	setUsualGymID: (usualGymID: number | null) => void;
	likes: number[];
	addLike: (like: number) => void;
	removeLike: (like: number) => void;
};

export const useUserRegistrationStore = create<UserRegistrationStoreType>(
	(set) => ({
		usualGymID: null,
		setUsualGymID: (usualGymID: number | null) => set({ usualGymID }),
		likes: [],
		addLike: (like: number) =>
			set((state) => ({ likes: [...state.likes, like] })),
		removeLike: (like: number) =>
			set((state) => ({ likes: state.likes.filter((id) => id !== like) })),
	}),
);
