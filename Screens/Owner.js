import {
  View,
  Text,
  BackHandler,
  Alert,
  TouchableOpacity,
  Animated,
  ScrollView,
  Image,
} from "react-native";
import styleOwner from "../styles/stylesScreenOwner";
import LogOut from "../components/logOut";
import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState, useRef } from "react";
import {
  height,
  interpolateMessage,
  LANGUAGE_KEY_STORAGE,
  loadData,
  Loading,
  widthDivided,
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

  useEffect(() => {
    if (!loading) return;
    setTimeout(() => {
      if (loadingText == "Loading.") setLoadingText("Loading..");
      if (loadingText == "Loading..") setLoadingText("Loading...");
      if (loadingText == "Loading...") setLoadingText("Loading.");
    }, 1000);
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

  useEffect(() => {
    const loadLanguage = async () => {
      const language = await loadData(LANGUAGE_KEY_STORAGE);
      if (language != null) setLang(language);
    };
    try {
      loadLanguage();
    } catch (error) {
      setLang("en");
    } finally {
      setThingsLoaded(thingsLoaded + 1);
    }
  }, []);

  useEffect(() => {
    if (thingsLoaded == thingsToLoad) {
      setLoading(false);
    }
  }, [thingsLoaded]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = async () => {
        Alert.alert(
          languages.exitText[lang],
          languages.exitAppConfirmation[lang],
          [
            {
              text: languages.cancel[lang],
              onPress: () => null,
            },
            {
              text: languages.exitText[lang],
              onPress: () => BackHandler.exitApp(),
            },
          ]
        );
        return true;
      };
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  if (loading) return <Loading loadingText={loadingText} />;
  if (error) return <Error error={errorText != null ? errorText : ""} />;

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
              {languages.settingsText[lang]}
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
      <Text style={styleOwner.texts}>Owner</Text>
    </View>
  );
};

export default Owner;
