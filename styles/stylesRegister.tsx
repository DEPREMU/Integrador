import { StyleSheet } from "react-native";

export const stylesRegister = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9", // Light background color for the container
    padding: 20,
  },
  header: {
    padding: 15,
    backgroundColor: "#007BFF", // Blue background color for the header
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  scrollViewStyle: {
    flex: 1,
    marginBottom: 20,
  },
  scrollViewContent: {
    paddingBottom: 20, // Adds padding at the bottom of the scrollable content
  },
  viewByOrder: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  containerNumberOrder: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  textOrderNumber: {
    fontSize: 16,
    color: "#333",
  },
  textTimeAgo: {
    fontSize: 14,
    color: "#777", // Light gray color for the time ago text
  },
  orderContainer: {
    marginTop: 10,
  },
  order: {
    marginBottom: 15,
  },
  orderCharacteristics: {
    marginBottom: 15,
  },
  textTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  texts: {
    fontSize: 16,
    color: "#555",
    lineHeight: 22, // To add spacing between lines for readability
  },
  buttonReady: {
    backgroundColor: "#28a745", // Green button color
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
