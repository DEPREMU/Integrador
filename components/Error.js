import React, { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { checkLanguage } from "./globalVariables";
import languages from "./languages.json";

/**
 * Error component.
 *
 * @param {Object} props - The component props.
 * @param {string} props.error - The error message.
 * @param {Object} props.navigation - The navigation object.
 * @param {string} [props.component="Login"] - The component name. Default: Login.
 * @returns {JSX.Element} The rendered Error component.
 */
export default Error = ({ error, navigation, component = "Login" }) => {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const loadLanguage = async () => setLanguage(await checkLanguage());
    loadLanguage();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 18, textAlign: "center" }}>{error}</Text>
      {navigation != null && (
        <Pressable
          style={({ pressed }) => [
            {
              backgroundColor: "gray",
              borderRadius: 5,
              padding: 10,
              marginVertical: 10,
            },
            { opacity: pressed ? 0.5 : 1 },
          ]}
          onPress={() => navigation.replace(component)}
        >
          <Text
            style={{
              color: "white",
              fontSize: 18,
            }}
          >
            {languages[language].retry}
          </Text>
        </Pressable>
      )}
    </View>
  );
};
