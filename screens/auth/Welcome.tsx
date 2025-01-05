import {
  SharedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {
  FIRST_TIME_LOADING_APP,
  height,
  LanguageKeys,
  width,
} from "../../utils/globalVariables/constants";
import Page1 from "../../components/welcome/Pages/Page1";
import Page2 from "../../components/welcome/Pages/Page2";
import Page3 from "../../components/welcome/Pages/Page3";
import Page4 from "../../components/welcome/Pages/Page4";
import Loading from "../../components/common/Loading";
import languages from "../../utils/languages.json";
import PointsIndicator from "../../components/welcome/PointsIndicator";
import { checkLanguage, saveData } from "../../utils/globalVariables/utils";
import { StyleSheet, View, PanResponder } from "react-native";
import React, { useEffect, useRef, useState } from "react";

interface WelcomeProps {
  navigation: any;
}

const Welcome: React.FC<WelcomeProps> = ({ navigation }) => {
  const maxPages = 4;
  const [page, setPage] = useState<number>(1);
  const [lang, setLang] = useState<LanguageKeys>("en");
  const [loading, setLoading] = useState<boolean>(true);
  const [renderPage, setRenderPage] = useState<number>(1);

  const animationsPages: SharedValue<number>[] = [
    useSharedValue(height * 2),
    useSharedValue(-width),
    useSharedValue(-width),
    useSharedValue(-height * 1.5),
  ];

  const getTranslations = () => languages[lang as LanguageKeys];

  const focusAnimation = Array.from({ length: maxPages }, () =>
    useSharedValue(1)
  );

  const renderPageFunc = (value: number) => {
    setTimeout(() => {
      setRenderPage(value);
    }, 1000);
  };

  const next = () => {
    setPage((prev) => {
      const value = prev < maxPages ? prev + 1 : prev;
      renderPageFunc(value);
      return value;
    });
  };

  const less = () => {
    setPage((prev) => {
      const value = prev > 1 ? prev - 1 : prev;
      renderPageFunc(value);
      return value;
    });
  };

  const changePage = (value: number) => {
    setPage(value);
    setTimeout(() => {
      setRenderPage(value);
    }, 1000);
  };

  //While scrolling more/less than +- 20 px in x, or more/less than +- 100 px in y
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) =>
        Math.abs(gestureState.dx) > 20 || Math.abs(gestureState.dy) > 80,
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 20) less();
        else if (gestureState.dx < -20) next();
        else if (gestureState.dy > 100 || gestureState.dy < -100)
          changePage(maxPages);
      },
    })
  ).current;

  useEffect(() => {
    const loadLanguage = async () =>
      setLang((await checkLanguage()) as LanguageKeys);
    saveData(FIRST_TIME_LOADING_APP, JSON.stringify(false));

    animationsPages[0].value = withSpring(0, { damping: 15, stiffness: 50 });
    focusAnimation[0].value = withSpring(1.3, { damping: 15, stiffness: 50 });
    loadLanguage();
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

    if (loading)
      setTimeout(() => {
        setLoading(false);
      }, 1000);
  }, [page]);

  if (loading)
    return <Loading boolActivityIndicator={true} boolLoadingText={false} />;

  const tranlations = getTranslations();

  return (
    <View style={styles.container}>
      {/* Indicadores de página */}
      <PointsIndicator
        focusAnimation={focusAnimation}
        maxPages={maxPages}
        setPage={changePage}
        page={page}
      />

      {(renderPage == 1 || page == 1) && (
        <Page1
          setPage={changePage}
          maxPages={maxPages}
          translations={tranlations}
          panResponder={panResponder}
          animationsPages={animationsPages}
          boolLoaded={renderPage == 1 && page == 1}
        />
      )}

      {(renderPage == 2 || page == 2) && (
        <Page2
          boolLoaded={renderPage == 2 && page == 2}
          animationsPages={animationsPages}
          panResponder={panResponder}
          translations={tranlations}
          maxPages={maxPages}
          setPage={changePage}
        />
      )}

      {(renderPage == 3 || page == 3) && (
        <Page3
          maxPages={maxPages}
          setPage={changePage}
          translations={tranlations}
          panResponder={panResponder}
          animationsPages={animationsPages}
          boolLoaded={renderPage == 3 && page == 3}
        />
      )}

      {(renderPage == 4 || page == 4) && (
        <Page4
          signIn={() => navigation.replace("Signin")}
          boolLoaded={renderPage == 4 && page == 4}
          animationsPages={animationsPages}
          panResponder={panResponder}
          translations={tranlations}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e0f7fa",
  },
});

export default Welcome;
