import { FlatList, View, Text, Pressable } from "react-native";

const EachSale = ({ sales, translations, askDeleteSale }) => {
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
