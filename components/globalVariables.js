import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dimensions, View, Text, ActivityIndicator } from "react-native";
import * as Localization from "expo-localization";
import languages from "../components/languages.json";
import uuid from "react-native-uuid";
import { Bar } from "react-native-progress";
import { TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import bcrypt from "react-native-bcrypt";

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

const saltHashPassword = bcrypt.genSaltSync(10);
const hashPassword = (password) => bcrypt.hashSync(password, saltHashPassword);
const verifyPassword = (originalPassword, inputPassword) =>
  bcrypt.compareSync(inputPassword, originalPassword);

const checkLanguage = async () => {
  try {
    const data = await loadData(LANGUAGE_KEY_STORAGE);
    if (data) return data;

    const locales = Localization.getLocales()[0];
    const language = locales.languageTag.split("-")[0];
    const languageAvailable = languages.languages.indexOf(language) > -1;
    if (language && languageAvailable) {
      await saveData(LANGUAGE_KEY_STORAGE, language);
      return language;
    }
  } catch (error) {
    console.error("Language: " + error);
  }
  return "en";
};

const removeData = async (key) => await AsyncStorage.removeItem(key);

const loadData = async (key) => await AsyncStorage.getItem(key);

const loadDataInDict = async (keys) => {
  if (typeof keys != "object" || (keys && keys.length == 0)) return null;
  const data = {};
  keys.forEach(async (key) => {
    data[key] = await AsyncStorage.getItem(key);
  });
  return data;
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
    const savePromises = Object.entries(keys).map(async (key, index) => {
      await AsyncStorage.setItem(key, values[index]);
    });
    await Promise.all(savePromises);
    return true;
  } catch (error) {
    console.error(error);
  }
  return false;
};

const saveDataFromDict = async (data) => {
  try {
    const savePromises = Object.keys(data).map(async ([key, value]) => {
      await AsyncStorage.setItem(key, value);
    });
    await Promise.all(savePromises);
    return true;
  } catch (error) {
    console.error(error);
  }
  return false;
};

const saveDataJSON = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {}
  return false;
};

/**
 * Renders a loading component with optional loading text and progress.
 *
 * @param {Object} props - The component props.
 * @param {string} props.loadingText - The text to display while loading. Null won't show the text
 * @param {number} props.progress - The progress value (between 0 and 1). Null won't show the Bar
 * @param {boolean} props.boolActivityIndicator - The boolean to show ActivityIndicator. Default false
 * @returns {JSX.Element} The rendered loading component.
 */
const Loading = ({ loadingText, progress, boolActivityIndicator = false }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {loadingText != null && (
        <Text style={{ fontSize: 18, textAlign: "center", marginVertical: 5 }}>
          {loadingText}
        </Text>
      )}
      {boolActivityIndicator && (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
      {progress != null && (
        <Bar
          progress={progress}
          width={200}
          height={15}
          color="#3b5998"
          unfilledColor="#e0e0e0"
          borderWidth={0}
        />
      )}
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
    const loadLanguage = async () => setLanguage(await checkLanguage());
    loadLanguage();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 18, textAlign: "center" }}>{error}</Text>
      {navigation != null && (
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
  return String(message).replace(/\$\{(\d+)\}/g, (match, key) => {
    const index = parseInt(key, 10);
    return variables[index] !== undefined ? variables[index] : match;
  });
};

/**
 * Calculates the time difference in minutes from the given order time to the current time.
 *
 * @param {string} orderTime - The order time in a format recognized by the Date constructor (yyyy-mm-ddTHH:MM:SSZ).
 * @returns {number} - The time difference in minutes.
 * @example
 * **Current time 2024-09-27T12:10:00Z**
 * const orderTime = "2024-09-27T12:00:00Z";
 * const minutesPassed = calculateTime(orderTime);
 * console.log(minutesPassed); // Output: 10
 */
const calculateTime = (orderTime) => {
  const timeOrder = new Date(orderTime);
  const diff = new Date() - timeOrder;
  const minutes = Math.floor(diff / 60000);
  return minutes;
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
  removeData,
  userImage,
  checkLanguage,
  generateToken,
  interpolateMessage,
  saveDataFromArray,
  saveDataFromDict,
  loadDataInDict,
  calculateTime,
  hashPassword,
  verifyPassword,
  saltHashPassword,
};
