import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import React from "react";
import { MiniNote } from "@/components/MiniNote";
import { Modal, TextInput, View, Pressable } from "react-native";
import ProfileIcon from "@/components/ProfileIcon";
import { Link } from "expo-router";
import PassageModal from "@/components/PassageModal";
import { useAppProvider } from "@/hooks/provider";

const Home = () => {
  const { currentNote, setCurrentNote, openModal } = useAppProvider();

  return (
    <>
      {/* MODAL (artifically takes up full screen */}
      <Modal visible={openModal} animationType="fade" transparent>
        {/* Overlay (removed onclick so they can't "tap out" to cancel modal) */}
        <Pressable className="flex-1 justify-center items-center bg-black/50">
          {/** Actual modal card */}
          <PassageModal />
        </Pressable>
      </Modal>

      <KeyboardAwareScrollView
        style={{ flex: 1, backgroundColor: "#FFD0EB" }}
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid
        enableAutomaticScroll
      >
        {/** push prop is automatically applied for stack navigator */}
        <Link className="ml-auto p-4" href="/profile">
          <ProfileIcon />
        </Link>
        <View className="flex-1 flex justify-center">
          <TextInput
            className="text-5xl text-center placeholder:text-black/60 mb-8"
            placeholder="Title (Optional)"
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
