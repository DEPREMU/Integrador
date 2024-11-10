import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Alert,
  StyleSheet,
  Pressable,
  BackHandler,
} from "react-native";
import AlertModel from "./AlertModel";
import {
  getAllDataFromTable,
  insertInTable,
  updateTableByEq,
} from "./DataBaseConnection";
import { appName, tableNameErrorLogs } from "./globalVariables";
import { useFocusEffect } from "@react-navigation/native";
import EachCuadro from "./EachCuadro";
import { Switch } from "react-native";

export default Sales = ({ translations, returnToBackPage, restaurantName }) => {
  const tableNameSales = `${restaurantName}_sales`;
  const [sales, setSales] = useState(null);
  const [customerId, setCustomerId] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [products, setProducts] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [saleStatus, setSaleStatus] = useState("pending");
  const [notes, setNotes] = useState("");
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("Title");
  const [message, setMessage] = useState("Message");
  const [OkText, setOkText] = useState("Ok");
  const [cancelText, setCancelText] = useState(null);
  const [onOk, setOnOk] = useState(() => () => {
    setVisible(false);
  });
  const [onCancel, setOnCancel] = useState(() => () => {
    setVisible(false);
  });

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (returnToBackPage && typeof returnToBackPage == "function")
          returnToBackPage();
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  // Obtener las ventas desde Supabase
  useEffect(() => {
    fetchSales();
  }, []);

  // Función para obtener todas las ventas
  const fetchSales = async () => {
    try {
      const data = await getAllDataFromTable(tableNameSales);
      if (data) setSales(JSON.stringify(data));
    } catch (error) {
      console.error("Error fetching sales:", error);
      await insertInTable(tableNameErrorLogs, {
        appName: appName,
        error: `An error occurred during load sales: ${error}`,
        date: new Date().toLocaleString(),
        component: `./Sales/useEffect/fetchSales() catch (error) => Error fetching sales: ${error}`,
      });
    }
  };

  // Función para agregar una nueva venta
  const createSale = async () => {
    try {
      // Asegúrate de que los campos necesarios no estén vacíos
      if (!totalAmount || !products) {
        setTitle(translations.error);
        setMessage(translations.pleaseFillFields);
        setCancelText(null);
        setOkText(translations.ok);
        setOnOk(() => () => {
          setVisible(false);
        });
        setVisible(true);
        return;
      }

      const dict = {
        totalAmount: parseFloat(totalAmount),
        products: JSON.stringify(products),
        paymentMethod: paymentMethod,
        saleStatus: saleStatus,
        notes: notes,
      };
      await insertInTable(tableNameSales, dict);

      fetchSales();
      resetForm();
    } catch (error) {
      console.error("Error creating sale:", error);
      await insertInTable(tableNameErrorLogs, {
        appName: appName,
        error: `An error occurred during create sale: ${error}`,
        date: new Date().toLocaleString(),
        component: `./Sales/useEffect/fetchSales() catch (error) => Error creating sale
            : ${error}`,
      });
    }
  };

  // Función para actualizar el estado de una venta
  const updateSaleStatus = async (saleId, newStatus) => {
    try {
      await updateTableByEq(
        tableNameSales,
        {
          saleStatus: newStatus,
        },
        "id",
        saleId
      );

      fetchSales(); // Refrescar la lista de ventas
    } catch (error) {
      console.error("Error updating sale status:", error);
      Alert.alert("Error", "No se pudo actualizar el estado de la venta.");
    }
  };

  // Función para limpiar los campos del formulario
  const resetForm = () => {
    setCustomerId("");
    setTotalAmount("");
    setProducts("");
    setPaymentMethod("");
    setSaleStatus("pending");
    setNotes("");
  };

  return (
    <View style={styles.container}>
      {/* Alert modal */}
      <AlertModel
        visible={visible}
        title={title}
        message={message}
        onOk={onOk}
        onCancel={onCancel}
        OkText={OkText}
        cancelText={cancelText}
      />
      {/* Each Cuadro */}
      <EachCuadro
        texts={[restaurantName, translations.ownerText]}
        onPress={() => returnToBackPage()}
      />
      <View style={styles.containerSales}>
        <View style={styles.formContainer}>
          {/* Header */}
          <Text style={styles.header}>{translations.headerSales}</Text>

          {/* Form Fields */}
          <TextInput
            style={styles.input}
            placeholder={translations.totalAmountPlaceholder}
            value={totalAmount}
            onChangeText={setTotalAmount}
            keyboardType="decimal-pad"
          />
          <TextInput
            style={styles.input}
            placeholder={translations.productsPlaceholder}
            value={products}
            onChangeText={setProducts}
          />
          <TextInput
            style={styles.input}
            placeholder={translations.paymentMethodPlaceholder}
            value={paymentMethod}
            onChangeText={setPaymentMethod}
          />
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              {translations.saleStatusPlaceholder}
            </Text>
            <Switch
              value={saleStatus}
              onValueChange={(newValue) => setSaleStatus(newValue)}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={saleStatus ? "#f5dd4b" : "#f4f3f4"}
            />
            <Text style={styles.statusText}>
              {saleStatus ? translations.completed : translations.pending}
            </Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder={translations.notesPlaceholder}
            value={notes}
            onChangeText={setNotes}
          />

          {/* Create Sale Button */}
          <Pressable onPress={createSale} style={styles.buttonContainer}>
            <Text style={styles.buttonText}>
              {translations.createSaleButton}
            </Text>
          </Pressable>

          {/* Sales List */}
        </View>
        {sales != null && JSON.parse(sales).length > 0 && (
          <FlatList
            data={JSON.parse(sales)}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.saleItem}>
                <Text style={styles.saleText}>
                  {translations.saleIdLabel} {item.id}
                </Text>
                <Text style={styles.saleText}>
                  {translations.totalAmountLabel} {item.totalAmount}
                </Text>
                <Text style={styles.saleText}>
                  {translations.saleStatusLabel} {item.saleStatus}
                </Text>
                <Text style={styles.saleText}>
                  {translations.notesLabel} {item.notes}
                </Text>
                <Pressable
                  onPress={() => updateSaleStatus(item.id, "completed")}
                  style={styles.completeButton}
                >
                  <Text style={styles.completeButtonText}>
                    {translations.checkCompleted}
                  </Text>
                </Pressable>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  containerSales: {
    flex: 1,
    padding: 20,
  },
  formContainer: {
    marginTop: 20,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  saleItem: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  saleText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  completeButton: {
    marginTop: 10,
    backgroundColor: "#28a745",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  completeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
