import { Tabs } from "expo-router";
import React from "react";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="kween" options={{ title: "Spotlight" }} />
      <Tabs.Screen name="notes" />
      <Tabs.Screen name="help" />
    </Tabs>
  );
}
