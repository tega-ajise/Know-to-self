import { View, Text, FlatList, TouchableWithoutFeedback } from "react-native";
import React from "react";
import ProfileIcon from "@/components/ProfileIcon";
import { STATS } from "@/constants/consts";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const Profile = () => {
  const router = useRouter();
  return (
    <View className="bg-[#FFD0EB] flex-1">
      <TouchableWithoutFeedback onPress={() => router.back()}>
        <View className="absolute left-[15px] top-[15px]">
          {/** might change this icon */}
          <Ionicons name="arrow-back" size={24} color="black" />
        </View>
      </TouchableWithoutFeedback>
      <View className="mt-16 gap-6">
        <View className="items-center">
          <ProfileIcon />
        </View>
        <View className="items-center">
          <Text className="font-extrabold text-4xl">Stats</Text>
        </View>
        <FlatList
          data={Object.entries(STATS)}
          renderItem={({ item: [category, stat] }) => (
            <View className="border border-black flex flex-row justify-between p-6">
              <Text className="font-semibold text-2xl">{category}</Text>
              <Text className="font-bold text-4xl">{stat}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default Profile;
