import { Settings, StyleSheet, Platform } from "react-native";
import { widthDivided } from "../components/globalVariables";

export default stylesHS = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "black",
  },
  settings: {
    width: Platform.OS === "android" ? widthDivided(4) : widthDivided(3),
    position: "absolute",
    left: 0,
    top: 0,
    marginTop: Platform.OS === "android" ? 30 : 20,
  },
  imageUser: {
    width: widthDivided(2),
    height: widthDivided(2),
    borderRadius: Platform.OS === "android" ? "100%" : "90%",
  },
});
