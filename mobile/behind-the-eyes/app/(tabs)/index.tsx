import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import React, { useState } from "react";
import { MiniNote } from "@/components/MiniNote";
import { Modal, TextInput, View, Pressable } from "react-native";
import ProfileIcon from "@/components/ProfileIcon";
import { Link } from "expo-router";
import PassageModal from "@/components/PassageModal";

const Home = () => {
  const [title, setTitle] = useState("Title Here");
  const [openModal, setOpenModal] = useState<boolean>(true);

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
            value={title}
            onChangeText={(t) => setTitle(t)}
          />
          <MiniNote />
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};

export default Home;
