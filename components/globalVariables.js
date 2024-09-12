import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dimensions, View, Text } from "react-native";

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
};
