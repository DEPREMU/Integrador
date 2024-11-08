import Loading from "../components/Loading";
import languages from "../components/languages.json";
import { width, height, checkLanguage } from "../components/globalVariables";
import React, { useEffect, useRef, useState } from "react";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { StyleSheet, View, Text, Pressable, PanResponder } from "react-native";

const PointsIndicator = ({ focusAnimation, maxPages, styles, page }) => {
  if (!focusAnimation || !maxPages || !styles || !page)
    return <Text>Error with arguments</Text>;

  return (
    <View style={styles.indicatorContainer}>
      {[...Array(maxPages)].map((_, index) => (
        <Pressable onPress={() => setPage(index + 1)} key={index}>
          <Animated.View
            style={[
              index + 1 === page ? styles.pointed : styles.indicator,
              {
                transform: [
                  {
                    scale: focusAnimation[index],
                  },
                ],
              },
            ]}
          />
        </Pressable>
      ))}
    </View>
  );
};

const Welcome = ({ navigation }) => {
  const maxPages = 4;
  const [lang, setLang] = useState("en");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const getTranslations = () => languages[lang];

  useEffect(() => {
    const loadLanguage = async () => setLang(await checkLanguage());

    loadLanguage();
  }, []);

  const animationsPages = [
    useSharedValue(height * 2),
    useSharedValue(-width),
    useSharedValue(-width),
    useSharedValue(-height * 1.5),
  ];

  const focusAnimation = Array.from({ length: maxPages }, () =>
    useSharedValue(1)
  );

  const next = () => setPage((prev) => (prev < maxPages ? prev + 1 : prev));
  const less = () => setPage((prev) => (prev > 1 ? prev - 1 : prev));

  //While scrolling more/less than +- 20 px in x, or more/less than +- 100 px in y
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) =>
        Math.abs(gestureState.dx) > 20 || Math.abs(gestureState.dy) > 80,
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 20) less();
        else if (gestureState.dx < -20) next();
        else if (gestureState.dy > 100 || gestureState.dy < -100)
          setPage(maxPages);
      },
    })
  ).current;

  useEffect(() => {
    animationsPages[0].value = withSpring(0, { damping: 15, stiffness: 50 });
    focusAnimation[0].value = withSpring(1.3, { damping: 15, stiffness: 50 });
  }, []);

  useEffect(() => {
    focusAnimation.forEach((animation, index) => {
      animation.value = withSpring(index + 1 === page ? 1.3 : 0.8, {
        damping: 15,
        stiffness: 50,
      });
    });

    animationsPages.forEach((animation, index) => {
      animation.value = withSpring(
        index + 1 === page
          ? 0
          : index === 0
          ? -height * 1.3
          : index + 1 < page
          ? -width
          : height * 2,
        {
          damping: 15,
          stiffness: 50,
        }
      );
    });
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [page]);

  const SkipButton = ({ text }) => (
    <Pressable
      style={({ pressed }) => [
        styles.buttonSkip,
        { opacity: pressed ? 0.5 : 1 },
      ]}
      onPress={() => setPage(maxPages)}
    >
      <Text style={styles.textSkip}>{text || "Skip"}</Text>
    </Pressable>
  );

  const ContinueButton = ({ text, func }) => (
    <Pressable
      style={({ pressed }) => [
        styles.buttonSkip,
        { opacity: pressed ? 0.5 : 1 },
      ]}
      onPress={() => (typeof func == "function" ? func() : null)}
    >
      <Text style={styles.textSkip}>{text}</Text>
    </Pressable>
  );

  const Page1 = ({ animationsPages, translations }) => {
    if (!translations || !animationsPages)
      return <Text>Error with arguments</Text>;

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
        <SkipButton text={translations.skipText} />
        <Text style={styles.textPoint}>Page 1</Text>
      </Animated.View>
    );
  };

  const Page2 = ({ animationsPages, translations }) => {
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
        <SkipButton text={translations.skipText} />
        <Text style={styles.textPoint}>Page 2</Text>
      </Animated.View>
    );
  };

  const Page3 = ({ animationsPages, translations }) => {
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
        <SkipButton text={translations.skip} />
        <Text style={styles.textPoint}>Page 3</Text>
      </Animated.View>
    );
  };

  const Page4 = ({ animationsPages, translations }) => {
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
        <ContinueButton
          text={translations.continue}
          func={() => navigation.replace("Sign in")}
        />

        <Text style={styles.textPoint}>Page 4</Text>
      </Animated.View>
    );
  };

  if (loading)
    return <Loading boolActivityIndicator={true} boolLoadingText={false} />;

  const tranlations = getTranslations();

  return (
    <View style={styles.container}>
      <Page1 animationsPages={animationsPages} translations={tranlations} />
      <Page2 animationsPages={animationsPages} translations={tranlations} />
      <Page3 animationsPages={animationsPages} translations={tranlations} />
      <Page4 animationsPages={animationsPages} translations={tranlations} />

      {/* Indicadores de página */}
      <PointsIndicator
        focusAnimation={focusAnimation}
        maxPages={maxPages}
        styles={styles}
        page={page}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "violet",
    paddingTop: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  textPoint: {
    fontSize: 30,
    color: "white",
    marginBottom: 20,
  },
  animationView: {
    position: "absolute",
    backgroundColor: "violet",
    alignItems: "center",
    justifyContent: "center",
    height: height + 40,
    width: width,
  },
  indicatorContainer: {
    position: "absolute",
    top: 30,
    flexDirection: "row",
    marginTop: 20,
  },
  indicator: {
    backgroundColor: "gray",
    width: 20,
    height: 20,
    borderRadius: 100,
    margin: 5,
  },
  pointed: {
    backgroundColor: "white",
    width: 20,
    height: 20,
    borderRadius: 100,
    margin: 5,
  },
  buttonSkip: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "purple",
    padding: 10,
    borderRadius: 10,
  },
  textSkip: {
    color: "white",
    fontSize: 16,
  },
});

export default Welcome;
