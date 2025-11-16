import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import React, { useState } from "react";
import { MiniTextEntry } from "@/components/MiniTextEntry";
import { TextInput, View } from "react-native";
import ProfileIcon from "@/components/ProfileIcon";
import { Link } from "expo-router";

const Home = () => {
  const [title, setTitle] = useState("Title Here");

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: "#FFD0EB" }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid
      enableAutomaticScroll
    >
      <Link className="ml-auto p-4" href="/profile">
        <ProfileIcon />
      </Link>
      <View className="flex-1 flex justify-center">
        <TextInput
          className="text-5xl text-center placeholder:text-black/60 mb-8"
          placeholder="Title Here"
          value={title}
          onChangeText={(t) => setTitle(t)}
        />
        <MiniTextEntry />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Home;
