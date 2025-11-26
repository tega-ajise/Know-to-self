import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Notifications from "expo-notifications";
import React, { useEffect, useState } from "react";
import { MiniNote } from "@/components/MiniNote";
import { Modal, TextInput, View, Pressable } from "react-native";
import ProfileIcon from "@/components/ProfileIcon";
import { Link, Redirect } from "expo-router";
import PassageModal from "@/components/PassageModal";
import { useAppProvider } from "@/provider/provider";

const Home = () => {
  const { currentNote, setCurrentNote, notification } = useAppProvider();
  const [openModal, setOpenModal] = useState<boolean>(true);

  useEffect(() => {
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => responseListener.remove();
  }, [notification]);

  if (notification) return <Redirect href="/kween" />;

  return (
    <>
      {/* MODAL (artifically takes up full screen */}
      <Modal visible={openModal} animationType="fade" transparent>
        {/* Overlay */}
        <Pressable
          className="flex-1 justify-center items-center bg-black/50"
          onPress={() => setOpenModal(false)} // tap outside to close
        >
          {/** Actual modal card */}
          <PassageModal setOpenModal={setOpenModal} />
        </Pressable>
      </Modal>

      <KeyboardAwareScrollView
        style={{ flex: 1, backgroundColor: "#FFD0EB" }}
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid
        enableAutomaticScroll
      >
        <Link className="ml-auto p-4" href="/profile">
          <ProfileIcon />
        </Link>
        <View className="flex-1 flex justify-center">
          <TextInput
            className="text-5xl text-center placeholder:text-black/60 mb-8"
            placeholder="Title Here"
            value={currentNote.title}
            onChangeText={(t) =>
              setCurrentNote((prev) => ({
                ...prev,
                title: t,
              }))
            }
          />
          <MiniNote />
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};

export default Home;
