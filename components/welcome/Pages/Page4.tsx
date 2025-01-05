import React from "react";
import Animated, { SharedValue } from "react-native-reanimated";
import ContinueButton from "../ContinueButton";
import { height, width } from "../../../utils/globalVariables/constants";
import { Text, StyleSheet } from "react-native";
import { Translations } from "../../../utils/interfaceTranslations";

interface Page4Props {
  animationsPages: SharedValue<number>[];
  translations: Translations;
  panResponder: any;
  signIn: () => any;
  boolLoaded: boolean;
}

const Page4: React.FC<Page4Props> = ({
  animationsPages,
  translations,
  panResponder,
  signIn,
  boolLoaded,
}) => {
  if (!translations || !animationsPages)
    return <Text>Error with arguments</Text>;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.animationView,
        {
          transform: [{ translateY: animationsPages[3] }],
        },
      ]}
    >
      <ContinueButton text={translations.continue} func={() => signIn()} />

      <Text style={styles.textPoint}>Page 4</Text>
    </Animated.View>
  );
};

export default Page4;

const styles = StyleSheet.create({
  animationView: {
    width: width,
    height: height + 40,
    alignItems: "center",
    position: "absolute",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  textPoint: {
    fontSize: 30,
    color: "black",
    marginBottom: 20,
  },
});
