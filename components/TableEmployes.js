import React, { useState, useEffect } from "react";
import { ScrollView, View, Text } from "react-native";
import Loading from "./Loading";

const TableOfEmployes = ({ employes, translations }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (employes) {
      setIsLoading(false);
    }
  }, [employes]);

  if (isLoading)
    return <Loading boolActivityIndicator={true} boolLoadingText={true} />;

  return (
    <ScrollView>
      {employes != null &&
        JSON.parse(employes).map((employe, index) => {
          if (employe.role !== "Owner") {
            return (
              <View
                key={employe.id}
                style={{
                  padding: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: "#ddd",
                }}
              >
                <Text>
                  {translations.name}: {employe.name}
                </Text>
                <Text>
                  {translations.registerDate}:{" "}
                  {new Date(employe.registerTime).toLocaleString()}
                </Text>
                <Text>
                  {translations.role}: {employe.role}
                </Text>
              </View>
            );
          }
        })}
    </ScrollView>
  );
};

export default TableOfEmployes;
