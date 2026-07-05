import { create } from 'zustand';

interface AppState {
  counter: number;
  increment: () => void;
  decrement: () => void;
  user: { name: string; isLoggedIn: boolean } | null;
  login: (name: string) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  counter: 0,
  increment: () => set((state) => ({ counter: state.counter + 1 })),
  decrement: () => set((state) => ({ counter: state.counter - 1 })),
  user: null,
  login: (name) => set({ user: { name, isLoggedIn: true } }),
  logout: () => set({ user: null }),
}));
