import { Stack } from "expo-router";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ThemeProvider } from "./contexts/ThemeContext";

export default function RootLayout() {
  // In a real app, you would get userId from auth context
  const userId = "user-1"; // Mock userId

  return (
    <NotificationProvider userId={userId}>
      <ThemeProvider>
        <Stack>
          <Stack.Screen name="splash" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          <Stack.Screen name="auth/verification" options={{ headerShown: false }} />
          <Stack.Screen name="auth/profile-setup" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </NotificationProvider>
  );
}
