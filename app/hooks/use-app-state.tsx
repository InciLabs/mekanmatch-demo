import { createContext, useContext, useState, useEffect } from "react";
import type { User } from "@shared/schema";

interface AppState {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  isAuthenticated: boolean;
  selectedVenueId: string | null;
  setSelectedVenueId: (id: string | null) => void;
}

const AppStateContext = createContext<AppState | undefined>(undefined);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);

  const isAuthenticated = currentUser !== null;

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('mekanmatch-user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('mekanmatch-user');
      }
    }
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('mekanmatch-user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('mekanmatch-user');
    }
  }, [currentUser]);

  const value = {
    currentUser,
    setCurrentUser,
    phoneNumber,
    setPhoneNumber,
    verificationCode,
    setVerificationCode,
    isAuthenticated,
    selectedVenueId,
    setSelectedVenueId,
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}
