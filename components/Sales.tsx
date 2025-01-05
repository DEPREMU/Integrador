import {
  appName,
  userImage,
  tableNameErrorLogs,
} from "../utils/globalVariables/constants";
import {
  insertInTable,
  updateTableByEq,
  getAllDataFromTable,
} from "../utils/database/DataBaseConnection";
import {
  View,
  Text,
  Pressable,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import EachSale from "./EachSale";
import languages from "../utils/languages.json";
import AlertModel from "../components/common/AlertModel";
import EachRectangle from "./common/EachRectangle";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Translations } from "../utils/interfaceTranslations";
import { useFocusEffect } from "@react-navigation/native";
import { getStartOfWeek } from "../utils/globalVariables/utils";
import { stylesSales as styles } from "../styles/stylesSales";
import React, { useState, useCallback } from "react";

interface SalesProps {
  translations: Translations;
  returnToBackPage: () => any;
  restaurantName: string;
}

const Sales: React.FC<SalesProps> = ({
  translations = languages.en,
  returnToBackPage = () => {},
  restaurantName,
}) => {
  const tableNameSales: string = `${restaurantName}_sales`;
  const [sales, setSales] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("Title");
  const [onOk, setOnOk] = useState<() => any>(() => () => setVisible(false));
  const [OkText, setOkText] = useState<string>("Ok");
  const [idSales, setIdSales] = useState<number[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("Message");
  const [allSales, setAllSales] = useState<string | null>(null);
  const [onCancel, setOnCancel] = useState<() => any>(
    () => () => setVisible(false)
  );
  const [cancelText, setCancelText] = useState<string | null>(null);
  const [boolAllSales, setBoolAllSales] = useState<boolean>(false);
  const [idSalesNotPayed, setIdSalesNotPayed] = useState<number[]>([]);
  const [totalSalesByDate, setTotalSalesByDate] = useState<number>(0);
  const [totalAmountByDate, setTotalAmountByDate] = useState<number>(0);
  const [boolFetchingSales, setBoolFetchingSales] = useState<boolean>(false);
  const [boolPickFirstDate, setBoolPickFirstDate] = useState<boolean>(false);
  const [boolPickSecondDate, setBoolPickSecondDate] = useState<boolean>(false);
  const [secondDateForSales, setSecondDateForSales] = useState<Date>(
    new Date()
  );
  const [firstDateForSales, setFirstDateForSales] = useState<Date>(
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

      let sales: any[] = [];
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
        if (sales.length == 0) {
          setTitle(translations.noSales);
          setMessage(translations.noSalesBetweenDates);
          setOnOk(() => () => setVisible(false));
          setOkText(translations.ok);
          setVisible(true);
        }
        setSales(JSON.stringify(sales));
        if (boolAllSales) setAllSales(JSON.stringify(data));
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

  const askDeleteSale = (idSale: number) => {
    setTitle(translations.deleteSale);
    setMessage(translations.askAboutAnAction);
    setOnOk(() => () => deleteSale(idSale));
    setOkText(translations.delete);
    setOnCancel(() => () => setVisible(false));
    setCancelText(translations.cancel);
    setVisible(true);
  };

  //? Función para borrar una venta
  const deleteSale = async (idSale: number) => {
    try {
      await updateTableByEq(
        tableNameSales,
        { removed: true },
        "id",
        idSale.toString()
      );
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
          value={new Date(firstDateForSales)}
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
          value={new Date(secondDateForSales)}
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
      <EachRectangle
        texts={[restaurantName, translations.ownerText]}
        onPress={() => returnToBackPage()}
        imageVariable={userImage}
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

export default Sales;
