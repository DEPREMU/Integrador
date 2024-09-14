import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import {
  checkLanguage,
  RESTAURANT_NAME_KEY_STORAGE,
  TOKEN_KEY_STORAGE,
  BOOL_LOG_OUT,
} from "./globalVariables";
import languages from "./languages.json";

export default LogOut = ({ navigation }) => {
  const logOut = async () => {
    await AsyncStorage.removeItem(RESTAURANT_NAME_KEY_STORAGE);
    await AsyncStorage.removeItem(TOKEN_KEY_STORAGE);
    await AsyncStorage.setItem(BOOL_LOG_OUT, "1");
    const language = await checkLanguage();
    Alert.alert(languages.logOut[language], languages.logOutSuccess[language], [
      {
        text: languages.ok[language],
      },
    ]);
    navigation.navigate("Login");
  };

  return (
    <TouchableOpacity style={styles.button} onPress={() => logOut()}>
      <Text style={styles.texts}>LogOut</Text>
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
    top: 30,
  },
});
