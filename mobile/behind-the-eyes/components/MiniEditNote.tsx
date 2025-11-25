import React, { useEffect, useState } from "react";
import { View, TextInput, TouchableOpacity, Alert } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { NoteDTO } from "@/constants/types";
import { useAppProvider } from "@/hooks/provider";

const MiniEditNote = ({ id }: { id: number }) => {
  const db = useSQLiteContext();
  const { handleNoteDelete, handleNoteUpdate } = useAppProvider();

  const [isReadOnly, setIsReadOnly] = useState<boolean>(true);
  const [activeNote, setActiveNote] = useState<NoteDTO & { note_id: number }>({
    title: "",
    content: "",
    word_count: 0,
    created_at: undefined,
    note_id: 0,
  });

  useEffect(() => {
    const loadNote = async () => {
      const note = await db.getFirstAsync<NoteDTO & { note_id: number }>(
        "SELECT * FROM journal_entries WHERE note_id = ?",
        [id]
      );
      if (note) setActiveNote(note);
    };
    loadNote();
  }, [db, id]);

  const handleDelete = () => {
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => handleNoteDelete(id),
      },
    ]);
  };

  return (
    <View
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
      className="mx-auto rounded-lg min-h-[270px] w-5/6"
    >
      <View className="bg-[#FF6B85] rounded-[4px] translate-y-1 z-10">
        <View className="w-full flex flex-row justify-around px-6 py-2">
          <TouchableOpacity>
            <Ionicons name="calendar-clear" size={40} color="#020873" />
          </TouchableOpacity>
          <Link
            href={{
              pathname: "/[noteId]",
              params: { noteId: activeNote.note_id },
            }}
          >
            <FontAwesome5 name="external-link-alt" size={38} color="#020873" />
          </Link>
          <TouchableOpacity onPress={handleDelete}>
            <FontAwesome5 name="trash-alt" size={38} color="#020873" />
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex flex-1 border-x-4 border-b-4 border-[#D9072D] bg-[rgba(217,7,45,0.7)] p-2">
        <TextInput
          multiline
          numberOfLines={5}
          placeholder="Today I..."
          className="p-2 flex-1 text-3xl"
          value={activeNote?.content}
          onChangeText={(t) =>
            setActiveNote((prev) => ({ ...prev, content: t }))
          }
          readOnly={isReadOnly}
        />
        <TouchableOpacity
          className="self-end"
          onPress={() => {
            if (!isReadOnly) {
              handleNoteUpdate(activeNote);
            }
            setIsReadOnly((prev) => !prev);
          }}
        >
          <FontAwesome5
            name={isReadOnly ? "edit" : "check"}
            size={24}
            color="#020873"
            iconStyle={{ fontWeight: 10 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MiniEditNote;
