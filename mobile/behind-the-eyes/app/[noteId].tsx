import { View, TextInput, TouchableOpacity } from "react-native";
import React, { useCallback, useState } from "react";
import { GIBBERISH } from "@/constants/consts";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAppProvider } from "@/hooks/provider";
import { NoteDTO } from "@/constants/types";

const FullScreenNote = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ noteId: string }>();
  const noteId = params.noteId.trim() ? Number(params.noteId) : undefined;

  const [activeNote, setActiveNote] = useState<NoteDTO>({} as NoteDTO);

  const {
    db,
    handleNoteSubmit,
    handleNoteUpdate,
    currentNote,
    setCurrentNote,
  } = useAppProvider();

  useFocusEffect(
    useCallback(() => {
      let isPageActive = true;

      const loadNote = async () => {
        if (!noteId) return;
        try {
          const activeNote = await db.getFirstAsync<NoteDTO>(
            "SELECT * FROM journal_entries WHERE note_id = ?",
            [noteId]
          );

          if (!activeNote) {
            if (isPageActive) {
              setActiveNote({
                note_id: noteId,
                title: "",
                content: "",
              } as NoteDTO);
            }
            return;
          }
          if (isPageActive) setActiveNote(activeNote);
        } catch (error) {
          console.error("Failed to load note", error);
        }
      };
      loadNote();

      // this cleanup function runs to cancel the effect if unmounted
      return () => {
        isPageActive = false;
      };
    }, [noteId, setActiveNote, db])
  );

  const handleChange = (updateField: Partial<NoteDTO>) => {
    if (!noteId) {
      setCurrentNote((prev) => ({
        ...prev,
        ...updateField,
      }));
    } else {
      setActiveNote((prev) => ({
        ...prev,
        ...updateField,
      }));
    }
  };

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
        <TextInput
          placeholder="Title"
          className="text-4xl color-white"
          value={!noteId ? currentNote.title : activeNote.title}
          onChangeText={(t) => handleChange({ title: t })}
        />
        <TextInput
          multiline
          placeholder={GIBBERISH}
          className="text-xl color-white"
          value={!noteId ? currentNote.content : activeNote.content}
          onChangeText={(t) =>
            handleChange({ content: t, word_count: t.split(" ").length })
          }
        />
        <TouchableOpacity
          className="absolute bottom-2 right-2"
          onPress={() => {
            if (!noteId) return handleNoteSubmit();
            handleNoteUpdate(activeNote);
          }}
        >
          <FontAwesome name="check" size={30} />
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default FullScreenNote;
