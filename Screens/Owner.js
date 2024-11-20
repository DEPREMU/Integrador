import Animated, {
  runOnJS,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import {
  Text,
  View,
  Alert,
  Pressable,
  ScrollView,
  BackHandler,
} from "react-native";
import {
  width,
  appName,
  checkLanguage,
  loadDataSecure,
  tableNameErrorLogs,
  RESTAURANT_NAME_KEY_STORAGE,
  loadData,
  BOOL_ANIMATIONS,
} from "../components/globalVariables";
import Menu from "./Menu";
import Sales from "../components/Sales";
import LogOut from "../components/LogOut";
import Loading from "../components/Loading";
import languages from "../components/languages.json";
import AlertModel from "../components/AlertModel";
import EachCuadro from "../components/EachCuadro";
import ErrorComponent from "../components/ErrorComponent";
import DeleteRestaurant from "../components/DeleteRestaurant";
import { insertInTable } from "../components/DataBaseConnection";
import { useFocusEffect } from "@react-navigation/native";
import EmployesManagement from "../components/EmployesManagement";
import { styleOwner as styles } from "../styles/stylesScreenOwner";
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
  const [boolDeleteRestaurant, setBoolDeleteRestaurant] = useState(false);

  const getTranslations = () => languages[lang] || languages.en;
  const onCancelDeleteRestaurant = () => setBoolDeleteRestaurant(false);

  //? Confirm delete restaurant to show page with the delete
  const confirmDeleteRestaurant = () => {
    const translations = getTranslations();
    setVisible(true);
    setTitle(translations.deleteRestaurant);
    setMessage(translations.deleteRestaurantConfirmation);
    setOnOk(() => () => {
      setVisible(false);
      setBoolDeleteRestaurant(true);
    });
    setOnCancel(() => () => setVisible(false));
    setOkText(translations.deleteRestaurant);
    setCancelText(translations.cancel);
    setOnCancel(() => () => {
      setVisible(false);
    });
  };

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

  //? Load data
  useEffect(() => {
    const loadLanguage = async () => {
      setLang(await checkLanguage());
      setThingsLoaded((prev) => prev + 1);
    };

    const loadAnimation = async () => {
      const bool = await loadData(BOOL_ANIMATIONS);
      setBoolAnimations(JSON.parse(bool));
      if (!bool) animatedValue.value = 0;
    };

    const loadRestaurantName = async () => {
      try {
        const data = await loadDataSecure(RESTAURANT_NAME_KEY_STORAGE);
        setRestaurantName(data);
      } catch (error) {
        setError(true);
        setErrorText(`Error loading restaurant name ${error}`);
        await insertInTable(tableNameErrorLogs, {
          appName: appName,
          error: `Error loading restaurant name ${error}`,
          date: new Date().toLocaleString(),
          component: `./Owner/useEffect/loadRestaurantName() catch (error) => Error loading restaurant name: ${error}`,
        });
      } finally {
        setThingsLoaded((prev) => prev + 1);
      }
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

  if (boolDeleteRestaurant) {
    return (
      <Animated.View style={{ flex: 1, left: animatedValue }}>
        <DeleteRestaurant
          translations={translations}
          navigation={navigation}
          onCancel={onCancelDeleteRestaurant}
          restaurantName={restaurantName}
        />
      </Animated.View>
    );
  }
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

      <ScrollView style={styles.scrollView}>
        <EachCuadro
          texts={[restaurantName, translations.ownerText]}
          onPress={() => setEasterEgg((prev) => prev + 1)}
        />

        <EachCuadro
          texts={[translations.weeklySales]}
          onPress={() => animateValueTo("WS")}
        />

        <EachCuadro
          texts={[translations.employesManagement]}
          onPress={() => animateValueTo("EM")}
        />

        <EachCuadro
          texts={[translations.restaurantManagement]}
          onPress={() => animateValueTo("RM")}
        />

        <EachCuadro
          texts={[translations.extraOptions]}
          onPress={() => navigation.navigate("Settings")}
        />

        <View style={styles.viewDeleteRestaurant}>
          <Pressable
            style={styles.buttonDeleteRestaurant}
            onPress={confirmDeleteRestaurant}
          >
            <Text style={styles.textDeleteRestaurant}>
              {translations.deleteRestaurant}
            </Text>
          </Pressable>
        </View>
        <LogOut top={30} navigation={navigation} translations={translations} />
      </ScrollView>
    </Animated.View>
  );
};

export default Owner;
