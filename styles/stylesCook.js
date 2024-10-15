import { StyleSheet } from "react-native";
import { width } from "../components/globalVariables";

export default stylesCook = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingTop: 20,
  },
  scrollViewOrders: {
    width: width,
    padding: 20,
  },
  texts: {
    fontSize: 18,
    fontWeight: "bold",
  },
  viewByOrder: {
    backgroundColor: "gray",
    margin: 10,
    padding: 10,
    flexDirection: "row",
  },
  containerNumberOrder: {
    backgroundColor: "violet",
    margin: 15,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    flex: 1 / 8,
  },
  order: {
    backgroundColor: "purple",
    padding: 30,
    margin: 15,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  orderCharacteristics: {
    padding: 30,
    flex: 1,
    margin: 15,
    backgroundColor: "blueviolet",
    alignItems: "center",
    justifyContent: "center",
  },
  orderContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    flex: 1,
  },
  buttonReady: {
    backgroundColor: "green",
    padding: 15,
    margin: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  noOrdersLeft: {
    fontSize: 18,
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  textRestaurant: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
  },
});
