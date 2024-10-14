import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import {
  checkLanguage,
  RESTAURANT_NAME_KEY_STORAGE,
  TOKEN_KEY_STORAGE,
  BOOL_LOG_OUT,
  saveData,
} from "./globalVariables";
import languages from "./languages.json";
import { useEffect, useState } from "react";

export default LogOut = ({ navigation, top, bottom }) => {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const loadLanguage = async () => {
      const language = await checkLanguage();
      if (language && languages.languages.indexOf(language) > -1)
        setLanguage(language);
    };
    loadLanguage();
  }, []);

  if (top == null && bottom == null) top = 30;
  if (bottom != null && top != null) bottom = null;
  const logOut = async () => {
    await AsyncStorage.removeItem(RESTAURANT_NAME_KEY_STORAGE);
    await AsyncStorage.removeItem(TOKEN_KEY_STORAGE);
    await saveData(BOOL_LOG_OUT, "1");
    Alert.alert(languages[language].logOut, languages[language].logOutSuccess, [
      {
        text: languages[language].ok,
        onPress: () => navigation.replace("Login"),
      },
    ]);
  };

  return (
    <TouchableOpacity
      style={[styles.button, { top: top, bottom: bottom }]}
      onPress={() => logOut()}
    >
      <Text style={styles.texts}>{languages[language].logOut}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  texts: {
    fontSize: 18,
    fontWeight: "bold",
  },
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
  },
});
