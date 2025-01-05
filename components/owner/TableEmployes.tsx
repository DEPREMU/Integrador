import Loading from "../common/Loading";
import { Translations } from "../../utils/interfaceTranslations";
import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";

interface TableOfEmployesProps {
  employes: string;
  translations: Translations;
}

const TableOfEmployes: React.FC<TableOfEmployesProps> = ({
  employes,
  translations,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (employes) setIsLoading(false);
  }, [employes]);

  if (isLoading)
    return <Loading boolActivityIndicator={true} boolLoadingText={true} />;

  return (
    <ScrollView
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      {employes != null &&
        JSON.parse(employes).map(
          (employe: {
            id: number;
            role: string;
            name: string;
            registerTime: Date | string;
          }) => {
            if (employe.role !== "Owner") {
              return (
                <View key={employe.id} style={styles.containerEach}>
                  <Text style={styles.name}>
                    {translations.name}: {employe.name}
                  </Text>
                  <Text style={styles.date}>
                    {translations.registerDate}:{" "}
                    {new Date(employe.registerTime).toLocaleString()}
                  </Text>
                  <Text style={styles.role}>
                    {translations.role}: {employe.role}
                  </Text>
                </View>
              );
            }
          }
        )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    paddingVertical: 20,
  },
  containerEach: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  role: {
    fontSize: 14,
    color: "#6F42C1",
    fontWeight: "500",
  },
});

export default TableOfEmployes;
