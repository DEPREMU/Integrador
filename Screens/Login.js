import {
  View,
  Text,
  Pressable,
  Image,
  TextInput,
  BackHandler,
  Alert,
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
  saveData,
  loadData,
} from "../components/globalVariables";
import languages from "../components/languages.json";
import { getName, getRole, logIn } from "../components/DataBaseConnection";
import { CheckBox } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import AlertModel from "../components/AlertModel";

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
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("Title");
  const [message, setMessage] = useState("Message");
  const [onOk, setOnOk] = useState(() => () => {});
  const [onCancel, setOnCancel] = useState(() => () => {});
  const [OkText, setOkText] = useState("Ok");
  const [cancelText, setCancelText] = useState(null);

  const loggingIn = async () => {
    const translations = getTranslations();
    setBoolLoggingIn(true);
    if (password == "" || user == "" || restaurantName == "") {
      setTitle(translations.error);
      setMessage(translations.pleaseFillFields);
      setOnOk(() => () => setVisible(false));
      setOkText(translations.ok);
      setVisible(true);
      setBoolLoggingIn(false);
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

        setTitle(interpolateMessage(translations.welcome, [data.name]));
        setMessage(translations.logInSuccess);
        setOnOk(() => () => {
          navigation.replace(data.role);
          setVisible(false);
        });
        setOkText(translations.ok);
        setVisible(true);
      } catch (error) {
        setError(true);
        setErrorText(`An error occurred during log in: ${error}`);
      }
    } else if (error && error == "UserOrPasswordWrong") {
      setTitle(translations.error);
      setMessage(translations.userOrPasswordWrong);
      setOnOk(() => () => setVisible(false));
      setOkText(translations.retry);
      setVisible(true);
      setBoolLoggingIn(false);
      console.log("User");
    } else if (error == "restaurantDoesNotExist") {
      setTitle(translations.error);
      setMessage(translations.restaurantNameWrong);
      setOnOk(() => () => setVisible(false));
      setBoolLoggingIn(false);
      setOkText(translations.retry);
      setVisible(true);
      console.log("restaurant");
    }

    setBoolLoggingIn(false);
  };

  useEffect(() => {
    const loadLanguage = async () => {
      setLanguage(await checkLanguage());
      setThingsLoaded((prevThingsLoaded) => prevThingsLoaded + 1);
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
        if (role) {
          setTitle(
            interpolateMessage(translations.welcome, [name ? name : ""])
          );
          setMessage(translations.logInSuccess);
          setOnOk(() => () => navigation.replace(role));
          setOkText(translations.ok);
          setVisible(true);
        } else {
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
      <View style={{ flex: 1 }}>
        <AlertModel
          visible={visible}
          title={title}
          message={message}
          onOk={onOk}
          onCancel={onCancel}
          OkText={OkText}
          cancelText={cancelText}
        />
        <Loading
          loadingText={loadingText}
          progress={
            thingsLoaded / thingsToLoad > 1 ? 1 : thingsLoaded / thingsToLoad
          }
        />
      </View>
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
      <AlertModel
        visible={visible}
        title={title}
        message={message}
        onOk={onOk}
        onCancel={onCancel}
        OkText={OkText}
        cancelText={cancelText}
      />
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
