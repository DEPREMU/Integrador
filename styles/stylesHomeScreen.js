import { StyleSheet } from "react-native";
import { widthDivided, heightDivided } from "../components/globalVariables";

export default stylesHS = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 30,
  },
  imageUser: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  formLogin: {
    width: widthDivided(1.1),
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 10,
  },
  user: {
    marginBottom: 15,
  },
  textUser: {
    fontSize: 16,
    marginBottom: 5,
  },
  textInputUser: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 5,
    padding: 10,
  },
  pass: {
    marginBottom: 15,
  },
  textPass: {
    fontSize: 16,
    marginBottom: 5,
  },
  textInputPass: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 5,
    padding: 10,
  },
  newAccountView: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 15,
  },
  newAccountText: {
    fontSize: 16,
  },
  textSignin: {
    fontSize: 16,
    color: "#007BFF",
    marginLeft: 5,
    textDecorationLine: "underline",
  },
  signInButton: {
    backgroundColor: "#28a745",
    borderRadius: 5,
    paddingVertical: 15,
    alignItems: "center",
  },
  signInText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  checklistItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  checklistText: {
    fontSize: 16,
    marginRight: 10,
  },
  ViewRemeberMe: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: -10,
  },
  rememberMeText: {
    fontSize: 18,
    color: "#333",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  roles: {
    fontSize: 16,
    marginBottom: 5,
  },
});
