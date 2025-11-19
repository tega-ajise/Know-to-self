import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import React, { useState } from "react";
import { MiniNote } from "@/components/MiniNote";
import { Modal, TextInput, View, Text, Pressable } from "react-native";
import ProfileIcon from "@/components/ProfileIcon";
import { Link } from "expo-router";

const testText = `Quiet mornings always feel like borrowed time. People move slowly, sunlight drifts across the room, and the world seems to take a breath before speeding up again. Nothing dramatic happens, but somehow it still feels meaningful.`;
const randomNumberOfGaps = Math.floor(Math.random() * 10); // to generate within a range: Math.floor(Math.random() * (max - min + 1)) + min;
const idxsToGap = Array.from(
  { length: randomNumberOfGaps },
  () => Math.floor(Math.random() * testText.split(" ").length) + 1
);
const uniqueIdxsToGap = new Set(idxsToGap);

const Home = () => {
  const [title, setTitle] = useState("Title Here");
  const [openModal, setOpenModal] = useState<boolean>(true);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [gapValues, setGapValues] = useState<Record<number, string>>({});

  const handleSubmit = () => {
    idxsToGap.forEach((i) => {
      setGapValues((prev) => ({ ...prev, [i]: testText.split(" ")[i] }));
    });
    setIsSubmitted(true);
  };

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
          <Pressable
            className="w-5/6 p-6 rounded-2xl bg-[#A2D4F2]"
            onPress={() => {}} // so the press doesn't bubble up
          >
            <View className="mb-4 flex-row items-center gap-1 flex-wrap">
              {testText.split(" ").map((word, idx) => {
                return uniqueIdxsToGap.has(idx) ? (
                  <TextInput
                    key={idx}
                    value={gapValues[idx] ?? ""}
                    onChangeText={(text) =>
                      setGapValues((prev) => ({ ...prev, [idx]: text }))
                    }
                    className="border min-w-[50px] text-xl text-center"
                    style={[
                      gapValues[idx] === testText.split(" ")[idx] &&
                        !isSubmitted && {
                          borderColor: "green",
                          borderWidth: 2,
                        },
                    ]}
                    autoCapitalize="none"
                  />
                ) : (
                  <Text key={idx} className="text-xl">
                    {word}
                  </Text>
                );
              })}
            </View>
            <View className="bg-[#020873] rounded-lg">
              <Pressable
                onPress={isSubmitted ? () => setOpenModal(false) : handleSubmit}
                className="py-3 px-4"
              >
                <Text className="text-white font-bold text-center text-xl">
                  {isSubmitted ? "God is good!" : "Submit"}
                </Text>
              </Pressable>
            </View>
          </Pressable>
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
