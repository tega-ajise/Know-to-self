import { Pressable, View, Text } from "react-native";
import React from "react";
import { useAppProvider } from "@/provider/provider";
import MiniEditNote from "@/components/MiniEditNote";

const Spotlight = () => {
  const { passage, notification } = useAppProvider();
  const spotLightId = notification?.request?.content?.data?.id;
  const spotLightTitle = notification?.request?.content?.title;

  return (
    <View>
      {/** Verse of the day */}
      <View className="bg-[#1e3c7e] h-1/2 p-4">
        <Pressable
          className="w-fit p-6 rounded-2xl bg-[#A2D4F2] m-auto"
          onPress={() => {}} // so the press doesn't bubble up - this is why this is a pressable component
        >
          <View className="mb-2 flex-row items-center gap-1 flex-wrap">
            <Text className="text-xl">{passage.random_verse.text}</Text>
          </View>
          <Text className="text-2xl font-semibold">
            {passage.random_verse.book} {passage.random_verse.chapter}
            {":"}
            {passage.random_verse.verse}{" "}
            {passage.translation.identifier.toUpperCase()}
          </Text>
        </Pressable>
      </View>
      {/** Note of the day */}
      <View className="bg-[#820e1e] h-1/2">
        <Text>{spotLightTitle}</Text>
        <View className="min-w-[400px] flex justify-center items-center">
          <MiniEditNote id={Number(spotLightId)} staysReadOnly />
        </View>
      </View>
    </View>
  );
};

export default Spotlight;
