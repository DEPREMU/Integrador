import { StyleSheet } from "react-native";
import { useResponsiveLayout } from "../components/LayoutContext";

export const useStylesWaiter = () => {
  const { isTablet, isLargeTablet, isPhone, isWeb, width, height } =
    useResponsiveLayout();

  return StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFF" },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 10,
      paddingHorizontal: 15,
      backgroundColor: "#FFC107",
    },
    menuButton: { padding: 10 },
    menuText: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#000",
      fontFamily: "fontApp", // Fuente aplicada
    },
    headerText: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#000",
      textAlign: "center",
      flex: 1,
      fontFamily: "fontApp", // Fuente aplicada
    },
    userInfo: { alignItems: "flex-end", justifyContent: "center" },
    userText: { fontSize: 12, fontFamily: "fontApp", color: "#000" },

    // Botones de categorías
    categoryButton: {
      backgroundColor: "#FFC107",
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 15,
      marginHorizontal: 5,
      borderRadius: 20,
      fontFamily: "fontApp", // Fuente aplicada
    },
    categoryText: {
      fontSize: isPhone ? 14 : 16,
      fontWeight: "bold",
      color: "#000",
      fontFamily: "fontApp", // Fuente aplicada
    },

    // Contenedor de categorías con ScrollView ajustado
    categoriesContainer: {
      maxHeight: 60,
    },

    // Main view con los productos
    main: {
      flex: 1,
      flexDirection: "row",
      paddingHorizontal: 10,
    },

    // Contenedor de productos
    productsContainer: {
      flex: 1,
      paddingHorizontal: 5,
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginTop: 10,
      maxWidth: isPhone ? "100%" : "90%",
    },

    // Producto card
    productCard: {
      width: isPhone ? "45%" : "30%",
      backgroundColor: "#E0E0E0",
      padding: 10,
      marginVertical: 10,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    productName: {
      fontSize: 14,
      fontWeight: "bold",
      textAlign: "center",
      fontFamily: "fontApp", // Fuente aplicada
    },
    productNameBold: {
      fontWeight: "bold",
      fontFamily: "fontApp", // Fuente aplicada
    },
    priceText: {
      fontSize: 14,
      fontFamily: "fontApp", // Fuente aplicada
    },
    priceTextBold: {
      fontSize: 14,
      fontWeight: "bold",
      fontFamily: "fontApp", // Fuente aplicada
    },

    // Panel de orden
    orderPanel: {
      padding: 10,
      backgroundColor: "#F5F5F5",
      borderRadius: 10,
      marginHorizontal: 10,
      marginTop: 10,
      flex: 1,
      minWidth: "40%",
      maxWidth: "50%",
    },
    orderTitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 10,
      fontFamily: "fontApp", // Fuente aplicada
    },
    orderItem: {
      fontSize: 14,
      fontFamily: "fontApp", // Fuente aplicada
    },
    orderTotal: {
      fontSize: 16,
      fontWeight: "bold",
      marginTop: 10,
      fontFamily: "fontApp", // Fuente aplicada
    },
    sendButton: {
      backgroundColor: "#FFC107",
      paddingVertical: 10,
      marginTop: 10,
      borderRadius: 10,
      alignItems: "center",
    },
    sendText: {
      fontSize: 14,
      fontWeight: "bold",
      fontFamily: "fontApp", // Fuente aplicada
    },

    // Botones inferiores
    bottomButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 10,
      paddingHorizontal: 20,
    },
    bottomButton: {
      backgroundColor: "#FFC107",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    bottomText: {
      fontSize: 14,
      fontWeight: "bold",
      color: "#000",
      fontFamily: "fontApp", // Fuente aplicada
    },

    // ScrollView para la orden
    orderContainer: {
      paddingVertical: 10,
    },
    orderScroll: {
      flex: 1,
    },
    orderViewItem: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: 5,
    },
    orderItemDelete: {
      backgroundColor: "#FF6347", // Color para el botón de eliminar
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 15,
    },
    orderItemDeleteText: {
      color: "#FFF",
      fontSize: 12,
      fontFamily: "fontApp", // Fuente aplicada
    },
    orderItemNotes: {
      borderColor: "#000",
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      fontFamily: "fontApp", // Fuente aplicada
    },
    orderItemNotesTitle: {
      fontSize: 12,
      color: "#000",
      fontFamily: "fontApp", // Fuente aplicada
    },
    imageAddNotes: {
      width: 40,
      height: 40,
    },
    buttonLogOut: {
      backgroundColor: "red",
      padding: 15,
      borderRadius: 10,
      margin: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    logOutText: {
      color: "#FFF",
      fontSize: 16,
      fontWeight: "bold",
      fontFamily: "fontApp", // Fuente aplicada
    },
  });
};
