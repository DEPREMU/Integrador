import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dimensions, View, Text, ActivityIndicator } from "react-native";
import * as Localization from "expo-localization";
import languages from "../components/languages.json";
import uuid from "react-native-uuid";
import { Bar } from "react-native-progress";
import { TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";

const userImage = require("../assets/userImage.png");
const BOOL_LOG_OUT = "@boolLogOut";
const USER_KEY_STORAGE = "@userName";
const TOKEN_KEY_STORAGE = "@tokenUser";
const LANGUAGE_KEY_STORAGE = "@language";
const RESTAURANT_NAME_KEY_STORAGE = "@restaurantName";
const { width, height } = Dimensions.get("window");
const generateToken = () => uuid.v4();
const widthDivided = (num) => width / num;
const heightDivided = (num) => height / num;

const checkLanguage = async () => {
  try {
    const data = await loadData(LANGUAGE_KEY_STORAGE);
    const languageAvailable = languages.languages.indexOf(data);
    if (data && languageAvailable > -1) return data;

    const locales = Localization.getLocales();
    const language = locales[0].languageTag.split("-")[0];
    const languageAvailable1 = languages.languages.indexOf(language);
    if (language && languageAvailable1) {
      await saveData(LANGUAGE_KEY_STORAGE, "en");
      return language;
    }
  } catch (error) {
    console.error("Language: " + error);
  }
  return "en";
};

const loadData = async (key) => {
  return await AsyncStorage.getItem(key);
};

const loadDataInDict = async (keys) => {
  try {
    const data = {};
    for (let index = 0; index < keys.length; index++) {
      data[keys[index]] = await AsyncStorage.getItem(keys[index]);
    }
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const saveData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch (error) {
    return false;
  }
};

const saveDataFromArray = async (keys, values) => {
  try {
    for (let index = 0; index < keys.length; index++) {
      await AsyncStorage.setItem(keys[index], values[index]);
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const saveDataFromDict = async (data) => {
  try {
    const savePromises = Object.keys(data).map(async (key) => {
      await AsyncStorage.setItem(key, data[key]);
    });
    await Promise.all(savePromises);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const saveDataJSON = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Renders a loading component with optional loading text and progress.
 *
 * @param {Object} props - The component props.
 * @param {string} props.loadingText - The text to display while loading.
 * @param {number} props.progress - The progress value (between 0 and 1).
 * @returns {JSX.Element} The rendered loading component.
 */
const Loading = ({ loadingText, progress }) => {
  if (loadingText == null) loadingText = "";
  if (progress == null) progress = 0;
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 18, textAlign: "center", marginVertical: 5 }}>
        {loadingText}
      </Text>
      {/* <ActivityIndicator size="large" color="#0000ff" /> */}
      <Bar
        progress={progress}
        width={200}
        height={15}
        color="#3b5998"
        unfilledColor="#e0e0e0"
        borderWidth={0}
      />
    </View>
  );
};

/**
 * Error component.
 *
 * @param {Object} props - The component props.
 * @param {string} props.error - The error message.
 * @param {Object} props.navigation - The navigation object.
 * @param {string} [props.component="Login"] - The component name. Default: Login.
 * @returns {JSX.Element} The rendered Error component.
 */
const Error = ({ error, navigation, component = "Login" }) => {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const loadLanguage = async () => {
      const language = await checkLanguage();
      if (language && languages.languages.indexOf(language) > -1)
        setLanguage(language);
    };
    loadLanguage();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 18, textAlign: "center" }}>{error}</Text>
      {navigation && (
        <TouchableOpacity
          style={{
            backgroundColor: "gray",
            borderRadius: 5,
            padding: 10,
            marginVertical: 10,
          }}
          onPress={() => navigation.replace(component)}
        >
          <Text
            style={{
              color: "white",
              fontSize: 18,
            }}
          >
            {languages[language].retry}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

/**
 * Interpolates a message string with variables.
 *
 * @param {string} message - The message string to interpolate.
 * @param {Array} variables - The variables to replace in the message string.
 * @returns {string} - The interpolated message string.
 * @example
 * const message = `Hello ${0}` welcome to ${1}!";
 * const variables = ["Tester", "our app"];
 * const interpolatedMessage = interpolateMessage(message, variables);
 * console.log(interpolatedMessage); // Output: "Hello Teste, welcome to our app!"
 */
const interpolateMessage = (message, variables) => {
  return String(message).replace(/\$\{(\w+)\}/g, (match, key) => {
    const index = parseInt(key);
    return variables[index] !== undefined ? variables[index] : match;
  });
};

export {
  BOOL_LOG_OUT,
  USER_KEY_STORAGE,
  TOKEN_KEY_STORAGE,
  LANGUAGE_KEY_STORAGE,
  RESTAURANT_NAME_KEY_STORAGE,
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
  interpolateMessage,
  saveDataFromArray,
  saveDataFromDict,
  loadDataInDict,
};
