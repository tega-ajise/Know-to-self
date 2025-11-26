import { Pressable, View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useAppProvider } from "@/provider/provider";
import MiniEditNote from "@/components/MiniEditNote";
import { NoteTableEntry } from "@/constants/types";

const Spotlight = () => {
  const { passage, notification, db } = useAppProvider();
  const [spotLightId, setSpotlightId] = useState<number>();
  const spotLightTitle = notification?.request?.content?.title;

  useEffect(() => {
    const fetchSpotlightNote = async () => {
      try {
        const noteId = await db.getFirstAsync<NoteTableEntry["note_id"]>(
          "SELECT note_id FROM journal_entries WHERE title = ?",
          [String(notification?.request.content.data?.title)]
        );
        if (!noteId) throw new Error("Note not found");
        setSpotlightId(noteId);
      } catch (error) {
        console.error(error);
      }
    };
    if (notification) fetchSpotlightNote();
  }, [notification, db]);

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
