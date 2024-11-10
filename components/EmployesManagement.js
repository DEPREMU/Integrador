import EachCuadro from "./EachCuadro";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  BackHandler,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { getAllDataFromTable } from "./DataBaseConnection";
import TableOfEmployes from "./TableEmployes";
import AddEmployeOwner from "./AddEmployeOwner";

export default EmployesManagement = ({
  returnToMP,
  translations,
  onPress,
  restaurantName,
}) => {
  const [employes, setEmployes] = useState(null);
  const [boolAddEmploye, setBoolAddEmploye] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (returnToMP && typeof returnToMP == "function") returnToMP();
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  const handleAddEmploye = () => setBoolAddEmploye((prev) => !prev);

  useEffect(() => {
    const loadEmployes = async () => {
      const data = await getAllDataFromTable(restaurantName);

      if (data) setEmployes(JSON.stringify(data));
    };
    loadEmployes();
  }, []);

  if (!translations)
    return (
      <Text
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          fontSize: 20,
        }}
      >
        Error with args
      </Text>
    );

  if (boolAddEmploye)
    return (
      <AddEmployeOwner
        returnToBackPage={handleAddEmploye}
        translations={translations}
        restaurantName={restaurantName}
      />
    );

  return (
    <View style={styles.container}>
      <EachCuadro
        texts={[restaurantName, translations.ownerText]}
        onPress={returnToMP}
      />
      <View style={styles.containerEmployesManagement}>
        <Text style={[styles.textsTitle]}>
          {translations.employesManagement}
        </Text>

        <View style={styles.employesTable}>
          <Text style={styles.texts}>{translations.tableOfEmployes}</Text>

          <TableOfEmployes employes={employes} translations={translations} />

          <Pressable
            onPress={() => {
              handleAddEmploye();
              console.log("Add employe");
            }}
            style={styles.button}
          >
            <Text style={styles.texts}>{translations.addEmploye}</Text>
          </Pressable>
        </View>

        <View style={styles.employesRoles}></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerEmployesManagement: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "blueviolet",
    borderRadius: 20,
    marginVertical: 5,
    marginHorizontal: 10,
    padding: 5,
  },
  texts: {
    fontSize: 20,
    fontWeight: "bold",
  },
  textsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    margin: 10,
  },
  containerOfLeftSide: {
    flex: 2 / 3,
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  employesTable: {
    backgroundColor: "white",
    width: "90%",
    flex: 1,
    borderRadius: 20,
    margin: 5,
    padding: 5,
    alignItems: "center",
  },
  employesRoles: {
    flex: 1,
    backgroundColor: "white",
    width: "90%",
    borderRadius: 20,
    margin: 5,
    padding: 5,
  },
  button: {
    backgroundColor: "blueviolet",
    width: "90%",
    height: 50,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
