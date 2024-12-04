import { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, Text, Pressable } from "react-native";
import languages from "../components/languages.json";
import {
  appName,
  checkLanguage,
  loadDataSecure,
  removeDataSecure,
  RESTAURANT_NAME_KEY_STORAGE,
  TOKEN_KEY_STORAGE,
} from "../components/globalVariables";
import {
  getAllDataFromTable,
  getAllDataFromTableByEq,
} from "../components/DataBaseConnection";
import Loading from "../components/Loading";

const Register = ({ navigation }) => {
  const thingsToLoad = 3;
  const [lang, setLang] = useState("en");
  const [loading, setLoading] = useState(true);
  const [restaurantName, setRestaurantName] = useState(null);
  const [token, setToken] = useState(null);
  const [thingsLoaded, setThingsLoaded] = useState(0);
  const [sales, setSales] = useState(null);

  const getTranslations = () => languages[lang];

  const loadSales = async () => {
    console.log("Loading sales");

    const data = await getAllDataFromTableByEq(
      `${restaurantName}_sales`,
      "saleStatus",
      "FALSE"
    );
    if (!data || data.length == 0) {
      setSales(null);
      return;
    }
    console.log(data);
  };

  useEffect(() => {
    const loadLanguage = async () => {
      setLang(await checkLanguage());
      setThingsLoaded((prev) => prev + 1);
    };
    const loadRestaurantName = async () => {
      setRestaurantName(await loadDataSecure(RESTAURANT_NAME_KEY_STORAGE));
      setThingsLoaded((prev) => prev + 1);
    };
    const loadToken = async () => {
      setToken(await loadDataSecure(TOKEN_KEY_STORAGE));
      setThingsLoaded((prev) => prev + 1);
    };

    loadRestaurantName();

    loadLanguage();
    loadToken();
  }, []);

  useEffect(() => {
    if (thingsLoaded >= thingsToLoad) setLoading(false);
  }, [thingsLoaded]);

  useEffect(() => {
    loadSales();
    setInterval(async () => {
      await loadSales();
    }, 10000);
  }, [restaurantName]);

  const translations = getTranslations();

  if (loading) return <Loading progress={thingsLoaded / thingsToLoad} />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{appName}</Text>
      </View>
      <ScrollView
        style={styles.scrollViewStyle}
        contentContainerStyle={styles.scrollViewContent}
      >
        {sales != null &&
          Object.entries(JSON.parse(sales)).map(([key, value]) => (
            <View key={key} style={stylesCook.viewByOrder}>
              <View style={stylesCook.containerNumberOrder}>
                <Text style={stylesCook.textOrderNumber}>
                  {translations.orderText}
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
                    {"\t\t" +
                      value["order"]
                        .split(separatorForDB)
                        .map((item) => item)
                        .join("\n\t\t")}
                  </Text>
                </View>
                <View style={stylesCook.orderCharacteristics}>
                  <Text style={stylesCook.textTitle}>
                    {translations.notes + "\n"}
                  </Text>

                  <Text style={stylesCook.texts}>
                    {value.characteristics &&
                      "\t\t" +
                        value["characteristics"]
                          .split(separatorForDB)
                          .map((item) =>
                            item.split(separatorForDB2).join("\n\t\t")
                          )
                          .join("\n\t\t\t")}
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
          ))}
      </ScrollView>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  header: {
    height: 50,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  scrollViewStyle: {
    flex: 1,
    padding: 10,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 20,
  },
});
