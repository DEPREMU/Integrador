import {
  View,
  Text,
  BackHandler,
  Alert,
  TouchableOpacity,
  Animated,
  ScrollView,
} from "react-native";
import styleOwner from "../styles/stylesScreenOwner";
import LogOut from "../components/LogOut";
import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  LANGUAGE_KEY_STORAGE,
  loadData,
  Loading,
  widthDivided,
  Error,
} from "../components/globalVariables";
import languages from "../components/languages.json";

const Owner = ({ navigation }) => {
  const [options, setOptions] = useState("0");
  const widthDividedBy2_25 = widthDivided(2.25);
  const [boolShowLeft, setBoolShowLeft] = useState(false);
  const showTextButton = ">";
  const showLeftAnimation = useRef(
    new Animated.Value(-widthDividedBy2_25)
  ).current;
  const [rotate] = useState(new Animated.Value(0));
  const rotateInterpolation = rotate.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });
  const [lang, setLang] = useState("en");
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Loading.");
  const [thingsLoaded, setThingsLoaded] = useState(0);
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState(null);
  const thingsToLoad = 1;
  const getTranslations = () => languages[lang] || languages.en;

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const language = await loadData(LANGUAGE_KEY_STORAGE);
        setLang(language);
      } catch {
        setLang("en");
      } finally {
        setThingsLoaded((prev) => prev + 1);
      }
    };

    loadLanguage();
  }, []);

  useEffect(() => {
    if (!loading || thingsLoaded >= thingsToLoad) setLoading(false);

    setTimeout(() => {
      setLoadingText((prev) => {
        if (prev === "Loading.") return "Loading..";
        if (prev === "Loading..") return "Loading...";
        return "Loading.";
      });
    }, 750);
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
        loadingText={loadingText}
        progress={
          thingsLoaded / thingsToLoad > 1 ? 1 : thingsLoaded / thingsToLoad
        }
      />
    );
  if (error) return <Error error={errorText || ""} />;

  const translations = getTranslations();

  return (
    <View style={styleOwner.container}>
      <View style={styleOwner.header}>
        <TouchableOpacity
          style={[styleOwner.buttonShow]}
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
        </TouchableOpacity>
        <Text style={[styleOwner.texts]}>{translations.ownerText}</Text>
      </View>

      <Animated.View
        style={[styleOwner.animatedView, { left: showLeftAnimation }]}
      >
        <ScrollView style={{ flex: 1 }}>
          <TouchableOpacity
            style={styleOwner.options}
            onPress={() => navigation.navigate("Settings")}
          >
            <Text style={styleOwner.textOptions}>
              {translations.settingsText}
            </Text>
            <Text style={[styleOwner.textOptions]}>{">"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styleOwner.options}
            onPress={() => setOptions("2")}
          >
            <Text style={styleOwner.textOptions}>Option 2</Text>
            <Text style={[styleOwner.textOptions]}>{">"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styleOwner.options}
            onPress={() => setOptions("3")}
          >
            <Text style={styleOwner.textOptions}>Option 3</Text>
            <Text style={[styleOwner.textOptions]}>{">"}</Text>
          </TouchableOpacity>
        </ScrollView>

        <LogOut navigation={navigation} bottom={100} />
      </Animated.View>
    </View>
  );
};

export default Owner;
