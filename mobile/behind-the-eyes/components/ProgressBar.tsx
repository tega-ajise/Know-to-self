import { View, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 20,
    backgroundColor: "#FF6B85",
    borderColor: "#FF6B85",
    borderWidth: 1.5,
    borderRadius: 3,
    overflow: "hidden",
    position: "relative",
  },
  progress: {
    height: 20,
    backgroundColor: "#D9072D",
    borderColor: "#D9072D",
    position: "absolute",
  },
});

const ProgressBar = ({ progress }: { progress: number }) => (
  <View style={styles.container}>
    <View style={[styles.progress, { width: `${progress * 100}%` }]} />
  </View>
);

export default ProgressBar;
