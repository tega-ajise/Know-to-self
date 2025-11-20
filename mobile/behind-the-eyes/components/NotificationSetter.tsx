import React, { useState } from "react";
import DatePicker from "react-native-date-picker";

export const NotificationSetter = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [date, setDate] = useState(new Date());

  return (
    <>
      <DatePicker
        title="Set the notification time"
        modal
        open={open}
        date={date}
        onConfirm={(date) => {
          setOpen(false);
          setDate(date);
          console.log({ date });
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
