import {
  checkLanguage,
  TOKEN_KEY_STORAGE,
  RESTAURANT_NAME_KEY_STORAGE,
  loadDataSecure,
  ROLE_STORAGE_KEY,
  appName,
  saveDataSecure,
  removeDataSecure,
} from "../components/globalVariables";
import Orders from "../components/Orders";
import LogOut from "../components/LogOut";
import Loading from "../components/Loading";
import languages from "../components/languages.json";
import stylesCook from "../styles/stylesCook";
import ErrorComponent from "../components/ErrorComponent";
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import AlertModel from "../components/AlertModel";

const Cook = ({ navigation }) => {
  //? Change this if another thing should be load before show the screen
  const thingsToLoad = 3;
  const [lang, setLang] = useState("en");
  const [role, setRole] = useState(null);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [onOkText, setOnOkText] = useState(null);
  const [errorText, setErrorText] = useState(null);
  const [onOk, setOnOk] = useState(() => () => {});
  const [thingsLoaded, setThingsLoaded] = useState(0);
  const [onCancelText, setOnCancelText] = useState(null);
  const [onCancel, setOnCancel] = useState(() => () => {});
  const [restaurantName, setRestaurantName] = useState(null);
  const getTranslations = () => languages[lang] || languages["en"];

  useEffect(() => {
    const loadLanguage = async () => {
      setLang(await checkLanguage());
      setThingsLoaded((prev) => prev + 1);
    };

    const loadToken = async () => {
      setToken(await loadDataSecure(TOKEN_KEY_STORAGE));
      setThingsLoaded((prev) => prev + 1);
    };

    const loadRestaurantName = async () => {
      setRestaurantName(await loadDataSecure(RESTAURANT_NAME_KEY_STORAGE));
      setThingsLoaded((prev) => prev + 1);
    };

    const loadRole = async () => {
      setRole(await loadDataSecure(ROLE_STORAGE_KEY));
      setThingsLoaded((prev) => prev + 1);
    };

    loadLanguage();
    loadToken();
    loadRole();
    loadRestaurantName();
  }, []);

  const askLogOut = () => {
    const translations = getTranslations();
    setTitle(translations.logOut);
    setMessage(translations.askLogOut);
    setOnOkText(translations.logOut);
    setOnCancelText(translations.cancel);
    setOnOk(() => () => {
      setVisible(false);
      logOut(navigation);
    });
    setOnCancel(() => () => setVisible(false));
    setVisible(true);
  };

  const logOut = async (navigation) => {
    setTitle(translations.logOut);
    setMessage(translations.logOutSuccess);
    setOnOk(() => () => navigation.replace("Login"));
    setOnOkText(translations.ok);
    setVisible(true);
    await removeDataSecure(TOKEN_KEY_STORAGE);
  };

  useEffect(() => {
    if (thingsLoaded >= thingsToLoad) setLoading(false);
  }, [thingsLoaded]);

  if (loading) return <Loading progress={thingsLoaded / thingsToLoad} />;

  if (error) {
    return (
      <ErrorComponent
        navigation={navigation}
        component="Cook"
        error={errorText}
      />
    );
  }

  const translations = getTranslations();

  return (
    <View style={stylesCook.container}>
      <AlertModel
        onOk={onOk}
        title={title}
        visible={visible}
        message={message}
        OkText={onOkText}
        onCancel={onCancel}
        cancelText={onCancelText}
      />

      {/*//? Header */}
      <View style={stylesCook.header}>
        <Pressable
          style={({ pressed }) => [
            stylesCook.buttonLogOut,
            { opacity: pressed ? 0.7 : 1 },
          ]}
          onPress={askLogOut}
        >
          <Text style={stylesCook.logOutText}>{translations.logOut}</Text>
        </Pressable>
        <Text style={stylesCook.headerTitle}>{appName}</Text>
      </View>

      {/* //! Change comandas to translations.comandas and add the translations */}
      <Text style={stylesCook.sectionTitle}>COMANDAS</Text>

      {/*//? LogOut */}
      <LogOut navigation={navigation} translations={translations} />

      {/*//? ScrollView for every orders */}
      <ScrollView style={stylesCook.scrollViewOrders}>
        <Orders restaurantName={restaurantName} translations={translations} />
      </ScrollView>
    </View>
  );
};

export default Cook;
