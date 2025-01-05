import React from "react";
import Animated from "react-native-reanimated";
import { SharedValue } from "react-native-reanimated";
import { Translations } from "../../../utils/interfaceTranslations";
import { StyleSheet, Text } from "react-native";
import { height, width } from "../../../utils/globalVariables/constants";
import SkipButton from "../SkipButton";

interface Page3Props {
  animationsPages: SharedValue<number>[];
  translations: Translations;
  panResponder: any;
  setPage: (value: any) => any;
  maxPages: number;
  boolLoaded: boolean;
}

const Page3: React.FC<Page3Props> = ({
  animationsPages,
  translations,
  panResponder,
  setPage,
  maxPages,
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
          transform: [{ translateX: animationsPages[2] }],
        },
      ]}
    >
      <SkipButton
        text={translations.skip}
        setPage={setPage}
        maxPages={maxPages}
      />
      <Text style={styles.textPoint}>Page 3</Text>
    </Animated.View>
  );
};

export default Page3;

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
