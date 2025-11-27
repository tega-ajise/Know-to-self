import { View, Text, Pressable, TextInput } from "react-native";
import React, { useMemo, useState } from "react";
import { useAppProvider } from "@/hooks/provider";
import IdleScreen from "./IdleScreen";

const PassageModal = ({
  setOpenModal,
}: {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { passage } = useAppProvider();
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [gapValues, setGapValues] = useState<Record<number, string>>({});

  const passageText = useMemo(() => {
    if (!passage) return { text: "", verse: "" };
    const { random_verse, translation } = passage;
    return {
      text: random_verse?.text.replace(/\n/g, ""),
      verse: `${random_verse?.book} ${random_verse?.chapter}:${random_verse?.verse}`,
      version: translation.identifier,
    };
  }, [passage]);

  const idxsToGap = useMemo(() => {
    const randomNumberOfGaps = Math.floor(Math.random() * 10); // to generate within a range: Math.floor(Math.random() * (max - min + 1)) + min;

    return Array.from(
      { length: randomNumberOfGaps },
      () => Math.floor(Math.random() * passageText.text.split(" ").length) + 1
    );
  }, [passageText]);
  const uniqueIdxsToGap = new Set(idxsToGap);

  const handleSubmit = () => {
    idxsToGap.forEach((i) => {
      setGapValues((prev) => ({
        ...prev,
        [i]: passageText.text.split(" ")[i],
      }));
    });
    setIsSubmitted(true);
  };

  if (!passageText.text) return <IdleScreen />;

  return (
    <Pressable
      className="w-5/6 p-6 rounded-2xl bg-[#A2D4F2]"
      onPress={() => {}} // so the press doesn't bubble up - this is why this is a pressable component
    >
      <View className="mb-4 flex-row items-center gap-1 flex-wrap">
        {passageText.text.split(" ").map((word: string, idx: number) => {
          return uniqueIdxsToGap.has(idx) ? (
            <TextInput
              key={idx}
              value={gapValues[idx] ?? ""}
              onChangeText={(text) =>
                setGapValues((prev) => ({ ...prev, [idx]: text }))
              }
              className="border min-w-[50px] text-xl text-center"
              style={[
                gapValues[idx] === passageText.text.split(" ")[idx] &&
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
      <Text className="text-xl font-semibold mb-4">
        {passageText.verse} {passageText.version?.toUpperCase()}
      </Text>
      <View className="bg-[#020873] rounded-lg">
        <Pressable
          onPress={isSubmitted ? () => setOpenModal(false) : handleSubmit}
          className="py-3 px-4"
        >
          <Text className="text-white font-bold text-center text-xl">
            {isSubmitted ? "God is good!" : "See Answer"}
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
};

export default PassageModal;
