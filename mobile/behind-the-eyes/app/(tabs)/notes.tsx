import { Dimensions, View, Text } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import MiniEditNote from "@/components/MiniEditNote";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";
import { NoteTableEntry } from "@/constants/types";
import { useFocusEffect } from "expo-router";
import { useAppProvider } from "@/provider/provider";
import { DATE_FORMAT_OPTIONS } from "@/constants/consts";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const Notes = () => {
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const db = useSQLiteContext();
  const { dbVersion } = useAppProvider();

  const [data, setData] = useState<NoteTableEntry[]>([] as NoteTableEntry[]);

  // Similar implementation to refreshControl in the FlatList
  useFocusEffect(
    // wrapped in useCallback to avoid running this too often
    // as it runs whenever a component is focused
    useCallback(() => {
      let isPageActive = true;

      const loadData = async () => {
        try {
          const entries = await db.getAllAsync<NoteTableEntry>(
            "SELECT * FROM journal_entries"
          );
          if (isPageActive) setData(entries);
        } catch (error) {
          console.error("Could not load notes", error);
        }
      };
      loadData();
      console.log("session update made", dbVersion); // to satisfy linter

      return () => {
        isPageActive = false;
      };
    }, [setData, db, dbVersion]) // setters are stable, will never change, same with db, just for linting
  );

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
        renderItem={({ item }) => {
          const createdAt = new Date(item.created_at).toLocaleDateString(
            undefined,
            { month: "short", day: "2-digit", year: "numeric" }
          );
          const alertDate = new Date(item.date).toLocaleString(
            undefined,
            DATE_FORMAT_OPTIONS
          );

          return (
            <View className="translate-y-16">
              <Text className="mx-auto text-5xl font-bold">{item?.title}</Text>
              <View className="mx-auto mt-8">
                <View className="flex flex-row items-center gap-1">
                  <FontAwesome5 name="pen" size={18} color="#A43232" />
                  <Text className="text-xl">{createdAt}</Text>
                </View>
                <MiniEditNote id={item.note_id} />
              </View>
              {item?.date && (
                <View className="mt-4 mx-auto flex-row items-center gap-2">
                  <FontAwesome name="bell" size={24} color="#A43232" />
                  <Text className="text-xl font-semibold">{alertDate}</Text>
                </View>
              )}
            </View>
          );
        }}
      />

      <Pagination.Basic
        progress={progress}
        data={data}
        dotStyle={{ backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 50 }}
        containerStyle={{
          gap: 5,
          marginHorizontal: 10,
          flexWrap: "wrap",
          justifyContent: "flex-start",
        }}
        onPress={onPressPagination}
      />
    </KeyboardAwareScrollView>
  );
};

export default Notes;
