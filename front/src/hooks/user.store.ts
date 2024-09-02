// src/stores/useUserStore.ts
import create from 'zustand';

interface UserState {
  user: any | null; // Defina um tipo mais específico conforme necessário
  setUser: (user: any) => typeof user; // Defina um tipo mais específico conforme necessário
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
