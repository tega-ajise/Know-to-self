import { Stack } from "expo-router";
import SafeScreen from "@/components/SafeArea";

import "@/global.css";

export default function RootLayout() {
  return (
    <SafeScreen>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="profile" />
      </Stack>
    </SafeScreen>
  );
}
