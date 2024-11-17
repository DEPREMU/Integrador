import {
  View,
  Text,
  Alert,
  Animated,
  Pressable,
  ScrollView,
  BackHandler,
  Image,
} from "react-native";
import {
  appName,
  loadData,
  widthDivided,
  checkLanguage,
  tableNameErrorLogs,
  RESTAURANT_NAME_KEY_STORAGE,
  loadDataSecure,
} from "../components/globalVariables";
import ErrorComponent from "../components/ErrorComponent";
import LogOut from "../components/LogOut";
import Loading from "../components/Loading";
import languages from "../components/languages.json";
import { styleOwner as styles } from "../styles/stylesScreenOwner";
import AlertModel from "../components/AlertModel";
import DeleteRestaurant from "../components/DeleteRestaurant";
import { insertInTable } from "../components/DataBaseConnection";
import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState, useRef, useCallback } from "react";
import EachCuadro from "../components/EachCuadro";
import EmployesManagement from "../components/EmployesManagement";
import Sales from "../components/Sales";
import Menu from "./Menu";

const Owner = ({ navigation }) => {
  const [rotate] = useState(new Animated.Value(0));
  const thingsToLoad = 2;
  const widthDividedBy2_25 = widthDivided(2.25);
  const [lang, setLang] = useState("en");
  const [onOk, setOnOk] = useState(() => () => {});
  const [error, setError] = useState(false);
  const [title, setTitle] = useState("Title");
  const [OkText, setOkText] = useState("Ok");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Message");
  const [visible, setVisible] = useState(false);
  const [onCancel, setOnCancel] = useState(() => () => {});
  const [errorText, setErrorText] = useState(null);
  const [showPage, setShowPage] = useState("MP");
  const [cancelText, setCancelText] = useState(null);
  const [loadingText, setLoadingText] = useState("Loading.");
  const [boolShowLeft, setBoolShowLeft] = useState(false);
  const [thingsLoaded, setThingsLoaded] = useState(0);
  const [restaurantName, setRestaurantName] = useState();
  const [boolDeleteRestaurant, setBoolDeleteRestaurant] = useState(false);
  const showLeftAnimation = useRef(
    new Animated.Value(-widthDividedBy2_25)
  ).current;
  const getTranslations = () => languages[lang] || languages.en;

  const confirmDeleteRestaurant = () => {
    const translations = getTranslations();
    setVisible(true);
    setTitle(translations.deleteRestaurant);
    setMessage(translations.deleteRestaurantConfirmation);
    setOnOk(() => () => {
      setBoolDeleteRestaurant(true);
      setVisible(false);
    });
    setOnCancel(() => () => setVisible(false));
    setOkText(translations.deleteRestaurant);
    setCancelText(translations.cancel);
    setOnCancel(() => () => {
      setVisible(false);
    });
  };

  const onCancelDeleteRestaurant = () => setBoolDeleteRestaurant(false);

  useEffect(() => {
    const loadLanguage = async () => {
      setLang(await checkLanguage());
      setThingsLoaded((prev) => prev + 1);
    };
    const loadRestaurantName = async () => {
      try {
        const data = await loadDataSecure(RESTAURANT_NAME_KEY_STORAGE);
        setRestaurantName(data || "Prueba");
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
    loadRestaurantName();
  }, []);

  useEffect(() => {
    if (!loading || thingsLoaded >= thingsToLoad) setLoading(false);

    let timer = setTimeout(() => {
      setLoadingText((prev) => {
        if (prev === "Loading.") return "Loading..";
        if (prev === "Loading..") return "Loading...";
        return "Loading.";
      });
    }, 750);
    return () => clearTimeout(timer);
  }, [loadingText]);

  useEffect(() => {
    Animated.timing(showLeftAnimation, {
      toValue: boolShowLeft ? 0 : -widthDividedBy2_25,
      duration: 500,
      useNativeDriver: false,
    }).start();
    Animated.timing(rotate, {
      toValue: !boolShowLeft ? 0 : 180, //Colocar 180 o 540
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [boolShowLeft]);

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

  const changePage = (page) => setShowPage(page);

  if (loading)
    return (
      <Loading
        progress={
          thingsLoaded / thingsToLoad > 1 ? 1 : thingsLoaded / thingsToLoad
        }
      />
    );
  if (error)
    return (
      <ErrorComponent
        error={errorText || ""}
        component="Owner"
        navigation={navigation}
      />
    );

  const translations = getTranslations();

  if (boolDeleteRestaurant)
    return (
      <DeleteRestaurant
        translations={translations}
        navigation={navigation}
        onCancel={onCancelDeleteRestaurant}
        restaurantName={restaurantName}
      />
    );

  if (showPage == "EM")
    return (
      <EmployesManagement
        returnToMP={() => changePage("MP")}
        translations={translations}
        restaurantName={restaurantName}
      />
    );
  else if (showPage == "WS")
    return (
      <Sales
        translations={translations}
        returnToBackPage={() => changePage("MP")}
        restaurantName={restaurantName}
      />
    );
  else if (showPage == "RM")
    return (
      <Menu
        translations={translations}
        onPressToReturn={() => changePage("MP")}
      />
    );

  return (
    <View style={styles.container}>
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
          onPress={() => setRestaurantName((prev) => prev + "1")}
        />
        <EachCuadro
          texts={[translations.weeklySales]}
          onPress={() => changePage("WS")}
        />
        <EachCuadro
          texts={[translations.employesManagement]}
          onPress={() => changePage("EM")}
        />
        <EachCuadro
          texts={[translations.restaurantManagement]}
          onPress={() => changePage("RM")}
        />
        <EachCuadro
          texts={[translations.extraOptions]}
          onPress={() => navigation.navigate("Settings")}
        />
      </ScrollView>
    </View>
  );
};

export default Owner;
