import { create } from "zustand";

type UserRegistrationStoreType = {
	name: string;
	setName: (name: string) => void;
	biography: string;
	setBiography: (biography: string) => void;
	usualGymID: number | null;
	setUsualGymID: (usualGymID: number | null) => void;
	likes: number[];
	addLike: (like: number) => void;
	removeLike: (like: number) => void;
};

export const useUserRegistrationStore = create<UserRegistrationStoreType>(
	(set) => ({
		name: "",
		setName: (name: string) => set({ name }),
		biography: "",
		setBiography: (biography: string) => set({ biography }),
		usualGymID: null,
		setUsualGymID: (usualGymID: number | null) => set({ usualGymID }),
		likes: [],
		addLike: (like: number) =>
			set((state) => ({ likes: [...state.likes, like] })),
		removeLike: (like: number) =>
			set((state) => ({ likes: state.likes.filter((id) => id !== like) })),
	}),
);
