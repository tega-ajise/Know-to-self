import { useAppProvider } from "@/hooks/provider";
import React from "react";
import DatePicker from "react-native-date-picker";

export const NotificationSetter = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { currentNote, setCurrentNote } = useAppProvider();

  return (
    <>
      <DatePicker
        title="Set the notification time"
        modal
        open={open}
        date={(currentNote.date as Date) ?? new Date()}
        minimumDate={new Date()}
        onConfirm={(date) => {
          setOpen(false);
          setCurrentNote((prev) => ({ ...prev, date }));
          console.log({ currentNote });
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
