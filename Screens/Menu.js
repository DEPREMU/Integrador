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
} from "../components/globalVariables";
import {
  getAllDataFromTable,
  insertInTable,
} from "../components/DataBaseConnection";
import Loading from "../components/Loading";
import MenuProducts from "../components/MenuProducts";
import ErrorComponent from "../components/ErrorComponent";
import EachCuadro from "../components/EachCuadro";
import AlertModel from "../components/AlertModel";
import NewDish from "../components/NewDish";

const Menu = ({ navigation, translations, onPressToReturn }) => {
  const thingsToLoad = 3;

  const [lang, setLang] = useState("en");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuData, setMenuData] = useState([]);
  const [thingsLoaded, setThingsLoaded] = useState(0);
  const [restaurantName, setRestaurantName] = useState(null);
  const [boolNewDish, setBoolNewDish] = useState(false);
  const getTranslations = () => translations || languages[lang] || languages.en;

  const fetchMenu = async () => {
    try {
      const restaurantName = await loadDataSecure(RESTAURANT_NAME_KEY_STORAGE);
      const menuData = await getAllDataFromTable(`${restaurantName}_menu`);

      setMenuData(JSON.stringify(menuData));
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
      try {
        setRestaurantName(await loadDataSecure(RESTAURANT_NAME_KEY_STORAGE));
      } catch (error) {
        await insertInTable(tableNameErrorLogs, {
          appName: appName,
          error: `An error occurred loading restaurant name: ${error}`,
          date: new Date().toLocaleString(),
          component: `./Screens/Menu/useEffect/loadRestaurantName() catch (error) => Error loading restaurant name: ${error}`,
        });
      } finally {
        setThingsLoaded((prev) => prev + 1);
      }
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

  if (loading)
    return (
      <Loading
        boolActivityIndicator={true}
        progress={
          thingsLoaded / thingsToLoad > 1 ? 1 : thingsLoaded / thingsToLoad
        }
      />
    );
  else if (error)
    <ErrorComponent error={error} navigation={navigation} component="Menu" />;
  else if (boolNewDish)
    return (
      <NewDish
        translations={translations}
        onPressToReturn={() => setBoolNewDish(false)}
        restaurantName={restaurantName}
      />
    );

  return (
    <View style={styles.container}>
      <EachCuadro
        texts={[restaurantName, translations.ownerText]}
        onPress={() => onPressToReturn()}
      />

      <View style={styles.header}>
        <Text style={styles.headerText}>{translations.menu}</Text>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.buttonAddNew,
          { opacity: pressed ? 0.5 : 1 },
        ]}
        onPress={() => setBoolNewDish(true)}
      >
        <Text style={styles.headerText}>{translations.newDish}</Text>
      </Pressable>

      <View style={styles.body}>
        <ScrollView style={styles.scrollView}>
          <MenuProducts
            restaurantName={restaurantName}
            menuData={menuData}
            translations={translations}
          />
        </ScrollView>
      </View>
    </View>
  );
};

export default Menu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  header: {
    backgroundColor: "#6200ea",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  body: {
    flex: 1,
    marginTop: 10,
  },
  scrollView: {
    marginHorizontal: 10,
  },
  buttonAddNew: {
    backgroundColor: "#6200ea",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
});
