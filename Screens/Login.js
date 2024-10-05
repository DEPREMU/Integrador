import {
  View,
  Text,
  TouchableOpacity,
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
  LANGUAGE_KEY_STORAGE,
  BOOL_LOG_OUT,
  saveDataFromDict,
  loadDataInDict,
  saveData,
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
  const getTranlations = () => languages[language] || languages.en;

  const loggingIn = async () => {
    setBoolLoggingIn(true);
    if (password == "" || user == "" || restaurantName == "") {
      Alert.alert(getTranlations().error, getTranlations().pleaseFillFields, [
        {
          text: getTranlations().ok,
          onPress: () => {
            setBoolLoggingIn(null);
          },
        },
      ]);
      return;
    }

    const { success, token,tokenTime,  data, error } = await logIn(
      restaurantName,
      user,
      password
    );
    if (success && token) {
      setBoolLoggingIn(false);
      try {
        if (rememberMe) {
          await saveData(TOKEN_KEY_STORAGE, token);
        }

        const { success, role } = await getRole(restaurantName, String(token));
        if (success && role) {
          await saveDataFromDict({
            [BOOL_LOG_OUT]: "0",
            [RESTAURANT_NAME_KEY_STORAGE]: restaurantName,
          });
          Alert.alert(
            interpolateMessage(getTranlations().welcome, [data.name]),
            getTranlations().logInSuccess,
            [
              {
                text: getTranlations().ok,
                onPress: () => navigation.replace(role),
              },
            ]
          );
        }
      } catch (error) {
        setError(true);
        setErrorText(`An error occurred during log in: ${error}`);
      }
    } else if (error && error == "UserOrPasswordWrong")
      Alert.alert(
        getTranlations().error,
        getTranlations().userOrPasswordWrong,
        [
          {
            text: getTranlations().retry,
          },
        ]
      );
    else if (error == "restaurantDoesNotExist")
      Alert.alert(
        getTranlations().error,
        getTranlations().restaurantNameWrong,
        [
          {
            text: getTranlations().retry,
          },
        ]
      );
    setBoolLoggingIn(false);
  };

  useEffect(() => {
    const changeLanguage = async () => {
      try {
        setLanguage(await checkLanguage());
      } catch (error) {
        console.error(`Error loading language ${error}`);
      } finally {
        setThingsLoaded((prevThingsLoaded) => prevThingsLoaded + 1);
      }
    };
    changeLanguage();
  }, []);

  useEffect(() => {
    const loadTokenAndRestaurantName = async () => {
      const loadedData = await loadDataInDict([
        TOKEN_KEY_STORAGE,
        RESTAURANT_NAME_KEY_STORAGE,
        LANGUAGE_KEY_STORAGE,
      ]);
      const {
        [TOKEN_KEY_STORAGE]: dataToken,
        [RESTAURANT_NAME_KEY_STORAGE]: dataRestaurantName,
        [LANGUAGE_KEY_STORAGE]: language,
      } = loadedData;

      if (dataToken && dataRestaurantName) {
        const { name } = await getName(dataRestaurantName, dataToken);
        const { role, error } = await getRole(dataRestaurantName, dataToken);
        if (role)
          Alert.alert(
            interpolateMessage(getTranlations().welcome, [name ? name : ""]),
            getTranlations().logInSuccess,
            [
              {
                text: getTranlations().ok,
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
      const onBackPress = async () => {
        Alert.alert(
          getTranlations().exitText,
          getTranlations().exitAppConfirmation,
          [
            {
              text: getTranlations().cancel,
              onPress: () => null,
            },
            {
              text: getTranlations().exitText,
              onPress: () => BackHandler.exitApp(),
            },
          ]
        );
        return true;
      };
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
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

  return (
    <View style={stylesHS.container}>
      <Image source={userImage} style={stylesHS.imageUser} />
      <Text style={stylesHS.text}>{languages[language].logIn}</Text>

      <View style={stylesHS.formLogin}>
        <View style={stylesHS.user}>
          <Text style={stylesHS.textUser}>
            {languages[language].TextRestaurantName}
          </Text>

          <TextInput
            placeholder={languages[language].TextRestaurantName}
            onChangeText={(value) => setRestaurantName(value)}
            style={stylesHS.textInputUser}
          />
        </View>

        <View style={stylesHS.user}>
          <Text style={stylesHS.textUser}>{languages[language].TextUser}</Text>

          <TextInput
            placeholder={languages[language].TextUser}
            onChangeText={(value) => setUser(value)}
            style={stylesHS.textInputUser}
          />
        </View>

        <View style={stylesHS.pass}>
          <Text style={stylesHS.textPass}>
            {languages[language].TextPassword}
          </Text>

          <TextInput
            placeholder={languages[language].TextPassword}
            style={stylesHS.textInputPass}
            secureTextEntry={true}
            onChangeText={(value) => setPassword(value)}
          />
        </View>

        <TouchableOpacity
          style={stylesHS.ViewRemeberMe}
          onPress={() => setRememberMe(!rememberMe)}
        >
          <CheckBox
            checked={rememberMe}
            onPress={() => setRememberMe(!rememberMe)}
            style={stylesHS.checkRemeberMe}
          />

          <Text style={stylesHS.rememberMeText}>
            {languages[language].rememberMe}
          </Text>
        </TouchableOpacity>

        <View style={stylesHS.newAccountView}>
          <Text style={stylesHS.newAccountText}>
            {languages[language].LogInNewAccount}
          </Text>

          <TouchableOpacity onPress={() => navigation.navigate("Signin")}>
            <Text style={stylesHS.textSignin}>
              {languages[language].signIn}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={stylesHS.signInButton}
          onPress={() => loggingIn()}
        >
          {boolLogginIn ? (
            <ActivityIndicator size={25} />
          ) : (
            <Text style={stylesHS.signInText}>{languages[language].logIn}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;
