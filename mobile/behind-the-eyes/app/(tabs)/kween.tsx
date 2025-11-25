import { Pressable, View, Text } from "react-native";
import React from "react";
import { useAppProvider } from "@/hooks/provider";

const Spotlight = () => {
  const { passage } = useAppProvider();

  return (
    <View>
      {/** Verse of the day */}
      <View className="bg-[#20448F] h-1/2">
        <Pressable
          className="w-5/6 p-6 rounded-2xl bg-[#A2D4F2]"
          onPress={() => {}} // so the press doesn't bubble up - this is why this is a pressable component
        >
          <View className="mb-4 flex-row items-center gap-1 flex-wrap">
            {passage.random_verse.text}
          </View>
          <Text className="text-xl font-semibold mb-4">
            {passage.random_verse.book} {passage.random_verse.chapter}{" "}
            {passage.random_verse.verse}{" "}
            {passage.translation.identifier.toUpperCase()}
          </Text>
        </Pressable>
      </View>
      {/** Note of the day */}
      <View className="bg-[#D6243D] h-1/2">
        <Text>Notification result here</Text>
      </View>
    </View>
  );
};

export default Spotlight;
