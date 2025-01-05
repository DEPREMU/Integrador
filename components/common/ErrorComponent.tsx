import languages from "../../utils/languages.json";
import { LanguageKeys } from "../../utils/globalVariables/constants";
import { checkLanguage } from "../../utils/globalVariables/utils";
import { View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";

interface ErrorComponentProps {
  error: string | null;
  navigation: Exclude<any, null | undefined>;
  component?: string;
}

/**
 * Error component.
 *
 * @param {Object} props - The component props.
 * @param {string} props.error - The error message.
 * @param {Object} props.navigation - The navigation object.
 * @param {string} [props.component="Login"] - The component name. Default: Login.
 * @returns {JSX.Element} The rendered Error component.
 */
const ErrorComponent: React.FC<ErrorComponentProps> = ({
  error,
  navigation,
  component = "Login",
}) => {
  const [language, setLanguage] = useState<LanguageKeys>("en");

  useEffect(() => {
    const loadLanguage = async () =>
      setLanguage((await checkLanguage()) as LanguageKeys);
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

export default ErrorComponent;
