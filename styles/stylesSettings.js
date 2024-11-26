import { StyleSheet } from "react-native";
import { width, widthDivided } from "../components/globalVariables";

export const stylesSettings = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  main: {
    flex: 6,
    padding: 20,
  },
  settingsView: {
    marginBottom: 20,
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  textsTitles: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  scrollView: {
    flex: 1,
    marginVertical: 10,
    borderRadius: 10,
  },
  viewPicker: {
    marginBottom: 25,
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  changeLanguage: {
    marginBottom: 15,
  },
  textLabel: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  animations: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#FFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  texts: {
    fontSize: 16,
    color: "#555",
  },
  buttonSave: {
    backgroundColor: "#6F42C1",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    shadowColor: "#6F42C1",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonTextSave: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
  buttonDeleteRestaurant: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
  },
  textDeleteRestaurant: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  viewDeleteRestaurant: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
});
