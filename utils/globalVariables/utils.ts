import uuid from "react-native-uuid";
import bcrypt from "react-native-bcrypt";
import CryptoJS from "crypto-js";
import languages from "../languages.json";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../database/supabaseClient";
import { Platform } from "react-native";
import { appName, LANGUAGE_KEY_STORAGE, saltHashPassword, tableNameErrorLogs, width } from "./constants";
import * as SecureStore from "expo-secure-store";
import * as Localization from "expo-localization";

const generateToken = () => uuid.v4();
const widthDivided = (num: number): number => width / num;

const hashPassword = (password: string): string =>
  bcrypt.hashSync(password, saltHashPassword);

const verifyPassword = (
  originalPassword: string,
  inputPassword: string
): boolean => bcrypt.compareSync(inputPassword, originalPassword);

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

const removeData = async (key: string) => await AsyncStorage.removeItem(key);

const removeDataSecure = async (key: string) => {
  try {
    if (Platform.OS == "web") localStorage.removeItem(key);
    else await SecureStore.deleteItemAsync(key);
  } catch (error) {}
};
const loadData = async (key: string) => await AsyncStorage.getItem(key);

const loadDataSecure = async (key: string) => {
  if (Platform.OS != "web") return await SecureStore.getItemAsync(key);

  const value = localStorage.getItem(key);
  if (!value) return null;
  const uncryptedValue = CryptoJS.AES.decrypt(
    value,
    Constants.expoConfig?.extra?.SECRET_KEY_TO_ENCRYPT
  ).toString(CryptoJS.enc.Utf8);
  return uncryptedValue;
};

const saveData = async (key: string, value: any) =>
  await AsyncStorage.setItem(key, value);

const saveDataSecure = async (key: string, value: any) => {
  try {
    if (Constants.expoConfig == null || Constants.expoConfig.extra == undefined)
      return;

    if (Platform.OS == "web") {
      const secretKey = Constants.expoConfig.extra.SECRET_KEY_TO_ENCRYPT;
      const encryptedValue = CryptoJS.AES.encrypt(value, secretKey);
      localStorage.setItem(key, encryptedValue.toString());
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  } catch (error) {
    console.error(`./globalVariables/saveDataSecure() => ${error}`);
    await insertInTable(tableNameErrorLogs, {
      appName: appName,
      error: `./globalVariables/saveDataSecure() => ${error}`,
      date: new Date().toLocaleString(),
      component: `./globalVariables/saveDataSecure() catch (error) => SaveDataSecure: ${error}`,
    });
  }
};

const saveDataJSON = async (key: string, value: any) => {
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

const saveDataSecureJSON = async (key: string, value: any) => {
  try {
    if (Platform.OS == "web") {
      const encryptedValue = CryptoJS.AES.encrypt(
        JSON.stringify(value),
        Constants.expoConfig?.extra?.SECRET_KEY_TO_ENCRYPT
      );
      return localStorage.setItem(key, encryptedValue.toString());
    }
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
 * @param {string} message - The message string to interpolate, must contain ${n} where n is the index inside arrTexts.
 * @param {Array} arrTexts - The variables to replace in the message string.
 * @returns {string} - The interpolated message string.
 * @example
 * const message = `Hello ${0}` welcome to ${1}!";
 * const variables = ["Tester", "our app"];
 * const interpolatedMessage = interpolateMessage(message, arrTexts);
 * console.log(interpolatedMessage); // Output: "Hello Tester, welcome to our app!"
 */
const interpolateMessage = (message: string, arrTexts: string[]) =>
  String(message).replace(/\$\{(\d+)\}/g, (match, key) =>
    arrTexts[key] ? arrTexts[key] : match
  );

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
const calculateTime = (orderTime: Date | string) => {
  const timeOrder = new Date(orderTime);
  const diff: number = new Date().getTime() - timeOrder.getTime();
  const minutes = Math.floor(diff / 60000);
  return minutes;
};

const insertInTable = async (
  tableName: string,
  dict: { [key: string]: any }
): Promise<null | Error> => {
  try {
    await supabase.from(tableName).insert(dict);
  } catch (error) {
    return error as Error;
  }
  return null;
};

const getStartOfWeek = (date: Date | string): Date => {
  date = new Date(date);
  const dayOfWeek = date.getDay(); // 0 = domingo, 1 = lunes, ..., 6 = sábado
  const diff = date.getDate() - dayOfWeek + (dayOfWeek == 0 ? -6 : 1); // Si es domingo, restamos 6 días
  const startOfWeek = new Date(date.setDate(diff));
  startOfWeek.setHours(0, 0, 0, 0); // Aseguramos que la hora sea las 00:00
  return startOfWeek;
};

export {
  loadData,
  saveData,
  removeData,
  hashPassword,
  saveDataJSON,
  widthDivided,
  checkLanguage,
  calculateTime,
  generateToken,
  getStartOfWeek,
  verifyPassword,
  saveDataSecure,
  loadDataSecure,
  removeDataSecure,
  interpolateMessage,
  saveDataSecureJSON,
};
