import { AppState } from "react-native";
import { Stack } from "expo-router";
import SafeScreen from "@/components/SafeArea";
import "@/global.css";
import { AppProvider } from "@/hooks/provider";
import { useEffect, useRef, useState } from "react";
import IdleScreen from "@/components/IdleScreen";

export default function RootLayout() {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const appSubscription = AppState.addEventListener(
      "change",
      (newAppState) => {
        if (newAppState === "inactive" || newAppState === "background") {
          console.log("App state is now " + newAppState);
        }
        appState.current = newAppState;
        setAppStateVisible(appState.current);
      }
    );

    return () => {
      appSubscription.remove();
    };
  }, []);

  if (appStateVisible === "background" || appStateVisible === "inactive") {
    return <IdleScreen />;
  }

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
