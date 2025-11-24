import { Stack } from "expo-router";
import SafeScreen from "@/components/SafeArea";

import "@/global.css";
import { AppProvider } from "@/hooks/provider";

export default function RootLayout() {
  return (
    <AppProvider>
      <SafeScreen>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="[noteId]" />
        </Stack>
      </SafeScreen>
    </AppProvider>
  );
}
