import { Dimensions, View, Text } from "react-native";
import React from "react";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import MiniEditNote from "@/components/MiniEditNote";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";

const data = [...new Array(6).keys()];
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const Notes = () => {
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      /**
       * Calculate the difference between the current index and the target index
       * to ensure that the carousel scrolls to the nearest index
       */
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <KeyboardAwareScrollView style={{ backgroundColor: "#FFD0EB" }}>
      <Carousel
        ref={ref}
        width={width}
        height={height - 300}
        data={data}
        onProgressChange={progress}
        renderItem={({ index }) => (
          <View className="translate-y-16">
            <Text className="mx-auto text-5xl font-bold">Title Here</Text>
            <View className="mx-auto mt-8">
              <View className="flex flex-row items-center gap-1">
                <FontAwesome5 name="pen" size={18} color="#A43232" />
                <Text className="text-xl">May 23, 2002</Text>
              </View>
              <MiniEditNote />
            </View>
            <View className="mt-4 mx-auto flex-row items-center gap-2">
              <FontAwesome name="bell" size={24} color="#A43232" />
              <Text className="text-xl font-semibold">May 23, 2002</Text>
            </View>
          </View>
        )}
      />

      <Pagination.Basic
        progress={progress}
        data={data}
        dotStyle={{ backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 50 }}
        containerStyle={{ gap: 5, marginTop: 10, position: "fixed" }}
        onPress={onPressPagination}
      />
    </KeyboardAwareScrollView>
  );
};

export default Notes;
