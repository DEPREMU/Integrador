import { StyleSheet } from "react-native";
import { widthDivided, heightDivided } from "../components/globalVariables";

const stylesMC1 = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-evenly",
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
    justifyContent: "center",
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
    justifyContent: "space-evenly",
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
  pickerIOS: {
    height: 200,
    width: "100%",
  },
});

const stylesMC = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#F0F4F8", // Fondo suave y moderno
  },
  container: {
    flex: 1,
    padding: 20,
    width: "100%",
    maxWidth: 600,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  imageUser: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: "cover",
  },
  text: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
    textShadowColor: "#aaa",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  formLogin: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  user: {
    marginBottom: 15,
  },
  textUser: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginBottom: 5,
  },
  textInputUser: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#333",
    backgroundColor: "#FAFAFA",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  pass: {
    marginBottom: 15,
  },
  textPass: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginBottom: 5,
  },
  textInputPass: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#333",
    backgroundColor: "#FAFAFA",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  roles: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
    marginVertical: 10,
  },
  pickerContainer: {
    marginBottom: 20,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  picker: {
    width: "100%",
  },
  pickerIOS: {
    height: 150,
    width: "100%",
  },
  newAccountView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  newAccountText: {
    fontSize: 14,
    color: "#555",
    marginRight: 5,
  },
  textSignin: {
    fontSize: 14,
    color: "#007BFF",
    textDecorationLine: "underline",
  },
  signInButton: {
    backgroundColor: "#6F42C1",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  signInText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default stylesMC;
