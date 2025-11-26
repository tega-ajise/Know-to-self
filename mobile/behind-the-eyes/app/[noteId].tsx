import { View, TextInput, TouchableOpacity, Alert } from "react-native";
import React, { useCallback, useState } from "react";
import { GIBBERISH } from "@/constants/consts";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAppProvider } from "@/provider/provider";
import { CreateNote, NoteTableEntry } from "@/constants/types";

const FullScreenNote = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ noteId: string }>();
  const noteId = params.noteId.trim() ? Number(params.noteId) : undefined;

  const [activeNote, setActiveNote] = useState<NoteTableEntry>(
    {} as NoteTableEntry
  );

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
          const activeNote = await db.getFirstAsync<NoteTableEntry>(
            "SELECT * FROM journal_entries WHERE note_id = ?",
            [noteId]
          );

          if (!activeNote) {
            if (isPageActive) {
              setActiveNote({
                note_id: noteId,
                title: "",
                content: "",
                created_at: "",
                word_count: 0,
                date: "",
              });
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

  const handleChange = (updateField: Partial<NoteTableEntry & CreateNote>) => {
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

  const handleUpdate = () => {
    Alert.alert("Update note", "Are you sure you want to update this note?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm",
        style: "default",
        onPress: () => {
          handleNoteUpdate(activeNote);
          router.back();
        },
      },
    ]);
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
            if (!noteId) {
              handleNoteSubmit();
              router.back();
            } else {
              handleUpdate();
            }
          }}
        >
          <FontAwesome name="check" size={30} />
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default FullScreenNote;
