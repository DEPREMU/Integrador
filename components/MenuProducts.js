import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { getAllDataFromTable } from "./DataBaseConnection";
import { useEffect, useState } from "react";

const MenuProducts = ({ menuData, translations, restaurantName }) => {
  const [inventory, setInventory] = useState(JSON.stringify({}));
  const [notesInventory, setNotesInventory] = useState(null);

  const fetchInventory = async () => {
    const dataInventory = await getAllDataFromTable(
      `${restaurantName}_inventory`
    );
    if (!dataInventory) return;

    const dict = {};
    dataInventory.forEach((item) => {
      dict[item.productName] = item.productDescription;
    });
    setInventory(JSON.stringify(dict));
  };

  const loadinventory = async () => {
    await fetchInventory();
  };

  useEffect(() => {
    loadinventory();
    const timer = setInterval(() => {
      loadinventory();
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      // horizontal={true}
      contentContainerStyle={styles.scrollViewContentContainer}
      style={styles.scrollView}
    >
      {menuData != null &&
        menuData.length > 0 &&
        JSON.parse(menuData).map((item) => {
          return (
            <View key={item.id} style={styles.containerEachProduct}>
              <View style={styles.containerName}>
                <Text style={styles.name}>{item.name}</Text>
              </View>
              {item.imageLink != null && item.imageLink.length > 0 && (
                <Image
                  style={styles.imageProduct}
                  source={{ uri: item.imageLink }}
                />
              )}
              {item.ingredients != null && (
                <View style={styles.containerIngredients}>
                  <Text style={styles.ingredientsTitle}>
                    {translations.ingredients}:
                  </Text>
                  {Object.entries(JSON.parse(item.ingredients)).map(
                    ([key, value]) => (
                      <Text style={styles.ingredients} key={key}>
                        {value} {key}{" "}
                        {JSON.parse(inventory)[key]
                          ? `(${JSON.parse(inventory)[key]})`
                          : ""}
                      </Text>
                    )
                  )}
                </View>
              )}
              <View style={styles.containerPrice}>
                <Text style={styles.priceProductTitle}>
                  {translations.price}
                </Text>
                <Text style={styles.priceProduct}>${item.price}</Text>
              </View>
            </View>
          );
        })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  containerEachProduct: {
    backgroundColor: "#fff",
    minWidth: 200,
    maxWidth: 350,
    flexWrap: "wrap",
    margin: 15,
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  containerName: {
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  imageProduct: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
    resizeMode: "cover",
  },
  containerIngredients: {
    marginBottom: 15,
  },
  ingredientsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
  },
  ingredients: {
    fontSize: 14,
    color: "#777",
    marginTop: 5,
  },
  containerPrice: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceProductTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
  },
  priceProduct: {
    fontSize: 16,
    color: "#2e7d32",
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
    padding: 10,
    flexWrap: "wrap",
    maxWidth: "100%",
  },
  scrollViewContentContainer: {
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "row",
  },
});

export default MenuProducts;
