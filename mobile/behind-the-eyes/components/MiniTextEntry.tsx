import { Ionicons, FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { View, TouchableOpacity, TextInput } from "react-native";

export const MiniTextEntry = () => {
  return (
    <View
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
      className="mx-auto border rounded-lg min-h-[270px]"
    >
      <View className="w-full bg-[#FF6B85] flex flex-row justify-around px-6 py-2 rounded-sm">
        <TouchableOpacity>
          <Ionicons name="calendar-clear" size={40} color="#020873" />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome5 name="external-link-alt" size={38} color="#020873" />
        </TouchableOpacity>
      </View>
      <View className="flex flex-1 bg-[rgba(217,7,45,0.8)] p-2">
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
