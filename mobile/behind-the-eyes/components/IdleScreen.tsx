import React from "react";
import { StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function IdleScreen() {
  return (
    <LinearGradient
      colors={["#20448F", "#7A3FA6", "#D6243D"]} // tweak to match Figma
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Image
        source={require("../assets/heart.png")}
        style={styles.heart}
        resizeMode="contain"
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 30, // only needed if you want rounded corners in a preview
    overflow: "hidden", // so the gradient respects the radius
    alignItems: "center",
    justifyContent: "center",
  },
  heart: {
    width: "60%", // or a fixed size like 260
    height: "60%",
  },
});
