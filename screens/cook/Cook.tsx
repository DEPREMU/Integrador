import {
  checkLanguage,
  loadDataSecure,
  removeDataSecure,
} from "../../utils/globalVariables/utils";
import {
  appName,
  ROLE_STORAGE_KEY,
  TOKEN_KEY_STORAGE,
  RESTAURANT_NAME_KEY_STORAGE,
} from "../../utils/globalVariables/constants";
import Orders from "../../components/Orders";
import LogOut from "../../components/common/LogOut";
import Loading from "../../components/common/Loading";
import languages from "../../utils/languages.json";
import stylesCook from "../../styles/stylesCook";
import AlertModel from "../../components/common/AlertModel";
import ErrorComponent from "../../components/common/ErrorComponent";
import { Translations } from "../../utils/interfaceTranslations";
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";

type CookProps = {
  navigation: any;
};

const Cook: React.FC<CookProps> = ({ navigation }) => {
  //? Change this if another thing should be load before show the screen
  const thingsToLoad = 3;
  const [lang, setLang] = useState("en");
  const [role, setRole] = useState<string | null>(null);
  const [onOk, setOnOk] = useState<any>(() => () => {});
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>("");
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string | null>("");
  const [onCancel, setOnCancel] = useState<any>(() => () => {});
  const [onOkText, setOnOkText] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [thingsLoaded, setThingsLoaded] = useState<number>(0);
  const [onCancelText, setOnCancelText] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState<string | null>(null);
  const getTranslations = () => {
    const langKey = languages.languages.includes(lang)
      ? (lang as "en" | "es" | "fr" | "jp")
      : "en";
    return languages[langKey];
  };

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

  const logOut = async (navigation: any) => {
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
        title={title || "Title"}
        visible={visible}
        message={message || "Message"}
        OkText={onOkText || "Ok"}
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
      <LogOut
        navigation={navigation}
        translations={translations as Translations}
      />

      {/*//? ScrollView for every orders */}
      <ScrollView style={stylesCook.scrollViewOrders}>
        {restaurantName != null && (
          <Orders
            restaurantName={restaurantName}
            translations={translations as Translations}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default Cook;
