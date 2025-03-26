import { create } from "zustand";

export const useAuthStore = create((set) => ({
  player: null,
  setPlayer: (player) => set({ player }),
  logout: () => set({ player: null }),
}));
