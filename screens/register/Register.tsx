import {
  calculateTime,
  checkLanguage,
  loadDataSecure,
} from "../../utils/globalVariables/utils";
import {
  appName,
  LanguageKeys,
  separatorForDB,
  separatorForDB2,
  TOKEN_KEY_STORAGE,
  RESTAURANT_NAME_KEY_STORAGE,
} from "../../utils/globalVariables/constants";
import Loading from "../../components/common/Loading";
import languages from "../../utils/languages.json";
import { getAllDataFromTableByEq } from "../../utils/database/DataBaseConnection";
import { stylesRegister as styles } from "../../styles/stylesRegister";
import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, Pressable } from "react-native";

interface RegisterProps {
  navigation: any;
}

const Register: React.FC<RegisterProps> = ({ navigation }) => {
  const thingsToLoad = 3;
  const [lang, setLang] = useState<string | LanguageKeys>("en");
  const [loading, setLoading] = useState<boolean>(true);
  const [restaurantName, setRestaurantName] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [thingsLoaded, setThingsLoaded] = useState<number>(0);
  const [sales, setSales] = useState<string | null>(null);

  const getTranslations = () => languages[lang as LanguageKeys];

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

  const deleteOrder = (key: any) => {};

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
            <View key={key} style={styles.viewByOrder}>
              <View style={styles.containerNumberOrder}>
                <Text style={styles.textOrderNumber}>
                  {translations.orderText}
                </Text>
                <Text style={styles.textTimeAgo}>
                  {calculateTime((value as any)["orderTime"])}{" "}
                  {translations.minAgo}
                </Text>
              </View>
              <View style={styles.orderContainer}>
                <View style={styles.order}>
                  <Text style={styles.textTitle}>
                    {translations.orderText + "\n"}
                  </Text>

                  <Text style={styles.texts}>
                    {"\t\t" +
                      (value as any)["order"]
                        .split(separatorForDB)
                        .map((item: any) => item)
                        .join("\n\t\t")}
                  </Text>
                </View>
                <View style={styles.orderCharacteristics}>
                  <Text style={styles.textTitle}>
                    {translations.notes + "\n"}
                  </Text>

                  <Text style={styles.texts}>
                    {(value as any).characteristics &&
                      "\t\t" +
                        (value as any)["characteristics"]
                          .split(separatorForDB)
                          .map((item: string) =>
                            item.split(separatorForDB2).join("\n\t\t")
                          )
                          .join("\n\t\t\t")}
                  </Text>
                </View>
                <Pressable
                  style={({ pressed }) => [
                    styles.buttonReady,
                    { opacity: pressed ? 0.5 : 1 },
                  ]}
                  onPress={() => deleteOrder(key)}
                >
                  <Text style={styles.buttonText}>
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
