import uuid from "react-native-uuid";
import bcrypt from "react-native-bcrypt";
import languages from "../components/languages.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dimensions } from "react-native";
import * as SecureStore from "expo-secure-store";
import * as Localization from "expo-localization";

const appName = "RestaurantApp";
const userImage = require("../assets/userImage.png");
const BOOL_LOG_OUT = "@boolLogOut";
const ROLE_STORAGE_KEY = "_role";
const USER_KEY_STORAGE = "@userName";
const TOKEN_KEY_STORAGE = "_tokenUser";
const tableNameErrorLogs = "ErrorLogs";
const LANGUAGE_KEY_STORAGE = "@language";
const FIRST_TIME_LOADING_APP = "@firstTimeLoadingApp";
const RESTAURANT_NAME_KEY_STORAGE = "_restaurantName";

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
    console.error(`./globalVariables/checkLanguage() => ${error}`);
    await insertInTable(tableNameErrorLogs, {
      appName: appName,
      error: `./globalVariables/checkLanguage() => ${error}`,
      date: new Date().toLocaleString(),
      component: `./globalVariables/checkLanguage() catch (error) => Language: ${error}`,
    });
  }
  return "en";
};

const removeData = async (key) => await AsyncStorage.removeItem(key);

const removeDataSecure = async (key) => await SecureStore.deleteItemAsync(key);

const loadData = async (key) => await AsyncStorage.getItem(key);

const loadDataSecure = async (key) => await SecureStore.getItemAsync(key);

const saveData = async (key, value) => await AsyncStorage.setItem(key, value);

const saveDataSecure = async (key, value) =>
  await SecureStore.setItemAsync(key, value);

const saveDataJSON = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    await insertInTable(tableNameErrorLogs, {
      appName: appName,
      error: `SaveDataJSON: ${error}`,
      date: new Date().toLocaleString(),
      component: `./globalVariables/saveDataJSON() catch (error) => SaveDataJSON: ${error}`,
    });
  }
  return false;
};

const saveDataSecureJSON = async (key, value) => {
  try {
    await SecureStore.setItemAsync(key, JSON.stringify(value));
    return true;
  } catch (error) {
    await insertInTable(tableNameErrorLogs, {
      appName: appName,
      error: `SaveDataJSON: ${error}`,
      date: new Date().toLocaleString(),
      component: `./globalVariables/saveDataJSON() catch (error) => SaveDataJSON: ${error}`,
    });
  }
  return false;
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

const insertInTable = async (tableName, dict) => {
  try {
    await supabase.from(tableName).insert(dict);
  } catch (error) {
    return error;
  }
  return null;
};

const getStartOfWeek = (date) => {
  if (!date) return null;
  date = new Date(date);
  const dayOfWeek = date.getDay(); // 0 = domingo, 1 = lunes, ..., 6 = sábado
  const diff = date.getDate() - dayOfWeek + (dayOfWeek == 0 ? -6 : 1); // Si es domingo, restamos 6 días
  const startOfWeek = new Date(date.setDate(diff));
  startOfWeek.setHours(0, 0, 0, 0); // Aseguramos que la hora sea las 00:00
  return startOfWeek;
};

export {
  width,
  height,
  appName,
  loadData,
  saveData,
  userImage,
  removeData,
  BOOL_LOG_OUT,
  hashPassword,
  saveDataJSON,
  widthDivided,
  checkLanguage,
  calculateTime,
  generateToken,
  heightDivided,
  getStartOfWeek,
  verifyPassword,
  saveDataSecure,
  loadDataSecure,
  saltHashPassword,
  removeDataSecure,
  ROLE_STORAGE_KEY,
  USER_KEY_STORAGE,
  TOKEN_KEY_STORAGE,
  interpolateMessage,
  saveDataSecureJSON,
  tableNameErrorLogs,
  LANGUAGE_KEY_STORAGE,
  FIRST_TIME_LOADING_APP,
  RESTAURANT_NAME_KEY_STORAGE,
};
