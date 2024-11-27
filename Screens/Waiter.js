import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

const Waiter = () => {
  return (
    <View style={styles.container}>
      {/* Barra superior */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuText}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Comandas</Text>
        <View style={styles.userInfo}>
          <Text style={styles.userText}>NOMBRE X</Text>
          <Text style={styles.userText}>AREA: X</Text>
        </View>
      </View>

      {/* Botones de categorías */}
      <View style={styles.categories}>
        <TouchableOpacity style={styles.categoryButton}>
          <Text style={styles.categoryText}>Platillos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryButton}>
          <Text style={styles.categoryText}>Bebidas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryButton}>
          <Text style={styles.categoryText}>Extras</Text>
        </TouchableOpacity>
      </View>

      <View style = {styles.main}>
      {/* Cuadrícula de productos */}
      <ScrollView style={styles.productsContainer}>
        <View style={styles.grid}>
          {Array.from({ length: 8 }).map((_, index) => (
            <TouchableOpacity key={index} style={styles.productCard}>
              <Text style={styles.productName}>Nombre</Text>
              <TouchableOpacity style={styles.priceButton}>
                <Text style={styles.priceText}>100$</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Panel de orden */}
      <View style={styles.orderPanel}>
        <Text style={styles.orderTitle}>Orden Mesa: X</Text>
        <Text style={styles.orderItem}>- Producto1 .... 100$</Text>
        <Text style={styles.orderItem}>- Producto2 .... 100$</Text>
        <Text style={styles.orderItem}>- Producto3 .... 100$</Text>
        <Text style={styles.orderTotal}>Total 300$</Text>
        <TouchableOpacity style={styles.sendButton}>
          <Text style={styles.sendText}>Enviar</Text>
        </TouchableOpacity>
      </View>
      </View>

      {/* Botones inferiores */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.bottomButton}>
          <Text style={styles.bottomText}>Imprimir</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton}>
          <Text style={styles.bottomText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton}>
          <Text style={styles.bottomText}>Extra/Opcional</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#FFC107",
  },
  menuButton: { padding: 10 },
  menuText: { fontSize: 20, fontWeight: "bold" },
  headerText: { fontSize: 20, fontWeight: "bold", color: "#000" },
  userInfo: { alignItems: "flex-end" },
  userText: { fontSize: 12 },

  categories: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  categoryButton: {
    backgroundColor: "#FFC107",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  categoryText: { fontSize: 16, fontWeight: "bold", color: "#000" },

  main:{
    flexDirection:"row"
  },

  productsContainer: { flex: 1, paddingHorizontal: 10 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productCard: {
    width: "30%",
    backgroundColor: "#E0E0E0",
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  productName: { fontSize: 14, fontWeight: "bold" },
  priceButton: {
    backgroundColor: "#FFC107",
    padding: 5,
    borderRadius: 10,
    marginTop: 10,
  },
  priceText: { fontSize: 14, fontWeight: "bold" },

  orderPanel: {
    padding: 10,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    marginHorizontal: 10,
  },
  orderTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  orderItem: { fontSize: 14 },
  orderTotal: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  sendButton: {
    backgroundColor: "#FFC107",
    paddingVertical: 10,
    marginTop: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  sendText: { fontSize: 14, fontWeight: "bold" },

  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  bottomButton: {
    backgroundColor: "#FFC107",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  bottomText: { fontSize: 14, fontWeight: "bold", color: "#000" },
});

export default Waiter;
