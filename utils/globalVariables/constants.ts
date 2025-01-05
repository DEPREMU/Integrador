import bcrypt from "react-native-bcrypt";
import { Dimensions } from "react-native";
import languages from "../languages.json";

const appName = "Order.by";
const tableNameErrorLogs = "ErrorLogs";
const saltHashPassword = bcrypt.genSaltSync(10);
const { width, height } = Dimensions.get("window");

export type LanguageKeys = Exclude<
  keyof typeof languages,
  "languages" | "languagesNames"
>;

//? Images / Videos
const fontApp = require("../../assets/fonts/Acumin.ttf");
const IDsImage = require("../../assets/IDsImage.png");
const userImage = require("../../assets/userImage.png");
const exitImage = require("../../assets/exitImage.png");
const plusImage = require("../../assets/plusImage.png");
const eyeLooking = require("../../assets/videos/eyeLooking.mp4");
const appLogoImage = require("../../assets/appLogoImage.png");
const appNameImage = require("../../assets/appNameImage.png");
const cutleryImage = require("../../assets/cutleryImage.png");
const settingsImage = require("../../assets/settingsImage.png");
const registerImage = require("../../assets/registerImage.png");
const eyeNotLooking = require("../../assets/icons/eyeNotLooking.png");
const fontAppItalic = require("../../assets/fonts/AcuminItalic.ttf");
const substractImage = require("../../assets/substractImage.png");

//? Separators
const separatorForDB = "&&%$&&";
const separatorForDB2 = "%%!^$%%";
const separatorForDB3 = "$^**^$";

//? Storage keys Async
const BOOL_LOG_OUT = "@boolLogOut";
const BOOL_ANIMATIONS = "@boolAnimations";
const USER_KEY_STORAGE = "@userName";
const LANGUAGE_KEY_STORAGE = "@language";
const FIRST_TIME_LOADING_APP = "@firstTimeLoadingApp";

//? Storage keys SecureStorage
const ROLE_STORAGE_KEY = "_role";
const TOKEN_KEY_STORAGE = "_tokenUser";
const RESTAURANT_NAME_KEY_STORAGE = "_restaurantName";

export {
  width,
  height,
  appName,
  fontApp,
  IDsImage,
  userImage,
  exitImage,
  plusImage,
  eyeLooking,
  appLogoImage,
  appNameImage,
  cutleryImage,
  BOOL_LOG_OUT,
  settingsImage,
  registerImage,
  eyeNotLooking,
  fontAppItalic,
  separatorForDB,
  substractImage,
  separatorForDB2,
  separatorForDB3,
  BOOL_ANIMATIONS,
  saltHashPassword,
  ROLE_STORAGE_KEY,
  USER_KEY_STORAGE,
  TOKEN_KEY_STORAGE,
  tableNameErrorLogs,
  LANGUAGE_KEY_STORAGE,
  FIRST_TIME_LOADING_APP,
  RESTAURANT_NAME_KEY_STORAGE,
};
