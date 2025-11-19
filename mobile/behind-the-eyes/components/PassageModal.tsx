import { View, Text, Pressable, TextInput } from "react-native";
import React, { useState } from "react";

const testText = `Quiet mornings always feel like borrowed time. People move slowly, sunlight drifts across the room, and the world seems to take a breath before speeding up again. Nothing dramatic happens, but somehow it still feels meaningful.`;
const randomNumberOfGaps = Math.floor(Math.random() * 10); // to generate within a range: Math.floor(Math.random() * (max - min + 1)) + min;
const idxsToGap = Array.from(
  { length: randomNumberOfGaps },
  () => Math.floor(Math.random() * testText.split(" ").length) + 1
);
const uniqueIdxsToGap = new Set(idxsToGap);

const PassageModal = ({
  setOpenModal,
}: {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [gapValues, setGapValues] = useState<Record<number, string>>({});

  const handleSubmit = () => {
    idxsToGap.forEach((i) => {
      setGapValues((prev) => ({ ...prev, [i]: testText.split(" ")[i] }));
    });
    setIsSubmitted(true);
  };

  return (
    <Pressable
      className="w-5/6 p-6 rounded-2xl bg-[#A2D4F2]"
      onPress={() => {}} // so the press doesn't bubble up - this is why this is a pressable component
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
  );
};

export default PassageModal;
