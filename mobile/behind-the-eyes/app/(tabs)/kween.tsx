import { Pressable, View, Text, Modal } from "react-native";
import React, { useCallback, useState } from "react";
import { useAppProvider } from "@/hooks/provider";
import MiniEditNote from "@/components/MiniEditNote";
import IdleScreen from "@/components/IdleScreen";
import PassageModal from "@/components/PassageModal";
import { NoteTableEntry } from "@/constants/types";
import { useFocusEffect } from "expo-router";

const Spotlight = () => {
  const { passage, notification, db, openModal } = useAppProvider();
  const [spotLightId, setSpotlightId] = useState<number>();
  const [spotLightTitle, setSpotLightTitle] = useState(
    notification?.request?.content?.title
  );

  // useFocusEffect instead of useEffect in case spotlight note is deleted
  useFocusEffect(
    useCallback(() => {
      const fetchRandomSpotlightNote = async () => {
        try {
          const allNotes = await db.getAllAsync<NoteTableEntry>(
            "SELECT * FROM journal_entries"
          );
          if (!allNotes) throw new Error("Notes not found");
          const randomIdx = Math.floor(Math.random() * allNotes.length);
          const randomNote = allNotes[randomIdx];
          setSpotLightTitle(randomNote.title);
          setSpotlightId(randomNote.note_id);
        } catch (error) {
          console.error("Could not load random note", error);
        }
      };
      const fetchSpotlightNote = async () => {
        try {
          const row = await db.getFirstAsync<{ note_id: number }>(
            "SELECT note_id FROM journal_entries WHERE title = ?",
            [String(notification?.request.content.title)]
          );

          if (!row) {
            throw new Error("Note not found");
          }

          setSpotlightId(row.note_id);
        } catch (error) {
          if (error?.message === "Note not found") {
            console.log("Note not found");
            return fetchRandomSpotlightNote();
          }
          console.error("Failed to fetch spotlight note:", error);
        }
      };
      if (notification) {
        console.log("Notification found");
        fetchSpotlightNote();
      } else {
        fetchRandomSpotlightNote();
      }
    }, [notification, db])
  );

  if (!passage?.random_verse.text) return <IdleScreen />;

  return (
    <>
      {/* MODAL (artifically takes up full screen */}
      <Modal visible={openModal} animationType="fade" transparent>
        <Pressable className="flex-1 justify-center items-center bg-black/70">
          <PassageModal />
        </Pressable>
      </Modal>
      <View>
        {/** Verse of the day */}
        <View className="bg-[#1e3c7e] h-1/2 p-4">
          <Pressable
            className="w-fit p-6 rounded-2xl bg-[#A2D4F2] m-auto"
            onPress={() => {}} // so the press doesn't bubble up - this is why this is a pressable component
          >
            <View className="mb-2 flex-row items-center gap-1 flex-wrap">
              <Text className="text-xl">{passage?.random_verse.text}</Text>
            </View>
            <Text className="text-2xl font-semibold">
              {passage?.random_verse.book} {passage?.random_verse.chapter}
              {":"}
              {passage?.random_verse.verse}{" "}
              {passage?.translation.identifier.toUpperCase()}
            </Text>
          </Pressable>
        </View>
        {/** Note of the day */}
        <View className="bg-[#820e1e] h-1/2">
          <Text className="text-center text-3xl color-white font-semibold mt-4">
            {spotLightTitle}
          </Text>
          <View className="min-w-[400px] flex justify-center items-center mt-2">
            <MiniEditNote id={Number(spotLightId)} staysReadOnly />
          </View>
        </View>
      </View>
    </>
  );
};

export default Spotlight;
