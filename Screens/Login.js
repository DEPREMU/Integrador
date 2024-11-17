import {
  View,
  Text,
  Alert,
  Image,
  Switch,
  TextInput,
  Pressable,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import stylesMC from "../styles/stylesMainComponents";
import React, { useEffect, useState } from "react";
import {
  appName,
  loadData,
  saveData,
  userImage,
  removeData,
  checkLanguage,
  saveDataSecure,
  loadDataSecure,
  removeDataSecure,
  ROLE_STORAGE_KEY,
  TOKEN_KEY_STORAGE,
  interpolateMessage,
  tableNameErrorLogs,
  RESTAURANT_NAME_KEY_STORAGE,
} from "../components/globalVariables";
import languages from "../components/languages.json";
import {
  logIn,
  getName,
  getRole,
  getDateToken,
  insertInTable,
  updateTableByDict,
} from "../components/DataBaseConnection";
import ErrorComponent from "../components/ErrorComponent";
import Loading from "../components/Loading";
import AlertModel from "../components/AlertModel";
import { useFocusEffect } from "@react-navigation/native";

const Login = ({ navigation }) => {
  const thingsToLoad = 2;
  const [user, setUser] = useState("");
  const [onOk, setOnOk] = useState(() => () => {});
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("Title");
  const [OkText, setOkText] = useState("Ok");
  const [message, setMessage] = useState("Message");
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [onCancel, setOnCancel] = useState(() => () => {});
  const [language, setLanguage] = useState(null);
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState(null);
  const [cancelText, setCancelText] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [thingsLoaded, setThingsLoaded] = useState(0);
  const [boolLogginIn, setBoolLoggingIn] = useState(false);
  const [restaurantName, setRestaurantName] = useState("");
  const getTranslations = () => languages[language] || languages.en;

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
        if (rememberMe) await saveDataSecure(TOKEN_KEY_STORAGE, token);

        await saveDataSecure(RESTAURANT_NAME_KEY_STORAGE, restaurantName);
        await saveDataSecure(ROLE_STORAGE_KEY, data.role);

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
        await insertInTable(tableNameErrorLogs, {
          appName: appName,
          error: error,
          date: new Date().toLocaleString(),
          component: `./Login/loggingIn() if (success && token && data) catch (error) => An error occurred during log in: ${error}`,
        });
      }
    } else if (error && error == "UserOrPasswordWrong") {
      setTitle(translations.error);
      setMessage(translations.userOrPasswordWrong);
      setOnOk(() => () => setVisible(false));
      setOkText(translations.retry);
      setVisible(true);
      setBoolLoggingIn(false);
    } else if (error == "restaurantDoesNotExist") {
      setTitle(translations.error);
      setMessage(translations.restaurantNameWrong);
      setOnOk(() => () => setVisible(false));
      setBoolLoggingIn(false);
      setOkText(translations.retry);
      setVisible(true);
    }

    setBoolLoggingIn(false);
  };

  useEffect(() => {
    const translations = getTranslations();

    const loadLanguage = async () => {
      setLanguage(await checkLanguage());
      setThingsLoaded((prev) => prev + 1);
    };
    const loadTokenAndRestaurantName = async () => {
      const dataToken = await loadDataSecure(TOKEN_KEY_STORAGE);
      const dataRestaurantName = await loadDataSecure(
        RESTAURANT_NAME_KEY_STORAGE
      );

      if (!(dataToken && dataRestaurantName))
        return setThingsLoaded((prev) => prev + 1);

      const { dateToken } = await getDateToken(dataRestaurantName, dataToken);
      const dateOfToken = new Date(dateToken);
      const timeDifference = new Date() - dateOfToken;
      const daysDifference = timeDifference / (1000 * 3600 * 24); //? ms, s, h => days

      if (!dateToken || daysDifference > 30) {
        await removeDataSecure(TOKEN_KEY_STORAGE);
        setTitle(translations.error);
        setMessage(translations.tokenExpired);
        setOnOk(() => () => setVisible(false));
        setOkText(translations.ok);
        setVisible(true);
        setThingsLoaded((prev) => prev + 1);
        return;
      }

      const { name } = await getName(dataRestaurantName, dataToken);
      const role = await loadDataSecure(ROLE_STORAGE_KEY);
      if (role) {
        setTitle(interpolateMessage(translations.welcome, [name ? name : ""]));
        setMessage(translations.logInSuccess);
        setOnOk(() => () => navigation.replace(role));
        setOkText(translations.ok);
        setVisible(true);
      } else {
        setError(true);
        setErrorText(`An error occurred during log in: ${error}`);
        await insertInTable(tableNameErrorLogs, {
          appName: appName,
          error: error,
          date: new Date().toLocaleString(),
          component: `./Login/useEffect() if (role) {} else {} => An error occurred during log in: ${error}`,
        });
      }
    };

    loadLanguage();
    loadTokenAndRestaurantName();
  }, []);

  useEffect(() => {
    if (thingsLoaded >= thingsToLoad) setLoading(false);
  }, [thingsLoaded, loading]);

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
          progress={
            thingsLoaded / thingsToLoad > 1 ? 1 : thingsLoaded / thingsToLoad
          }
        />
      </View>
    );

  if (error)
    return (
      <ErrorComponent
        navigation={navigation}
        component="Login"
        error={
          errorText ? errorText : languages[language].errorText + "Uknown error"
        }
      />
    );

  const translations = getTranslations();

  return (
    <View style={stylesMC.container}>
      <AlertModel
        visible={visible}
        title={title}
        message={message}
        onOk={onOk}
        onCancel={onCancel}
        OkText={OkText}
        cancelText={cancelText}
      />
      <Image source={userImage} style={stylesMC.imageUser} />
      <Text style={stylesMC.text}>{translations.logIn}</Text>

      <View style={stylesMC.formLogin}>
        <View style={stylesMC.user}>
          <Text style={stylesMC.textUser}>
            {translations.TextRestaurantName}
          </Text>

          <TextInput
            placeholder={translations.TextRestaurantName}
            onChangeText={(value) => setRestaurantName(value)}
            style={stylesMC.textInputUser}
          />
        </View>

        <View style={stylesMC.user}>
          <Text style={stylesMC.textUser}>{translations.TextUser}</Text>

          <TextInput
            placeholder={translations.TextUser}
            onChangeText={(value) => setUser(value)}
            style={stylesMC.textInputUser}
          />
        </View>

        <View style={stylesMC.pass}>
          <Text style={stylesMC.textPass}>{translations.TextPassword}</Text>

          <TextInput
            placeholder={translations.TextPassword}
            style={stylesMC.textInputPass}
            secureTextEntry={true}
            onChangeText={(value) => setPassword(value)}
          />
        </View>

        <Pressable
          style={({ pressed }) => [
            stylesMC.ViewRemeberMe,
            { opacity: pressed ? 0.5 : 1 },
          ]}
          onPress={() => setRememberMe((prev) => !prev)}
        >
          <Text style={stylesMC.rememberMeText}>{translations.rememberMe}</Text>

          <Switch
            value={rememberMe}
            onChange={() => setRememberMe((prev) => !prev)}
          />
        </Pressable>

        <View style={stylesMC.newAccountView}>
          <Text style={stylesMC.newAccountText}>
            {translations.LogInNewAccount}
          </Text>

          <Pressable
            onPress={() => navigation.replace("Signin")}
            style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
          >
            <Text style={stylesMC.textSignin}>{translations.signIn}</Text>
          </Pressable>
        </View>

        <Pressable
          style={({ pressed }) => [
            stylesMC.signInButton,
            { opacity: pressed ? 0.5 : 1 },
          ]}
          onPress={() => loggingIn()}
        >
          {boolLogginIn ? (
            <ActivityIndicator size={25} />
          ) : (
            <Text style={stylesMC.signInText}>{translations.logIn}</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default Login;
