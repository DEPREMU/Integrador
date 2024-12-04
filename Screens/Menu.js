import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TextInput,
  Pressable,
  Image,
  BackHandler,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import languages from "../components/languages.json";
import {
  appName,
  checkLanguage,
  loadData,
  loadDataSecure,
  RESTAURANT_NAME_KEY_STORAGE,
  tableNameErrorLogs,
  userImage,
} from "../components/globalVariables";
import {
  getAllDataFromTable,
  insertInTable,
} from "../components/DataBaseConnection";
import Loading from "../components/Loading";
import MenuProducts from "../components/MenuProducts";
import ErrorComponent from "../components/ErrorComponent";
import EachRectangle from "../components/EachRectangle";
import NewDish from "../components/NewDish";
import Inventory from "../components/Inventory";

const Menu = ({ navigation, translations, onPressToReturn }) => {
  const thingsToLoad = 3;

  const [lang, setLang] = useState("en");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuData, setMenuData] = useState([]);
  const [boolNewDish, setBoolNewDish] = useState(false);
  const [thingsLoaded, setThingsLoaded] = useState(0);
  const [boolInventory, setBoolInventory] = useState(false);
  const [restaurantName, setRestaurantName] = useState(null);
  const getTranslations = () => translations || languages[lang] || languages.en;

  const fetchMenu = async () => {
    try {
      let restaurant;
      if (!restaurantName)
        restaurant = await loadDataSecure(RESTAURANT_NAME_KEY_STORAGE);

      const menuData = await getAllDataFromTable(`${restaurant}_menu`);
      if (menuData) setMenuData(JSON.stringify(menuData));
    } catch (error) {
      setError(error);
      await insertInTable(tableNameErrorLogs, {
        appName: appName,
        error: `An error occurred fetching menu: ${error}`,
        date: new Date().toLocaleString(),
        component: `./Screens/Menu/useEffect/fetchMenu() catch (error) => Error fetching menu: ${error}`,
      });
    }
  };
  const loadMenu = async () => {
    await fetchMenu();
    setThingsLoaded((prev) => prev + 1);
  };

  useEffect(() => {
    const loadLanguage = async () => {
      if (!translations) setLang(await checkLanguage());
      setThingsLoaded((prev) => prev + 1);
    };

    const loadRestaurantName = async () => {
      const data = await loadDataSecure(RESTAURANT_NAME_KEY_STORAGE);
      setRestaurantName(data);
      setThingsLoaded((prev) => prev + 1);
    };

    loadRestaurantName();
    loadLanguage();
    loadMenu();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      loadMenu();
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (thingsLoaded >= thingsToLoad) setLoading(false);
  }, [thingsLoaded]);

  if (loading) {
    return (
      <Loading
        boolActivityIndicator={true}
        progress={thingsLoaded / thingsToLoad}
      />
    );
  } else if (error)
    <ErrorComponent error={error} navigation={navigation} component="Menu" />;
  else if (boolNewDish) {
    return (
      <NewDish
        translations={translations}
        onPressToReturn={() => setBoolNewDish(false)}
        restaurantName={restaurantName}
        goToInventory={() => {
          setBoolInventory(true);
          setBoolNewDish(false);
        }}
      />
    );
  } else if (boolInventory) {
    return (
      <Inventory
        translations={translations}
        onPressToReturn={() => setBoolInventory(false)}
        restaurantName={restaurantName}
      />
    );
  }

  return (
    <View style={styles.container}>
      <EachRectangle
        texts={[restaurantName, translations.ownerText]}
        imageVariable={userImage}
        onPress={onPressToReturn}
      />
      <View style={styles.main}>
        <View style={styles.containerButtons}>
          <Pressable
            style={({ pressed }) => [
              styles.buttonAddNew,
              { opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={() => setBoolNewDish(true)}
          >
            <Text style={styles.headerText}>{translations.newDish}</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.buttonAddNew,
              { opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={() => setBoolInventory(true)}
          >
            <Text style={styles.headerText}>{translations.inventory}</Text>
          </Pressable>
        </View>

        <View style={styles.body}>
          <View style={styles.header}>
            <Text style={styles.headerText}>{translations.menu}</Text>
          </View>

          {menuData != null && (
            <MenuProducts
              restaurantName={restaurantName}
              menuData={menuData}
              translations={translations}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default Menu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  main: {
    flex: 5,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  header: {
    marginBottom: 20,
    backgroundColor: "#6F42C1",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6F42C1",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  headerText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonAddNew: {
    backgroundColor: "#6F42C1",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#6F42C1",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    flex: 1,
    margin: 5,
  },
  body: {
    flex: 1,
    maxWidth: "100%",
  },
  scrollView: {
    flex: 1,
    marginBottom: 20,
  },
  containerButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    marginBottom: 20,
  },
});
