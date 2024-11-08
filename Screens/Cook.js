import {
  loadData,
  calculateTime,
  checkLanguage,
  TOKEN_KEY_STORAGE,
  RESTAURANT_NAME_KEY_STORAGE,
} from "../components/globalVariables";
import ErrorComponent from "../components/ErrorComponent";
import LogOut from "../components/LogOut";
import Loading from "../components/Loading";
import languages from "../components/languages.json";
import stylesCook from "../styles/stylesCook";
import { deleteOrderDB, loadOrders } from "../components/DataBaseConnection";
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";

const Cook = ({ navigation }) => {
  const thingsToLoad = 3;
  const [lang, setLang] = useState("en");
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState(null);
  const [loadingText, setLoadingText] = useState("Loading.");
  const [thingsLoaded, setThingsLoaded] = useState(0);
  const [restaurantName, setRestaurantName] = useState(null);
  const [orders, setOrders] = useState(
    JSON.stringify({
      1: {
        order: "5 Burger, 4 fries, 6 cocas",
        characteristics: "1 burger without ketchup, fries with a lot of sal",
        orderTime: "2024-09-27T03:07:54.670Z",
      },
      2: {
        order: "Burger",
        characteristics: "Burgers without ketchup",
        orderTime: "2024-09-27T03:07:54.670Z",
      },
      3: {
        order: "Burger",
        characteristics: "Burgers without ketchup",
        orderTime: "2024-09-27T03:07:54.670Z",
      },
      4: {
        order: "Burger",
        characteristics: "Burgers without ketchup",
        orderTime: "2024-09-27T03:07:54.670Z",
      },
      5: {
        order: "Burger",
        characteristics: "Burgers without ketchup",
        orderTime: "2024-09-27T03:07:54.670Z",
      },
      6: {
        order: "Burger",
        characteristics: "Burgers without ketchup",
        orderTime: "2024-09-27T03:07:54.670Z",
      },
    })
  );
  const getTranslations = () => languages[lang] || languages["en"];

  const loadOrdersCook = async () => {
    console.log("LoadingOrders");
    if (restaurantName != null) {
      const { success, orders, error } = await loadOrders(restaurantName);
      if (success && orders) setOrders(JSON.stringify(orders));
      else if (error) console.error(error);
    }
  };

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

  useEffect(() => {
    const loadLanguage = async () => {
      setLang(await checkLanguage());
      setThingsLoaded((prev) => prev + 1);
    };
    const loadToken = async () => {
      setToken(await loadData(TOKEN_KEY_STORAGE));
      setThingsLoaded((prev) => prev + 1);
    };
    const loadRestaurantName = async () => {
      setRestaurantName(await loadData(RESTAURANT_NAME_KEY_STORAGE));
      setThingsLoaded((prev) => prev + 1);
    };

    loadLanguage();
    loadToken();
    loadRestaurantName();
  }, []);

  useEffect(() => {
    let timer;
    if (thingsLoaded >= thingsToLoad) setLoading(false);
    else
      timer = setTimeout(() => {
        setLoadingText((prev) => {
          if (prev === "Loading.") return "Loading..";
          else if (prev === "Loading..") return "Loading...";
          return "Loading.";
        });
      }, 750);
    return () => clearTimeout(timer);
  }, [loadingText]);

  useEffect(() => {
    loadOrdersCook();

    const interval = setInterval(async () => {
      await loadOrdersCook();
    }, 15000);

    return () => clearInterval(interval);
  }, [restaurantName]);

  if (loading)
    return (
      <Loading
        progress={
          thingsLoaded / thingsToLoad > 1 ? 1 : thingsLoaded / thingsToLoad
        }
      />
    );

  if (error)
    return (
      <ErrorComponent
        navigation={navigation}
        component="Cook"
        error={errorText}
      />
    );

  const translations = getTranslations();

  const Orders = () =>
    Object.entries(JSON.parse(orders)).map(([key, value], index) => (
      <View key={index} style={stylesCook.viewByOrder}>
        <View style={stylesCook.containerNumberOrder}>
          <Text style={stylesCook.texts}>
            {translations.orderText} {key}
          </Text>
          <Text style={stylesCook.texts}>
            {calculateTime(value["orderTime"])} {translations.minAgo}
          </Text>
        </View>
        <View style={stylesCook.orderContainer}>
          <View style={stylesCook.order}>
            <Text style={stylesCook.texts}>
              {value["order"].split(", ").join("\n")}
            </Text>
          </View>
          <View style={stylesCook.orderCharacteristics}>
            <Text style={stylesCook.texts}>
              {value["characteristics"].split(", ").join("\n")}
            </Text>
          </View>
          <Pressable
            style={({ pressed }) => [
              stylesCook.buttonReady,
              { opacity: pressed ? 0.5 : 1 },
            ]}
            onPress={() => deleteOrder(key)}
          >
            <Text style={stylesCook.texts}>
              {translations.ready} {key}
            </Text>
          </Pressable>
        </View>
      </View>
    ));

  return (
    <View style={stylesCook.container}>
      <Text style={stylesCook.textRestaurant}>{restaurantName}</Text>
      <Text style={stylesCook.texts}>{translations.cookText}</Text>

      <LogOut navigation={navigation} translations={translations} />

      {orders == null && (
        <Text style={stylesCook.noOrdersLeft}>{translations.noOrdersLeft}</Text>
      )}

      <ScrollView style={stylesCook.scrollViewOrders}>
        {orders != null && <Orders />}
      </ScrollView>
    </View>
  );
};

export default Cook;
