import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  BackHandler,
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
  loadData,
  RESTAURANT_NAME_KEY_STORAGE,
  LANGUAGE_KEY_STORAGE,
  BOOL_LOG_OUT,
} from "../components/globalVariables";
import AsyncStorage from "@react-native-async-storage/async-storage";
import languages from "../components/languages.json";
import { getName, getRole, logIn } from "../components/DataBaseConnection";
import { CheckBox } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import { supabase } from "../components/supabaseClient";

const Login = ({ navigation }) => {
  const thingsToLoad = 2;
  const [thingsLoaded, setThingsLoaded] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Loading.");
  const [error, setError] = useState(true);
  const [errorText, setErrorText] = useState(null);
  const [language, setLanguage] = useState(null);
  const [restaurantName, setRestaurantName] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const depurar = async () => {
    const user = "n s s1";
    const password = "2 2 2 2";
    const name = "n s s";
    const token = "nr91ru391r91u3bur";
    const role = "owner";
    const restaurantName = "Test7";
    await supabase.from(restaurantName).insert([
      {
        username: user,
        password: password,
        name: name,
        token: token,
        role: role,
      },
    ]);
    const { data, error } = await supabase.from(restaurantName).select("*");
    console.log(data);
    console.log(error);
  };

  const checkUser = async () => {
    if (password == "" || user == "" || restaurantName == "") {
      Alert.alert(
        languages.error[language],
        languages.pleaseFillFields[language],
        [
          {
            text: languages.ok[language],
          },
        ]
      );
      return;
    }

    const {
      success,
      token,
      data: data1,
      error,
    } = await logIn(restaurantName, user, password);
    if (success && token != null) {
      try {
        if (rememberMe) {
          await AsyncStorage.setItem(TOKEN_KEY_STORAGE, token);
          await AsyncStorage.getItem(TOKEN_KEY_STORAGE);
          await AsyncStorage.setItem(
            RESTAURANT_NAME_KEY_STORAGE,
            restaurantName
          );
          await AsyncStorage.getItem(RESTAURANT_NAME_KEY_STORAGE);
        }
        Alert.alert(
          interpolateMessage(languages.welcome[language], [data1.name]),
          languages.logInSuccess[language],
          [
            {
              text: languages.ok[language],
            },
          ]
        );
        const { success, role, error } = await getRole(
          restaurantName,
          String(token)
        );
        if (success && role) {
          await AsyncStorage.setItem(BOOL_LOG_OUT, "0");
          navigation.navigate(role);
        }
      } catch (error) {
        setError(true);
        setErrorText(`An error occurred during log in: ${error}`);
      }
    } else if (error && error == "UserOrPasswordWrong") {
      Alert.alert(
        languages.error[language],
        languages.userOrPasswordWrong[language],
        [
          {
            text: languages.retry[language],
          },
        ]
      );
    } else if (error == "restaurantDoesNotExist") {
      Alert.alert(
        languages.error[language],
        languages.restaurantNameWrong[language],
        [
          {
            text: languages.retry[language],
          },
        ]
      );
    }
  };

  useEffect(() => {
    const changeLanguage = async () => {
      try {
        const language = await checkLanguage();
        setLanguage(language);
      } catch (error) {
        setLanguage("en");
      } finally {
        setThingsLoaded((prevThingsLoaded) => prevThingsLoaded + 1);
      }
    };
    changeLanguage();
  }, []);

  useEffect(() => {
    const loadTokenAndRestaurantName = async () => {
      const dataToken = await loadData(TOKEN_KEY_STORAGE);
      const dataRestaurantName = await loadData(RESTAURANT_NAME_KEY_STORAGE);
      const language = await loadData(LANGUAGE_KEY_STORAGE);
      if (dataToken != null && dataRestaurantName != null) {
        const { name } = await getName(dataRestaurantName, dataToken);
        const { success, role, error } = await getRole(
          dataRestaurantName,
          dataToken
        );
        if (success && role) {
          Alert.alert(
            interpolateMessage(languages.welcome[language], [
              name != null ? name : "",
            ]),
            languages.logInSuccess[language],
            [
              {
                text: languages.ok[language],
              },
            ]
          );
          navigation.navigate(role);
        } else {
          setError(true);
          setErrorText("An error occurred during log in: " + error);
        }
      } else setThingsLoaded((prevThingsLoaded) => prevThingsLoaded + 1);
    };
    loadTokenAndRestaurantName();
  }, []);

  useEffect(() => {
    if (thingsLoaded >= thingsToLoad) setLoading(false);

    if (!loading) return;
    setTimeout(() => {
      if (loadingText == "Loading.") setLoadingText("Loading..");
      if (loadingText == "Loading..") setLoadingText("Loading...");
      if (loadingText == "Loading...") setLoadingText("Loading.");
    }, 750);
  }, [loadingText, loading]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = async () => {
        Alert.alert(
          languages.exitText[language],
          languages.exitAppConfirmation[language],
          [
            {
              text: languages.cancel[language],
              onPress: () => null,
            },
            {
              text: languages.exitText[language],
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

  if (loading) return <Loading loadingText={loadingText} />;
  if (error && errorText != null)
    return <Error error={errorText != null ? errorText : "Uknown error"} />;

  return (
    <View style={stylesHS.container}>
      <Image source={userImage} style={stylesHS.imageUser} />
      <Text style={stylesHS.text}>{languages.logIn[language]}</Text>

      <View style={stylesHS.formLogin}>
        <View style={stylesHS.user}>
          <Text style={stylesHS.textUser}>
            {languages.TextRestaurantName[language]}
          </Text>

          <TextInput
            placeholder={languages.TextRestaurantName[language]}
            onChangeText={(value) => setRestaurantName(value)}
            style={stylesHS.textInputUser}
          />
        </View>

        <View style={stylesHS.user}>
          <Text style={stylesHS.textUser}>{languages.TextUser[language]}</Text>

          <TextInput
            placeholder={languages.TextUser[language]}
            onChangeText={(value) => setUser(value)}
            style={stylesHS.textInputUser}
          />
        </View>

        <View style={stylesHS.pass}>
          <Text style={stylesHS.textPass}>
            {languages.TextPassword[language]}
          </Text>

          <TextInput
            placeholder={languages.TextPassword[language]}
            style={stylesHS.textInputPass}
            secureTextEntry={true}
            onChangeText={(value) => setPassword(value)}
          />
        </View>

        <View style={stylesHS.ViewRemeberMe}>
          <CheckBox
            checked={rememberMe}
            onPress={() => setRememberMe(!rememberMe)}
            style={stylesHS.checkRemeberMe}
          />

          <Text style={stylesHS.rememberMeText}>
            {languages.rememberMe[language]}
          </Text>
        </View>

        <View style={stylesHS.newAccountView}>
          <Text style={stylesHS.newAccountText}>
            {languages.LogInNewAccount[language]}
          </Text>

          <TouchableOpacity onPress={() => navigation.navigate("Signin")}>
            <Text style={stylesHS.textSignin}>
              {languages.signIn[language]}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={stylesHS.signInButton}
          onPress={() => checkUser()}
        >
          <Text style={stylesHS.signInText}>{languages.logIn[language]}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={stylesHS.signInButton}
          onPress={() => depurar()}
        >
          <Text style={stylesHS.signInText}>Depurar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default Login;
