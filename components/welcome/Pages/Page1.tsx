import {
  appLogoImage,
  appNameImage,
  height,
  userImage,
  width,
} from "../../../utils/globalVariables/constants";
import Animated, {
  SharedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Loading from "../../common/Loading";
import SkipButton from "../SkipButton";
import { Translations } from "../../../utils/interfaceTranslations";
import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";

interface Page1Props {
  animationsPages: SharedValue<number>[];
  translations: Translations;
  panResponder: any;
  setPage: (value: any) => any;
  maxPages: number;
  boolLoaded: boolean;
}

const Page1: React.FC<Page1Props> = ({
  animationsPages,
  translations,
  panResponder,
  setPage,
  maxPages,
  boolLoaded,
}) => {
  //? Both images
  const thingsToLoad = 2;
  const [loading, setLoading] = useState<boolean>(true);
  const [thingsLoaded, setThingsToLoad] = useState<number>(0);
  const animationImage: SharedValue<number> = useSharedValue(-width);
  const animationTextWelcome: SharedValue<number> = useSharedValue(width);
  const animationImageAppName: SharedValue<number> = useSharedValue(width);

  useEffect(() => {
    if (boolLoaded && !loading) {
      setTimeout(() => {}, 1000);
      //? Logo Image
      animationImage.value = withSpring(0, { damping: 15, stiffness: 50 });

      //? App Name Image
      animationImageAppName.value = withSpring(0, {
        damping: 15,
        stiffness: 50,
      });

      //? Welcome Text
      setTimeout(() => {
        animationTextWelcome.value = withSpring(0, {
          damping: 15,
          stiffness: 50,
        });
      }, 800);
    }
  }, [boolLoaded, loading]);

  useEffect(() => {
    if (thingsLoaded >= thingsToLoad) {
      setLoading(false);
    }
  }, [thingsLoaded]);

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.animationView,
        {
          transform: [{ translateY: animationsPages[0] }],
        },
      ]}
    >
      {loading && <Loading boolActivityIndicator boolLoadingText={false} />}

      {!loading && (
        <SkipButton
          text={translations.skip}
          setPage={setPage}
          maxPages={maxPages}
        />
      )}

      <View style={styles.containerAppNameAndLogo}>
        <Animated.Image
          source={appLogoImage}
          style={[styles.image, { left: animationImage }]}
          resizeMode="cover"
          onLoad={() => setThingsToLoad((prev) => prev + 1)}
        />

        <Animated.Image
          source={appNameImage}
          style={[styles.imageAppName, { left: animationImageAppName }]}
          resizeMode="cover"
          onLoad={() => setThingsToLoad((prev) => prev + 1)}
        />
      </View>

      <Animated.Text style={[styles.textPoint, { left: animationTextWelcome }]}>
        {translations.welcomeFirstTime}
      </Animated.Text>
    </Animated.View>
  );
};

export default Page1;

const styles = StyleSheet.create({
  animationView: {
    width: width,
    height: height + 40,
    alignItems: "center",
    position: "absolute",
    paddingTop: 75,
    backgroundColor: "#e0f7fa",
  },
  textPoint: {
    padding: 10,
    fontSize: 30,
    textAlign: "left",
    marginBottom: 20,
    fontFamily: "fontApp",
  },
  image: {
    width: 100,
    height: 100,
  },
  imageAppName: {
    width: 200,
    height: 40,
    marginTop: -15,
  },
  containerAppNameAndLogo: {
    alignItems: "center",
    justifyContent: "center",
  },
});
