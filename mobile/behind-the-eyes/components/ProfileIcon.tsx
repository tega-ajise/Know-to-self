import { View, Image, StyleSheet } from "react-native";
import React from "react";

const AVATAR_SIZE = 80;

const ProfileIcon = () => {
  return (
    <View>
      <Image
        source={require("../assets/images/profile-photo.png")}
        style={styles.avatar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2, // makes it a circle
    borderWidth: 2,
    borderColor: "#D9072D",
    // optional:
    resizeMode: "cover",
    overflow: "hidden",
  },
});

export default ProfileIcon;
