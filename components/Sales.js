import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Pressable,
  BackHandler,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import AlertModel from "./AlertModel";
import {
  deleteFromTable,
  getAllDataFromTable,
  insertInTable,
  updateTableByEq,
} from "./DataBaseConnection";
import EachCuadro from "./EachCuadro";
import { Switch } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect } from "@react-navigation/native";
import { appName, getStartOfWeek, tableNameErrorLogs } from "./globalVariables";
import languages from "./languages.json";
import styles from "../styles/stylesSales";

export default Sales = ({
  translations = languages.en,
  returnToBackPage = () => {},
  restaurantName = "Test",
}) => {
  const tableNameSales = `${restaurantName}_sales`;
  const [sales, setSales] = useState(null);
  const [title, setTitle] = useState("Title");
  const [onOk, setOnOk] = useState(() => () => setVisible(false));
  const [OkText, setOkText] = useState("Ok");
  const [idSales, setIdSales] = useState([]);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("Message");
  const [allSales, setAllSales] = useState(null);
  const [onCancel, setOnCancel] = useState(() => () => setVisible(false));
  const [cancelText, setCancelText] = useState(null);
  const [boolAllSales, setBoolAllSales] = useState(false);
  const [idSalesNotPayed, setIdSalesNotPayed] = useState([]);
  const [totalSalesByDate, setTotalSalesByDate] = useState(0);
  const [totalAmountByDate, setTotalAmountByDate] = useState(0);
  const [boolFetchingSales, setBoolFetchingSales] = useState(false);
  const [boolPickFirstDate, setBoolPickFirstDate] = useState(false);
  const [boolPickSecondDate, setBoolPickSecondDate] = useState(false);
  const [secondDateForSales, setSecondDateForSales] = useState(new Date());
  const [firstDateForSales, setFirstDateForSales] = useState(
    getStartOfWeek(new Date())
  );

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () =>
        returnToBackPage && typeof returnToBackPage == "function"
          ? returnToBackPage()
          : null;

      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  //? Función para obtener todas las ventas
  const fetchSales = async () => {
    try {
      const data = await getAllDataFromTable(tableNameSales);
      setTotalAmountByDate(0);
      setTotalSalesByDate(0);

      let sales = [];
      if (data) {
        data.forEach((sale) => {
          const saleDate = new Date(sale.saleDate);

          if (
            sale.saleStatus &&
            saleDate >= firstDateForSales &&
            saleDate <= secondDateForSales
          ) {
            setTotalAmountByDate((prev) => prev + sale.totalAmount);
            setIdSales((prev) => [...prev, sale.id]);
            setTotalSalesByDate((prev) => prev + 1);
            sales.push(sale);
          } else if (!sale.saleStatus)
            setIdSalesNotPayed((prev) => [...prev, sale.id]);
          else console.log(`Sale not evaluable:`, sale);
        });
        if (!sales.length > 0) {
          setTitle(translations.noSales);
          setMessage(translations.noSalesBetweenDates);
          setOnOk(() => () => setVisible(false));
          setOkText(translations.ok);
          setVisible(true);
        }
        setSales(JSON.stringify(sales));
        if (boolAllSales) setAllSales(data);
      }
    } catch (error) {
      console.error("Error fetching sales:", error);
      await insertInTable(tableNameErrorLogs, {
        appName: appName,
        error: `An error occurred during load sales: ${error}`,
        date: new Date().toLocaleString(),
        component: `./Sales/useEffect/fetchSales() catch (error) => Error fetching sales: ${error}`,
      });
    }

    setTimeout(() => setBoolFetchingSales(false), 500);
  };

  const askDeleteSale = (idSale) => {
    setTitle(translations.deleteSale);
    setMessage(translations.askAboutAnAction);
    setOnOk(() => () => deleteSale(idSale));
    setOkText(translations.delete);
    setOnCancel(() => () => setVisible(false));
    setCancelText(translations.cancel);
    setVisible(true);
  };

  //? Función para borrar una venta
  const deleteSale = async (idSale) => {
    try {
      await updateTableByEq(tableNameSales, { removed: true }, "id", idSale);
      await fetchSales();
    } catch (error) {
      console.error("Error creating sale:", error);
      await insertInTable(tableNameErrorLogs, {
        appName: appName,
        error: `An error occurred during deleting sale: ${error}`,
        date: new Date().toLocaleString(),
        component: `./Sales/useEffect/fetchSales() catch (error) => Error deleting sale: ${error}`,
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* DatePickers */}
      {boolPickFirstDate && (
        <DateTimePicker
          value={firstDateForSales}
          mode="date"
          display="calendar"
          onChange={(event, selectedDate) => {
            if (!selectedDate) return;
            if (!(selectedDate < secondDateForSales)) {
              setTitle(translations.error);
              setMessage(translations.errorDates);
              setOnOk(() => () => setVisible(false));
              setOkText(translations.ok);
              setVisible(true);
              return;
            }
            const currentDate = new Date(selectedDate);
            currentDate.setHours(0, 0, 0, 0);

            setFirstDateForSales(currentDate);
            setBoolPickFirstDate(false);
          }}
        />
      )}
      {boolPickSecondDate && (
        <DateTimePicker
          value={secondDateForSales}
          mode="date"
          display="calendar"
          onChange={(event, selectedDate) => {
            if (!selectedDate) return;
            const currentDate =
              selectedDate > firstDateForSales
                ? selectedDate
                : secondDateForSales;
            currentDate.setHours(23, 59, 59, 999);
            setSecondDateForSales(currentDate);
            setBoolPickSecondDate(false);
          }}
        />
      )}

      {/*//? Para alertas */}
      <AlertModel
        onOk={onOk}
        title={title}
        OkText={OkText}
        visible={visible}
        message={message}
        onCancel={onCancel}
        cancelText={cancelText}
      />

      {/*//? Header */}
      <EachCuadro
        texts={[restaurantName, translations.ownerText]}
        onPress={() => returnToBackPage()}
      />

      {/*//? Main*/}
      <View style={styles.mainContainer}>
        <Text style={styles.header}>{translations.headerSales}</Text>

        <View style={styles.reviewTexts}>
          <Text style={styles.textsH2}>
            {translations.totalAmountLabel}:{" "}
            {boolFetchingSales ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Text style={styles.bold}>${totalAmountByDate}</Text>
            )}
          </Text>

          <Text style={styles.textsH2}>
            {translations.totalSales}:{" "}
            {boolFetchingSales ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Text style={styles.bold}>{totalSalesByDate}</Text>
            )}
          </Text>
        </View>

        <Text style={styles.label}>{translations.pickDates}</Text>
        <View style={styles.datesContainer}>
          <View style={styles.datePickers}>
            <Text style={styles.label}>{translations.fromText} </Text>
            <Pressable
              style={({ pressed }) => [
                styles.buttonPickDate,
                { opacity: pressed ? 0.5 : 1 },
              ]}
              onPress={() => setBoolPickFirstDate(true)}
            >
              <Text style={styles.dateText}>
                {new Date(firstDateForSales)
                  .toLocaleString()
                  .replace(", ", "\n")}
              </Text>
            </Pressable>
          </View>

          <View style={styles.datePickers}>
            <Text style={styles.label}>{translations.toText}</Text>
            <Pressable
              style={({ pressed }) => [
                styles.buttonPickDate,
                { opacity: pressed ? 0.5 : 1 },
              ]}
              onPress={() => setBoolPickSecondDate(true)}
            >
              <Text style={styles.dateText}>
                {new Date(secondDateForSales)
                  .toLocaleString()
                  .replace(", ", "\n")}
              </Text>
            </Pressable>
          </View>
        </View>

        <Pressable
          onPress={() => {
            if (firstDateForSales < secondDateForSales) {
              fetchSales();
              setBoolFetchingSales(true);
            }
          }}
          style={({ pressed }) => [
            styles.buttonContainer,
            { opacity: pressed ? 0.5 : 1 },
          ]}
        >
          {boolFetchingSales ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{translations.fetchSales}</Text>
          )}
        </Pressable>

        {/*//? Sales List */}
        {sales != null && JSON.parse(sales).length > 0 && (
          <EachSale
            sales={sales}
            translations={translations}
            askDeleteSale={askDeleteSale}
          />
        )}
      </View>
    </View>
  );
};

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
