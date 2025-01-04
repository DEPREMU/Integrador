import React from "react";
import { FlatList, View, Text, Pressable, StyleSheet } from "react-native";

interface EachSaleProps {
  sales: string;
  translations: translations;
  askDeleteSale: (id: number) => void;
}

interface translations {
  saleIdLabel: string;
  totalAmountLabel: string;
  saleStatusLabel: string;
  completed: string;
  pending: string;
  date: string;
  products: string;
  notesLabel: string;
  delete: string;
}

const EachSale: React.FC<EachSaleProps> = ({
  sales,
  translations,
  askDeleteSale,
}) => {
  return (
    <FlatList
      data={JSON.parse(sales)}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.saleItem}>
          <Text style={styles.saleText}>
            {translations.saleIdLabel}
            {": "}
            <Text style={styles.bold}>{item.id}</Text>
          </Text>

          <Text style={styles.saleText}>
            {translations.totalAmountLabel}
            {": "}
            <Text style={styles.bold}>{item.totalAmount}</Text>
          </Text>

          <Text style={styles.saleText}>
            {translations.saleStatusLabel}
            {": "}
            <Text style={styles.bold}>
              {item.saleStatus ? translations.completed : translations.pending}
            </Text>
          </Text>

          <Text style={styles.saleText}>
            {translations.date}
            {": "}
            <Text style={styles.bold}>
              {new Date(item.saleDate).toLocaleString()}
            </Text>
          </Text>

          <Text style={styles.saleText}>
            {translations.products}
            {": "}
            <Text style={styles.bold}>{item.products}</Text>
          </Text>

          <Text style={styles.saleText}>
            {translations.notesLabel}
            {": "}
            <Text style={styles.bold}>{item.notes}</Text>
          </Text>

          <Pressable
            onPress={() => askDeleteSale(item.id)}
            style={({ pressed }) => [
              styles.deleteOrder,
              { opacity: pressed ? 0.5 : 1 },
            ]}
          >
            <Text style={styles.textsDelete}>{translations.delete}</Text>
          </Pressable>
        </View>
      )}
    />
  );
};

export default EachSale;

const styles = StyleSheet.create({
  saleItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  saleText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "fontApp",
    marginBottom: 5,
  },
  bold: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#444",
    fontFamily: "fontApp",
  },
  deleteOrder: {
    marginTop: 10,
    backgroundColor: "#FF4C4C",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  textsDelete: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "fontApp",
  },
});
