import { StyleSheet } from "react-native";
import { width, widthDivided } from "../components/globalVariables";

const stylesSettings = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: "#f7f8fa", // Fondo de color claro
  },
  settingsView: {
    marginBottom: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  texts: {
    fontSize: 16,
    color: "#4a4a4a", // Gris oscuro para texto
    textAlign: "center",
    fontFamily: "Roboto-Regular", // Fuentes modernas
  },
  textsTitles: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333", // Gris más oscuro para títulos
    marginBottom: 15,
    fontFamily: "Roboto-Medium", // Negrita para títulos
  },
  buttonBack: {
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 25,
    backgroundColor: "#1E88E5", // Azul vibrante para el botón de "Back"
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    position: "absolute",
    left: 10,
  },
  settings: {
    fontSize: 16,
    color: "#fff", // Blanco para el texto
    fontWeight: "bold",
    fontFamily: "Roboto-Bold",
  },
  viewPicker: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  picker: {
    backgroundColor: "#f2f2f2",
    marginTop: 12,
    paddingHorizontal: 15,
    fontFamily: "Roboto-Regular",
  },
  animations: {
    marginTop: 20,
    marginBottom: 40,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },
  buttonSave: {
    paddingVertical: 14,
    paddingHorizontal: 25,
    backgroundColor: "#28a745", // Verde para el botón de "Guardar"
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  switch: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }], // Agrandar el switch un poco para hacerlo más visible
  },
  scrollView: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f7f8fa",
  },
});

export default stylesSettings;
