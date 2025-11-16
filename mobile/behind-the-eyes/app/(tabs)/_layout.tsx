import { Tabs } from "expo-router";
import React from "react";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "rgba(217,7,45,0.8)",
        },
        tabBarActiveBackgroundColor: "#FF6B85",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: () => (
            <FontAwesome5 name="home" size={24} color="#020873" />
          ),
        }}
      />
      <Tabs.Screen
        name="kween"
        options={{
          title: "Spotlight",
          tabBarIcon: () => (
            <FontAwesome5 name="crown" size={24} color="#020873" />
          ),
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          tabBarIcon: () => (
            <Ionicons name="folder-sharp" size={24} color="#020873" />
          ),
        }}
      />
      <Tabs.Screen
        name="help"
        options={{
          tabBarIcon: () => (
            <FontAwesome5 name="question-circle" size={24} color="#020873" />
          ),
        }}
      />
    </Tabs>
  );
}
