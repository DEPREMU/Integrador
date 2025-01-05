import EachRectangle from "../common/EachRectangle";
import { userImage } from "../../utils/globalVariables/constants";
import TableOfEmployes from "./TableEmployes";
import AddEmployeOwner from "./AddEmployeOwner";
import { Translations } from "../../utils/interfaceTranslations";
import { useFocusEffect } from "@react-navigation/native";
import { getAllDataFromTable } from "../../utils/database/DataBaseConnection";
import React, { useCallback, useEffect, useState } from "react";
import { View, Text, BackHandler, StyleSheet, Pressable } from "react-native";

interface EmployesManagementProps {
  returnToMP: () => void;
  navigation: any;
  translations: Translations;
  restaurantName: string;
}

const EmployesManagement: React.FC<EmployesManagementProps> = ({
  returnToMP,
  navigation,
  translations,
  restaurantName,
}) => {
  const [employes, setEmployes] = useState<string | null>(null);
  const [boolAddEmploye, setBoolAddEmploye] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (returnToMP && typeof returnToMP == "function") returnToMP();
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [returnToMP])
  );

  const handleAddEmploye = () => setBoolAddEmploye((prev) => !prev);

  useEffect(() => {
    const loadEmployes = async () => {
      const data = await getAllDataFromTable(restaurantName);

      if (data) setEmployes(JSON.stringify(data));
    };
    loadEmployes();
  }, []);

  if (!translations) {
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
  }

  if (boolAddEmploye)
    return (
      <AddEmployeOwner
        navigation={navigation}
        returnToBackPage={handleAddEmploye}
        translations={translations}
        restaurantName={restaurantName}
      />
    );

  return (
    <View style={styles.container}>
      <EachRectangle
        texts={[restaurantName, translations.ownerText]}
        onPress={returnToMP}
        imageVariable={userImage}
      />
      <View style={styles.containerEmployesManagement}>
        <Text style={[styles.textsTitle]}>
          {translations.employesManagement}
        </Text>

        <View style={styles.employesTable}>
          <Text style={styles.textsTableOfEmployes}>
            {translations.tableOfEmployes}
          </Text>

          {employes != null && (
            <TableOfEmployes employes={employes} translations={translations} />
          )}

          <Pressable
            onPress={handleAddEmploye}
            style={({ pressed }) => [
              styles.buttonAddEmploye,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Text style={styles.textButtonAddEmploye}>
              {translations.addEmploye}
            </Text>
          </Pressable>
        </View>

        {/* //! Verify whats next <View style={styles.employesRoles}></View> */}
      </View>
    </View>
  );
};

export default EmployesManagement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  containerEmployesManagement: {
    flex: 6,
    marginTop: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  textsTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  employesTable: {
    marginTop: 10,
    flex: 1,
  },
  texts: {
    fontSize: 16,
    color: "#555",
  },
  buttonAddEmploye: {
    marginTop: 15,
    backgroundColor: "#6F42C1",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#007BFF",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  employesRoles: {
    marginTop: 20,
  },
  textsTableOfEmployes: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  textButtonAddEmploye: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
