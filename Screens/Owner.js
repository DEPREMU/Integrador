import Animated, {
  runOnJS,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import {
  width,
  IDsImage,
  loadData,
  userImage,
  exitImage,
  cutleryImage,
  settingsImage,
  registerImage,
  checkLanguage,
  loadDataSecure,
  BOOL_ANIMATIONS,
  removeDataSecure,
  ROLE_STORAGE_KEY,
  TOKEN_KEY_STORAGE,
  RESTAURANT_NAME_KEY_STORAGE,
} from "../components/globalVariables";
import Menu from "./Menu";
import Sales from "../components/Sales";
import Loading from "../components/Loading";
import languages from "../components/languages.json";
import AlertModel from "../components/AlertModel";
import EachRectangle from "../components/EachRectangle";
import ErrorComponent from "../components/ErrorComponent";
import { useFocusEffect } from "@react-navigation/native";
import EmployesManagement from "../components/EmployesManagement";
import { styleOwner as styles } from "../styles/stylesScreenOwner";
import { Alert, ScrollView, BackHandler } from "react-native";
import React, { useEffect, useState, useCallback } from "react";

const Owner = ({ navigation }) => {
  const thingsToLoad = 2;
  const animatedValue = useSharedValue(-width);
  const animatedValueMP = useSharedValue(0);
  const [lang, setLang] = useState("en");
  const [onOk, setOnOk] = useState(() => () => {});
  const [error, setError] = useState(false);
  const [title, setTitle] = useState("Title");
  const [OkText, setOkText] = useState("Ok");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Message");
  const [visible, setVisible] = useState(false);
  const [onCancel, setOnCancel] = useState(() => () => {});
  const [showPage, setShowPage] = useState("MP");
  const [easterEgg, setEasterEgg] = useState(0);
  const [errorText, setErrorText] = useState(null);
  const [cancelText, setCancelText] = useState(null);
  const [thingsLoaded, setThingsLoaded] = useState(0);
  const [boolAnimations, setBoolAnimations] = useState(null);
  const [restaurantName, setRestaurantName] = useState();

  const getTranslations = () => languages[lang] || languages.en;

  //? Animate to show page
  const animateValueTo = (page) => {
    if (!boolAnimations) {
      animatedValue.value = 0;
      setShowPage(page);
      return;
    }
    if (page == "MP")
      animatedValue.value = withTiming(-width, { duration: 300 }, () =>
        runOnJS(setShowPage)(page)
      );
    else
      animatedValueMP.value = withTiming(width * 2, { duration: 300 }, () => {
        runOnJS(setShowPage)(page);
      });
  };

  const logOut = async (navigation) => {
    try {
      await removeDataSecure(ROLE_STORAGE_KEY);
      await removeDataSecure(TOKEN_KEY_STORAGE);
      await removeDataSecure(RESTAURANT_NAME_KEY_STORAGE);
      setOnOk(() => () => navigation.replace("Login"));
      setCancelText(null);
      setMessage(translations.logOutSeeYouSoon);
      setTitle(translations.logOutSuccess);
      setOkText(translations.ok);
      setVisible(true);
    } catch (error) {
      console.error(error);
    }
  };

  const askLogOut = (navigation) => {
    try {
      const translations = getTranslations();
      setTitle(translations.logOut);
      setMessage(translations.askLogOut);
      setOkText(translations.logOut);
      setCancelText(translations.cancel);
      setOnOk(() => async () => {
        setVisible(false);
        await logOut(navigation);
      });
      setOnCancel(() => () => setVisible(false));
      setVisible(true);
    } catch (error) {
      console.error(error);
    }
  };

  //? Load all data
  useEffect(() => {
    const loadLanguage = async () => {
      setLang(await checkLanguage());
      setThingsLoaded((prev) => prev + 1);
    };

    const loadAnimation = async () => {
      const bool = await loadData(BOOL_ANIMATIONS);
      setBoolAnimations(bool ? true : false);
      if (!bool) animatedValue.value = 0;
    };

    const loadRestaurantName = async () => {
      const data = await loadDataSecure(RESTAURANT_NAME_KEY_STORAGE);
      setRestaurantName(data);
      setThingsLoaded((prev) => prev + 1);
    };

    loadLanguage();
    loadAnimation();
    loadRestaurantName();
  }, []);

  // Check if all data is loaded
  useEffect(() => {
    if (thingsLoaded >= thingsToLoad) setLoading(false);
  }, [thingsLoaded]);

  //? Check if animations are enabled and if it is enabled the animation will be shown
  useEffect(() => {
    if (!boolAnimations) return;
    if (showPage == "MP")
      animatedValueMP.value = withTiming(0, { duration: 300 });
    else if (showPage != "MP")
      animatedValue.value = withTiming(0, { duration: 300 });
  }, [showPage]);

  //? Easter egg
  useEffect(() => {
    let timer;
    const multiplier = 5;
    const firstEGG = easterEgg == multiplier;
    const secondEGG = easterEgg == multiplier * 2;
    const thirdEGG = easterEgg == multiplier * 3;
    const fouthEGG = easterEgg == multiplier * 4;
    const fifthEGG = easterEgg == multiplier * 5;
    const sixthEGG = easterEgg == multiplier * 6;

    if (firstEGG) {
      const translations = getTranslations();
      setTitle(translations.easterEgg);
      setMessage(translations.easterEggMessage1);
      setOkText(translations.ok);
      setOnOk(() => () => setVisible(false));
      setVisible(true);
      timer = setTimeout(() => {
        setEasterEgg(0);
      }, 6000);
    } else if (secondEGG) {
      const translations = getTranslations();
      setTitle(translations.easterEgg);
      setMessage(translations.easterEggMessage2);
      setOkText(translations.ok);
      setOnOk(() => () => setVisible(false));
      setVisible(true);
      timer = setTimeout(() => {
        setEasterEgg(0);
      }, 6000);
    } else if (thirdEGG) {
      const translations = getTranslations();
      setTitle(translations.easterEgg);
      setMessage(translations.easterEggMessage3);
      setOkText(translations.ok);
      setOnOk(() => () => setVisible(false));
      setVisible(true);
      timer = setTimeout(() => {
        setEasterEgg(0);
      }, 6000);
    } else if (fouthEGG) {
      const translations = getTranslations();
      setTitle(translations.easterEgg);
      setMessage(translations.easterEggMessage4);
      setOkText(translations.ok);
      setOnOk(() => () => setVisible(false));
      setVisible(true);
      timer = setTimeout(() => {
        setEasterEgg(0);
      }, 6000);
    } else if (fifthEGG) {
      const translations = getTranslations();
      setTitle(translations.easterEgg);
      setMessage(translations.easterEggMessage5);
      setOkText(translations.ok);
      setOnOk(() => () => setVisible(false));
      setVisible(true);
      timer = setTimeout(() => {
        setEasterEgg(0);
      }, 6000);
    } else if (sixthEGG) {
      const translations = getTranslations();
      setTitle(translations.easterEgg);
      setMessage(translations.easterEggMessage6);
      setOkText(translations.ok);

      setOnOk(() => () => setVisible(false));
      setVisible(true);
      timer = setTimeout(() => {
        setEasterEgg(0);
      }, 6000);
    }

    if (easterEgg > 0 && !firstEGG)
      timer = setTimeout(() => {
        setEasterEgg(0);
      }, 2000);

    return () => clearInterval(timer);
  }, [easterEgg]);

  //? Back button to exit app
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        const translations = getTranslations();
        Alert.alert(translations.exitText, translations.exitAppConfirmation, [
          {
            text: translations.cancel,
            onPress: () => null,
          },
          {
            text: translations.exitText,
            onPress: () => BackHandler.exitApp(),
          },
        ]);
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [lang])
  );

  if (loading) {
    return (
      <Loading progress={thingsLoaded / thingsToLoad} boolLoadingText={true} />
    );
  }
  if (error) {
    return (
      <ErrorComponent
        error={errorText}
        component="Owner"
        navigation={navigation}
      />
    );
  }

  const translations = getTranslations();

  if (showPage == "EM") {
    return (
      <Animated.View style={{ flex: 1, left: animatedValue }}>
        <EmployesManagement
          returnToMP={() => animateValueTo("MP")}
          translations={translations}
          restaurantName={restaurantName}
        />
      </Animated.View>
    );
  }
  if (showPage == "WS") {
    return (
      <Animated.View style={{ flex: 1, left: animatedValue }}>
        <Sales
          translations={translations}
          returnToBackPage={() => animateValueTo("MP")}
          restaurantName={restaurantName}
        />
      </Animated.View>
    );
  }
  if (showPage == "RM") {
    return (
      <Animated.View style={{ flex: 1, left: animatedValue }}>
        <Menu
          translations={translations}
          onPressToReturn={() => animateValueTo("MP")}
        />
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.container, { left: animatedValueMP }]}>
      <AlertModel
        visible={visible}
        title={title}
        message={message}
        onOk={onOk}
        onCancel={onCancel}
        OkText={OkText}
        cancelText={cancelText}
      />

      <ScrollView
        contentContainerStyle={{
          flex: 1,
          paddingVertical: 20,
          justifyContent: "flex-start",
        }}
      >
        <EachRectangle
          texts={[restaurantName, translations.ownerText]}
          onPress={() => setEasterEgg((prev) => prev + 1)}
          imageVariable={userImage}
        />

        <EachRectangle
          texts={[translations.weeklySales]}
          onPress={() => animateValueTo("WS")}
          imageVariable={registerImage}
        />

        <EachRectangle
          texts={[translations.employesManagement]}
          onPress={() => animateValueTo("EM")}
          imageVariable={IDsImage}
        />

        <EachRectangle
          texts={[translations.restaurantManagement]}
          onPress={() => animateValueTo("RM")}
          imageVariable={cutleryImage}
        />

        <EachRectangle
          texts={[translations.extraOptions]}
          onPress={() => navigation.navigate("Settings")}
          imageVariable={settingsImage}
        />

        <EachRectangle
          texts={[translations.logOut]}
          onPress={() => askLogOut(navigation)}
          imageVariable={exitImage}
        />
      </ScrollView>
    </Animated.View>
  );
};

export default Owner;
