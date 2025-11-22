import { Stack } from "expo-router";
import SafeScreen from "@/components/SafeArea";
import { Suspense } from "react";

import "@/global.css";
import { AppProvider } from "@/hooks/provider";
import { Text } from "react-native";

export default function RootLayout() {
  return (
    <Suspense fallback={<Text>Loading ....</Text>}>
      <AppProvider>
        <SafeScreen>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="profile" />
            <Stack.Screen name="full-screen-note" />
          </Stack>
        </SafeScreen>
      </AppProvider>
    </Suspense>
  );
}
