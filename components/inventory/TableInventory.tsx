import React from "react";
import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
import { Translations } from "../../utils/interfaceTranslations";

interface TableInventoryProps {
  inventory: string;
  idSelected: number | null;
  translations: Translations;
  setIdSelected: (id: number) => any;
  setIdSelectedToDelete: (id: number) => any;
}
interface Ingredient {
  id: number;
  productName: string;
  productQuantity: string | number;
}

const TableInventory: React.FC<TableInventoryProps> = ({
  inventory,
  translations,
  setIdSelected,
  idSelected,
  setIdSelectedToDelete,
}) => {
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      {JSON.parse(inventory).map((ingredient: Ingredient) => {
        if (idSelected != ingredient.id)
          return (
            <View key={ingredient.id} style={styles.containerEach}>
              <Text style={styles.textLabel}>{ingredient.productName}</Text>

              <Text style={styles.textLabel}>{ingredient.productQuantity}</Text>

              <View style={styles.containerButtons}>
                <Pressable
                  style={styles.buttonEditIngredient}
                  onPress={() => setIdSelected(ingredient.id)}
                >
                  <Text style={styles.textButtonEdit}>{translations.edit}</Text>
                </Pressable>
                <Pressable
                  style={styles.buttonDeleteIngredient}
                  onPress={() => setIdSelectedToDelete(ingredient.id)}
                >
                  <Text style={styles.textButtonDelete}>
                    {translations.delete}
                  </Text>
                </Pressable>
              </View>
            </View>
          );
      })}
    </ScrollView>
  );
};

export default TableInventory;

const styles = StyleSheet.create({
  scrollView: {
    width: "100%",
    paddingHorizontal: 20,
    backgroundColor: "#F9F9F9",
  },
  containerEach: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textLabel: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    marginRight: 10,
  },
  containerButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  buttonEditIngredient: {
    backgroundColor: "#6F42C1",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6F42C1",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  textButtonEdit: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  buttonDeleteIngredient: {
    backgroundColor: "#FF5C5C",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF5C5C",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  textButtonDelete: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});
