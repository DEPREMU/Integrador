import {
  View,
  Text,
  Alert,
  Animated,
  Pressable,
  ScrollView,
  BackHandler,
} from "react-native";
import {
  appName,
  loadData,
  widthDivided,
  checkLanguage,
  tableNameErrorLogs,
  RESTAURANT_NAME_KEY_STORAGE,
} from "../components/globalVariables";
import ErrorComponent from "../components/ErrorComponent";
import LogOut from "../components/LogOut";
import Loading from "../components/Loading";
import languages from "../components/languages.json";
import styleOwner from "../styles/stylesScreenOwner";
import AlertModel from "../components/AlertModel";
import DeleteRestaurant from "../components/DeleteRestaurant";
import { insertInTable } from "../components/DataBaseConnection";
import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState, useRef, useCallback } from "react";

const Owner = ({ navigation }) => {
  const thingsToLoad = 2;
  const showTextButton = ">";
  const widthDividedBy2_25 = widthDivided(2.25);
  const [lang, setLang] = useState("en");
  const [onOk, setOnOk] = useState(() => () => {});
  const [error, setError] = useState(false);
  const [title, setTitle] = useState("Title");
  const [OkText, setOkText] = useState("Ok");
  const [rotate] = useState(new Animated.Value(0));
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Message");
  const [options, setOptions] = useState("0");
  const [visible, setVisible] = useState(false);
  const [onCancel, setOnCancel] = useState(() => () => {});
  const [errorText, setErrorText] = useState(null);
  const [cancelText, setCancelText] = useState(null);
  const [loadingText, setLoadingText] = useState("Loading.");
  const [boolShowLeft, setBoolShowLeft] = useState(false);
  const [thingsLoaded, setThingsLoaded] = useState(0);
  const [restaurantName, setRestaurantName] = useState("");
  const [boolDeleteRestaurant, setBoolDeleteRestaurant] = useState(false);
  const showLeftAnimation = useRef(
    new Animated.Value(-widthDividedBy2_25)
  ).current;
  const rotateInterpolation = rotate.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });
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
        const data = await loadData(RESTAURANT_NAME_KEY_STORAGE);
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

  return (
    <View style={styleOwner.container}>
      <AlertModel
        visible={visible}
        title={title}
        message={message}
        onOk={onOk}
        onCancel={onCancel}
        OkText={OkText}
        cancelText={cancelText}
      />

      <View style={styleOwner.header}>
        <Pressable
          style={({ pressed }) => [
            styleOwner.buttonShow,
            { opacity: pressed ? 0.5 : 1 },
          ]}
          onPress={() => {
            setBoolShowLeft(!boolShowLeft);
          }}
        >
          <Animated.Text
            style={{
              textAlign: "center",
              fontSize: 20,
              transform: [{ rotate: rotateInterpolation }],
            }}
          >
            {showTextButton}
          </Animated.Text>
        </Pressable>
        <Text style={[styleOwner.texts]}>{translations.ownerText}</Text>
      </View>

      <Animated.View
        style={[styleOwner.animatedView, { left: showLeftAnimation }]}
      >
        <ScrollView style={{ flex: 1 }}>
          <Pressable
            style={({ pressed }) => [
              styleOwner.options,
              { opacity: pressed ? 0.5 : 1 },
            ]}
            onPress={() => navigation.navigate("Settings")}
          >
            <Text style={styleOwner.textOptions}>
              {translations.settingsText}
            </Text>
            <Text style={[styleOwner.textOptions]}>{">"}</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styleOwner.options,
              { opacity: pressed ? 0.5 : 1 },
            ]}
            onPress={() => setOptions("2")}
          >
            <Text style={styleOwner.textOptions}>Option 2</Text>
            <Text style={[styleOwner.textOptions]}>{">"}</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styleOwner.buttonDeleteRestaurant,
              { opacity: pressed ? 0.5 : 1 },
            ]}
            onPress={() => confirmDeleteRestaurant()}
          >
            <Text style={[styleOwner.textOptions, { color: "white" }]}>
              {translations.deleteRestaurant}
            </Text>
            <Text style={[styleOwner.textOptions]}>{">"}</Text>
          </Pressable>
        </ScrollView>

        <LogOut
          navigation={navigation}
          bottom={100}
          translations={translations}
        />
      </Animated.View>
    </View>
  );
};

export default Owner;
