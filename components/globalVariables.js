import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dimensions, View, Text } from "react-native";
import * as Localization from "expo-localization";
import languages from "../components/languages.json";
import uuid from "react-native-uuid";

const generateToken = () => {
  return uuid.v4();
};
const locales = Localization.getLocales();
const LANGUAGE_KEY_STORAGE = "@language";
const TOKEN_KEY_STORAGE = "@tokenUser";
const RESTAURANT_NAME_KEY_STORAGE = "@restaurantName";
const BOOL_LOG_OUT = "@boolLogOut";

const checkLanguage = async () => {
  try {
    const data = await AsyncStorage.getItem(LANGUAGE_KEY_STORAGE);
    if (data != null && data in languages.languages) return data;
    await AsyncStorage.setItem(LANGUAGE_KEY_STORAGE, "en");
    const language = locales[0].languageTag.split("-")[0];
    if (language in languages.languages) return language;
    return "en";
  } catch (error) {
    console.error(error);
    return "en";
  }
};

const { width, height } = Dimensions.get("window");
const widthDivided = (num) => width / num;
const heightDivided = (num) => height / num;
const userImage = require("../assets/userImage.png");

const loadData = async (key) => {
  try {
    const data = await AsyncStorage.getItem(key);
    if (data != null) return data;
    return null;
  } catch (error) {
    console.error(error);
  }
};

const saveData = async () => {
  const data = await AsyncStorage.setItem(key, value);
  if (value != null) return data;
  return null;
};
const saveDataJSON = async (key, value) => {
  const data = await AsyncStorage.setItem(key, JSON.stringify(value));
  if (data != null) return data;
  return null;
};

const Loading = ({ loadingText }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 18, textAlign: "Center" }}>{loadingText}</Text>
    </View>
  );
};
const Error = ({ error }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 18, textAlign: "Center" }}>
        Error cargando los componentes: {error}
      </Text>
    </View>
  );
};

const interpolateMessage = (message, variables, separator) => {
  if (separator == null) separator == " ";
  return String(message).replace(/\$\{(\w+)\}/g, variables.join(separator));
};

export {
  width,
  height,
  widthDivided,
  heightDivided,
  Loading,
  Error,
  loadData,
  saveData,
  saveDataJSON,
  userImage,
  checkLanguage,
  generateToken,
  TOKEN_KEY_STORAGE,
  interpolateMessage,
  RESTAURANT_NAME_KEY_STORAGE,
  LANGUAGE_KEY_STORAGE,
  BOOL_LOG_OUT,
};
