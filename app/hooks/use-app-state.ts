import { create } from 'zustand';

interface AppState {
  currentUser: any; // Replace 'any' with your user type
  setCurrentUser: (user: any) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  // Add other global state properties as needed
}

export const useAppState = create<AppState>((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  isAuthenticated: false,
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  // Initialize other state properties here
}));
