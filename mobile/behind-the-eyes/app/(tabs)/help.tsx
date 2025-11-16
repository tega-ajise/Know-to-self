import React from "react";
import { Text, StyleSheet, ScrollView } from "react-native";

export default function Help() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Welcome</Text>

      <Text style={styles.sectionTitle}>This app is your safe space</Text>
      <Text style={styles.body}>
        This is a place meant just for you. Everything you write stays on your
        device, and no one else sees it. Think of it as a quiet corner where you
        can pause, breathe, and check in with yourself.
      </Text>

      <Text style={styles.sectionTitle}>Write reminders about who you are</Text>
      <Text style={styles.body}>
        Use these notes to remind yourself of your strength, your progress, and
        the things that matter most. You can track how you’re growing, set
        intentions, or simply put your feelings into words.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    backgroundColor: "#FFD0EB",
    flex: 1,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
    color: "#444",
  },
});
