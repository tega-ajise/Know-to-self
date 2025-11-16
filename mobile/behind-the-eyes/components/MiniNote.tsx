import { Ionicons, FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import { View, TouchableOpacity, TextInput } from "react-native";

export const MiniNote = () => {
  return (
    <View
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
      className="mx-auto rounded-lg min-h-[270px]"
    >
      <View className="bg-[#FF6B85] rounded-[4px] translate-y-1 z-10">
        <View className="w-full flex flex-row justify-around px-6 py-2">
          <TouchableOpacity>
            <Ionicons name="calendar-clear" size={40} color="#020873" />
          </TouchableOpacity>
          <Link href="/full-screen-note">
            <FontAwesome5 name="external-link-alt" size={38} color="#020873" />
          </Link>
        </View>
      </View>
      <View className="flex flex-1 border-x-4 border-b-4 border-[#D9072D] bg-[rgba(217,7,45,0.7)] p-2">
        <TextInput
          multiline
          numberOfLines={5}
          placeholder="Today I..."
          className="p-2 flex-1 text-3xl"
        />
        <TouchableOpacity className="self-end">
          <FontAwesome name="check" size={30} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
