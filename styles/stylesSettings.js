import { StyleSheet } from "react-native";
import { width, widthDivided } from "../components/globalVariables";

export default stylesSettings = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingTop: 20,
  },
  texts: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonBack: {
    position: "absolute",
    left: 5,
    backgroundColor: "gray",
    padding: 10,
    top: 35,
    borderRadius: 5,
  },
  settings: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  settingsView: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 30,
  },
  languagesView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  languagesButton: {
    backgroundColor: "#0000FF",
    borderRadius: 5,
  },
  textLanguages: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    padding: 10,
  },
  languages: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    height: 100,
  },
  saveText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 5,
  },
  saveConfirm: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
  },
  buttonsSaveData: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  viewModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  viewModal: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    width: widthDivided(1.3),
    borderWidth: 1,
    borderStyle: "solid",
  },
  buttonCancel: {
    flex: 1,
    backgroundColor: "#FF0000",
    padding: 10,
    borderRadius: 5,
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonConfirm: {
    flex: 1,
    backgroundColor: "#00FF00",
    padding: 10,
    borderRadius: 5,
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  picker: {
    width: 150,
    height: 50,
  },
  viewPicker: {
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: "#DDDDDD",
    padding: 10,
    borderRadius: 10,
  },
  buttonSave: {
    padding: 10,
    width: width,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "gray",
  },
});
