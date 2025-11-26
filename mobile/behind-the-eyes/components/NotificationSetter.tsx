import { NoteTableEntry } from "@/constants/types";
import { useAppProvider } from "@/provider/provider";
import React from "react";
import DatePicker from "react-native-date-picker";

export const NotificationSetter = ({
  open,
  setOpen,
  activeNote,
  setActiveNote,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeNote?: NoteTableEntry;
  setActiveNote?: React.Dispatch<React.SetStateAction<NoteTableEntry>>;
}) => {
  const { currentNote, setCurrentNote } = useAppProvider();
  const activeNoteDate = activeNote?.date ? new Date(activeNote.date) : null;

  const dateValue = activeNote
    ? (activeNoteDate ?? new Date())
    : (currentNote.date ?? new Date());

  return (
    <>
      <DatePicker
        title="Set the notification time"
        modal
        open={open}
        date={dateValue}
        minimumDate={new Date()}
        onConfirm={(date) => {
          if (setActiveNote) {
            setActiveNote((prev) => ({ ...prev, date }));
          } else {
            setCurrentNote((prev) => ({ ...prev, date }));
          }
          setOpen(false);
        }}
        onCancel={() => {
          setOpen(false);
        }}
        mode="datetime"
        locale="en"
      />
    </>
  );
};
