import { StyleSheet } from "react-native";

const stylesCook = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#f4b000",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    top: 0,
  },
  headerTitle: {
    fontSize: 55,
    fontWeight: "bold",
    color: "#000",
  },
  sectionTitle: {
    fontSize: 30,
    textAlign: "center",
    marginVertical: 10,
  },
  scrollViewOrders: {
    width: "100%",
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
  buttonLogOut: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 10,
    margin: 20,
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  logOutText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default stylesCook;
