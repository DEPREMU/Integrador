import React from "react";
import { Translations } from "../../../utils/interfaceTranslations";
import { StyleSheet, Text } from "react-native";
import Animated, { SharedValue } from "react-native-reanimated";
import { height, width } from "../../../utils/globalVariables/constants";
import SkipButton from "../SkipButton";

interface Page2Props {
  animationsPages: SharedValue<number>[];
  translations: Translations;
  panResponder: any;
  setPage: (value: any) => any;
  maxPages: number;
  boolLoaded: boolean;
}

const Page2: React.FC<Page2Props> = ({
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
          transform: [{ translateX: animationsPages[1] }],
        },
      ]}
    >
      <SkipButton
        text={translations.skip}
        setPage={setPage}
        maxPages={maxPages}
      />
      <Text style={styles.textPoint}>Page 2</Text>
    </Animated.View>
  );
};

export default Page2;

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
