import {
  BOOL_LOG_OUT,
  TOKEN_KEY_STORAGE,
  RESTAURANT_NAME_KEY_STORAGE,
} from "../../utils/globalVariables/constants";
import React from "react";
import { Translations } from "../../utils/interfaceTranslations";
import { saveData, removeDataSecure } from "../../utils/globalVariables/utils";
import { Text, StyleSheet, Alert, Platform, Pressable } from "react-native";

interface LogOutProps {
  navigation: any;
  top?: number;
  bottom?: number;
  translations: Translations;
}

/**
 * LogOut component that handles user logout functionality.
 *
 * @param {Object} props - The properties object.
 * @param {Object} props.navigation - The navigation object for navigating between screens.
 * @param {number} [props.top=30] - The top position of the button. Default 30
 * @param {number} [props.bottom=null] - The bottom position of the button.
 * @param {Object} props.translations - The translations object containing localized strings.
 *
 * @returns {JSX.Element} The rendered LogOut component.
 */
const LogOut: React.FC<LogOutProps> = ({
  navigation,
  top = 30,
  bottom = null,
  translations,
}) => {
  const logOut = async () => {
    await removeDataSecure(RESTAURANT_NAME_KEY_STORAGE);
    await removeDataSecure(TOKEN_KEY_STORAGE);
    await saveData(BOOL_LOG_OUT, JSON.stringify(true));
    if (Platform.OS == "web") {
      alert(translations.logOutSuccess);
      navigation.replace("Login");
    }
    Alert.alert(translations.logOut, translations.logOutSuccess, [
      {
        text: translations.ok,
        onPress: () => navigation.replace("Login"),
      },
    ]);
  };
  const askLogOut = async () =>
    Alert.alert(translations.logOut, translations.askLogOut, [
      {
        text: translations.ok,
        onPress: logOut,
      },
      {
        text: translations.cancel,
      },
    ]);

  if (Platform.OS != "ios" && Platform.OS != "android") return null;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        {
          top: !bottom ? top : null,
          bottom: bottom,
          opacity: pressed ? 0.5 : 1,
        },
      ]}
      onPress={() => askLogOut()}
    >
      <Text style={styles.texts}>{translations.logOut}</Text>
    </Pressable>
  );
};

export default LogOut;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    position: "absolute",
    left: 5,
    zIndex: 2,
  },
  texts: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
