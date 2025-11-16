import { View, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import { GIBBERISH } from "@/constants/consts";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const FullScreenNote = () => {
  const router = useRouter();

  return (
    <KeyboardAwareScrollView
      className="bg-[#FFD0EB] flex-1 p-6"
      contentContainerClassName="grow"
      enableAutomaticScroll
      enableOnAndroid
    >
      <View className="relative flex-1 border-8 rounded-lg p-4 border-[#D9072D] bg-[rgba(217,7,45,0.8)] gap-2">
        <TouchableOpacity
          className="absolute right-2 top-2 z-10"
          onPress={() => router.back()}
        >
          <AntDesign name="shrink" size={24} color="black" />
        </TouchableOpacity>
        <TextInput placeholder="Title" className="text-4xl color-white" />
        <TextInput
          multiline
          placeholder={GIBBERISH}
          className="text-xl color-white"
        />
        <TouchableOpacity className="absolute bottom-2 right-2">
          <FontAwesome name="check" size={30} />
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default FullScreenNote;
