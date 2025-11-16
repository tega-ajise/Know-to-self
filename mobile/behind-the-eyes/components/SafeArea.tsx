import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native";
import React from "react";

const SafeScreen = ({ children }: { children: React.ReactNode }) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingTop: insets.top,
        flex: 1,
      }}
    >
      {children}
    </View>
  );
};

export default SafeScreen;
