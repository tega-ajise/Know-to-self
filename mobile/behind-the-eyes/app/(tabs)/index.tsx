import { TextInput, View } from "react-native";

import React from "react";

const Home = () => {
  return (
    <View>
      <TextInput multiline editable autoCorrect={false} className="hidden" />
    </View>
  );
};

export default Home;
