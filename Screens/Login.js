import {
  View,
  Text,
  Pressable,
  Image,
  TextInput,
  Alert,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import stylesHS from "../styles/stylesHomeScreen";
import React, { useEffect, useState } from "react";
import {
  checkLanguage,
  Error,
  Loading,
  userImage,
  interpolateMessage,
  TOKEN_KEY_STORAGE,
  RESTAURANT_NAME_KEY_STORAGE,
  BOOL_LOG_OUT,
  saveDataFromDict,
  saveData,
  loadData,
} from "../components/globalVariables";
import languages from "../components/languages.json";
import { getName, getRole, logIn } from "../components/DataBaseConnection";
import { CheckBox } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";

const Login = ({ navigation }) => {
  const thingsToLoad = 2;
  const [thingsLoaded, setThingsLoaded] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Loading.");
  const [error, setError] = useState(null);
  const [errorText, setErrorText] = useState(null);
  const [language, setLanguage] = useState(null);
  const [restaurantName, setRestaurantName] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [boolLogginIn, setBoolLoggingIn] = useState(false);
  const getTranslations = () => languages[language] || languages.en;

  const loggingIn = async () => {
    const translations = getTranslations();
    setBoolLoggingIn(true);
    if (password == "" || user == "" || restaurantName == "") {
      Alert.alert(translations.error, translations.pleaseFillFields, [
        {
          text: translations.ok,
          onPress: () => setBoolLoggingIn(null),
        },
      ]);
      return;
    }

    const { success, token, data, error } = await logIn(
      restaurantName,
      user,
      password
    );
    if (success && token && data) {
      setBoolLoggingIn(false);
      try {
        if (rememberMe) await saveData(TOKEN_KEY_STORAGE, token);
        await saveData(RESTAURANT_NAME_KEY_STORAGE, restaurantName);

        Alert.alert(
          interpolateMessage(translations.welcome, [data.name]),
          translations.logInSuccess,
          [
            {
              text: translations.ok,
              onPress: () => navigation.replace(data.role),
            },
          ]
        );
      } catch (error) {
        setError(true);
        setErrorText(`An error occurred during log in: ${error}`);
      }
    } else if (error && error == "UserOrPasswordWrong")
      Alert.alert(translations.error, translations.userOrPasswordWrong, [
        {
          text: translations.retry,
          onPress: () => setBoolLoggingIn(null),
        },
      ]);
    else if (error == "restaurantDoesNotExist")
      Alert.alert(translations.error, translations.restaurantNameWrong, [
        {
          text: translations.retry,
          onPress: () => setBoolLoggingIn(null),
        },
      ]);
    setBoolLoggingIn(null);
  };

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        setLanguage(await checkLanguage());
      } catch (error) {
        console.error(`Error loading language: ${error}`);
      } finally {
        setThingsLoaded((prevThingsLoaded) => prevThingsLoaded + 1);
      }
    };
    loadLanguage();
  }, []);

  useEffect(() => {
    const translations = getTranslations();

    const loadTokenAndRestaurantName = async () => {
      const dataToken = await loadData(TOKEN_KEY_STORAGE);
      const dataRestaurantName = await loadData(RESTAURANT_NAME_KEY_STORAGE);

      if (dataToken && dataRestaurantName) {
        const { name } = await getName(dataRestaurantName, dataToken);
        const { role, error } = await getRole(dataRestaurantName, dataToken);
        if (role)
          Alert.alert(
            interpolateMessage(translations.welcome, [name ? name : ""]),
            translations.logInSuccess,
            [
              {
                text: translations.ok,
                onPress: () => navigation.replace(role),
              },
            ]
          );
        else {
          setError(true);
          setErrorText(`An error occurred during log in: ${error}`);
        }
      } else setThingsLoaded((prevThingsLoaded) => prevThingsLoaded + 1);
    };
    loadTokenAndRestaurantName();
  }, []);

  useEffect(() => {
    if (!loading || thingsLoaded >= thingsToLoad) setLoading(false);
    let timer;
    timer = setTimeout(() => {
      setLoadingText(() => {
        if (loadingText == "Loading.") return "Loading..";
        else if (loadingText == "Loading..") return "Loading...";
        return "Loading.";
      });
    }, 750);
    return () => clearTimeout(timer);
  }, [loadingText, loading]);

  useFocusEffect(
    React.useCallback(() => {
      const translations = getTranslations();
      const onBackPress = async () => {
        Alert.alert(translations.exitText, translations.exitAppConfirmation, [
          {
            text: translations.cancel,
            onPress: () => null,
          },
          {
            text: translations.exitText,
            onPress: () => BackHandler.exitApp(),
          },
        ]);
        return true;
      };
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [language])
  );

  if (loading)
    return (
      <Loading
        loadingText={loadingText}
        progress={
          thingsLoaded / thingsToLoad > 1 ? 1 : thingsLoaded / thingsToLoad
        }
      />
    );

  if (error)
    return (
      <Error
        navigation={navigation}
        error={
          errorText ? errorText : languages[language].errorText + "Uknown error"
        }
      />
    );

  const translations = getTranslations();

  return (
    <View style={stylesHS.container}>
      <Image source={userImage} style={stylesHS.imageUser} />
      <Text style={stylesHS.text}>{translations.logIn}</Text>

      <View style={stylesHS.formLogin}>
        <View style={stylesHS.user}>
          <Text style={stylesHS.textUser}>
            {translations.TextRestaurantName}
          </Text>

          <TextInput
            placeholder={translations.TextRestaurantName}
            onChangeText={(value) => setRestaurantName(value)}
            style={stylesHS.textInputUser}
          />
        </View>

        <View style={stylesHS.user}>
          <Text style={stylesHS.textUser}>{translations.TextUser}</Text>

          <TextInput
            placeholder={translations.TextUser}
            onChangeText={(value) => setUser(value)}
            style={stylesHS.textInputUser}
          />
        </View>

        <View style={stylesHS.pass}>
          <Text style={stylesHS.textPass}>{translations.TextPassword}</Text>

          <TextInput
            placeholder={translations.TextPassword}
            style={stylesHS.textInputPass}
            secureTextEntry={true}
            onChangeText={(value) => setPassword(value)}
          />
        </View>

        <Pressable
          style={({ pressed }) => [
            stylesHS.ViewRemeberMe,
            { opacity: pressed ? 0.5 : 1 },
          ]}
          onPress={() => setRememberMe(!rememberMe)}
        >
          <CheckBox
            checked={rememberMe}
            onPress={() => setRememberMe(!rememberMe)}
            style={stylesHS.checkRemeberMe}
          />

          <Text style={stylesHS.rememberMeText}>{translations.rememberMe}</Text>
        </Pressable>

        <View style={stylesHS.newAccountView}>
          <Text style={stylesHS.newAccountText}>
            {translations.LogInNewAccount}
          </Text>

          <Pressable
            onPress={() => navigation.replace("Signin")}
            style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
          >
            <Text style={stylesHS.textSignin}>{translations.signIn}</Text>
          </Pressable>
        </View>

        <Pressable
          style={({ pressed }) => [
            stylesHS.signInButton,
            { opacity: pressed ? 0.5 : 1 },
          ]}
          onPress={() => loggingIn()}
        >
          {boolLogginIn ? (
            <ActivityIndicator size={25} />
          ) : (
            <Text style={stylesHS.signInText}>{translations.logIn}</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default Login;
