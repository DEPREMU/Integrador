import { View, Text, Pressable, StyleSheet } from "react-native";
import { appName, calculateTime, tableNameErrorLogs } from "./globalVariables";
import { deleteOrderDB, insertInTable, loadOrders } from "./DataBaseConnection";
import { useEffect, useState } from "react";

const Orders = ({ translations, restaurantName }) => {
  const [orders, setOrders] = useState(
    JSON.stringify({
      1: {
        order: "dsdsds1",
        orderTime: "Wed Nov 20 2024 12:48:07 GMT-0600",
        characteristics: "dsdsds",
      },
      2: {
        order: "dsdsds2, sdsdsds",
        orderTime: "Wed Nov 20 2024 12:48:07 GMT-0600",
        characteristics: "dsdsds, sdsdsdsd",
      },
      3: {
        order: "dsdsds3, sdsdsds",
        orderTime: "Wed Nov 20 2024 12:48:07 GMT-0600",
        characteristics: "dsdsds, sdsdsdsd",
      },
      4: {
        order: "dsdsds4, sdsdsds",
        orderTime: "Wed Nov 20 2024 12:48:07 GMT-0600",
        characteristics: "dsdsds, sdsdsdsd",
      },
    })
  );

  //? Delete the order selected and organize the ids in a function from databaseConnection
  const deleteOrder = async (key) => {
    const ordersDict = JSON.parse(orders);
    delete ordersDict[key];
    const lengthOrders = Object.keys(ordersDict).length;
    if (lengthOrders > 0) setOrders(JSON.stringify(ordersDict));
    else setOrders(null);
    const { success, error } = await deleteOrderDB(restaurantName, key);
    if (success) await loadOrdersCook();
    else if (error) console.error(error);
  };

  //? Fetch all the orders using a function from databaseConnection
  const loadOrdersCook = async () => {
    if (!restaurantName) return;

    const { success, orders, error } = await loadOrders(restaurantName);
    if (success && orders) setOrders(JSON.stringify(orders));
    else if (error) {
      await insertInTable(tableNameErrorLogs, {
        appName: appName,
        error: `./Orders/loadOrdersCook() => ${error}`,
        date: new Date().toLocaleString(),
        component: `./Orders/loadOrdersCook() catch (error) => Orders: ${error}`,
      });
    }
  };

  useEffect(() => {
    loadOrdersCook();

    const interval = setInterval(async () => {
      await loadOrdersCook();
    }, 15000);

    return () => clearInterval(interval);
  }, [restaurantName]);

  //? No orders text
  if (orders == null)
    return (
      <Text style={stylesCook.noOrdersLeft}>{translations.noOrdersLeft}</Text>
    );

  return Object.entries(JSON.parse(orders)).map(([key, value]) => (
    <View key={key} style={stylesCook.viewByOrder}>
      <View style={stylesCook.containerNumberOrder}>
        <Text style={stylesCook.textOrderNumber}>
          {translations.orderText} {key}
        </Text>
        <Text style={stylesCook.textTimeAgo}>
          {calculateTime(value["orderTime"])} {translations.minAgo}
        </Text>
      </View>
      <View style={stylesCook.orderContainer}>
        <View style={stylesCook.order}>
          <Text style={stylesCook.textTitle}>
            {translations.orderText + "\n"}
          </Text>

          <Text style={stylesCook.texts}>
            {"\t" + value["order"].split(", ").join("\n\t")}
          </Text>
        </View>
        <View style={stylesCook.orderCharacteristics}>
          <Text style={stylesCook.textTitle}>{translations.notes + "\n"}</Text>

          <Text style={stylesCook.texts}>
            {"\t" + value["characteristics"].split(", ").join("\n\t")}
          </Text>
        </View>
        <Pressable
          style={({ pressed }) => [
            stylesCook.buttonReady,
            { opacity: pressed ? 0.5 : 1 },
          ]}
          onPress={() => deleteOrder(key)}
        >
          <Text style={stylesCook.buttonText}>
            {translations.ready} {key}
          </Text>
        </Pressable>
      </View>
    </View>
  ));
};

export default Orders;

const stylesCook = StyleSheet.create({
  viewByOrder: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginBottom: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  containerNumberOrder: {
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    paddingBottom: 10,
    borderBottomColor: "#e0e0e0",
  },
  texts: {
    fontSize: 18,
    color: "#555",
    lineHeight: 24,
  },
  textOrderNumber: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
  },
  textTimeAgo: {
    fontSize: 16,
    color: "#888",
    fontStyle: "italic",
    marginTop: 5,
  },
  orderContainer: {
    padding: 15,
    marginTop: 15,
  },
  order: {
    paddingBottom: 12,
  },
  textTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  orderCharacteristics: {
    paddingBottom: 18,
  },
  buttonReady: {
    backgroundColor: "#28a745",
    width: "70%",
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 15,
    alignSelf: "center",
    marginTop: 15,
    shadowColor: "#28a745",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
