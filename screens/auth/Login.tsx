import {
  logIn,
  getName,
  getDateToken,
  insertInTable,
} from "../../utils/database/DataBaseConnection";
import {
  saveData,
  checkLanguage,
  saveDataSecure,
  loadDataSecure,
  removeDataSecure,
  interpolateMessage,
} from "../../utils/globalVariables/utils";
import {
  View,
  Text,
  Alert,
  Image,
  Switch,
  TextInput,
  Pressable,
  ScrollView,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import {
  appName,
  userImage,
  eyeLooking,
  LanguageKeys,
  eyeNotLooking,
  BOOL_ANIMATIONS,
  ROLE_STORAGE_KEY,
  TOKEN_KEY_STORAGE,
  tableNameErrorLogs,
  RESTAURANT_NAME_KEY_STORAGE,
} from "../../utils/globalVariables/constants";
import Loading from "../../components/common/Loading";
import languages from "../../utils/languages.json";
import AlertModel from "../../components/common/AlertModel";
import ErrorComponent from "../../components/common/ErrorComponent";
import { useFocusEffect } from "@react-navigation/native";
import { useStylesLogin } from "../../styles/stylesLogIn";
import { ResizeMode, Video } from "expo-av";
import React, { useCallback, useEffect, useState } from "react";

interface LoginProps {
  navigation: any;
}

const Login: React.FC<LoginProps> = ({ navigation }) => {
  const styles = useStylesLogin();

  //? language, fonts, token and restaurantName
  const thingsToLoad = 2;
  const [user, setUser] = useState<string>("");
  const [onOk, setOnOk] = useState<() => any>(() => () => setVisible(false));
  const [error, setError] = useState<boolean | null>(null);
  const [title, setTitle] = useState<string>("Title");
  const [OkText, setOkText] = useState<string>("Ok");
  const [message, setMessage] = useState<string>("Message");
  const [loading, setLoading] = useState<boolean>(true);
  const [visible, setVisible] = useState<boolean>(false);
  const [language, setLanguage] = useState<LanguageKeys>("en");
  const [password, setPassword] = useState<string>("");
  const [errorText, setErrorText] = useState<string | null>(null);
  const [cancelText, setCancelText] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [thingsLoaded, setThingsLoaded] = useState<number>(0);
  const [boolLogginIn, setBoolLoggingIn] = useState<boolean>(false);
  const [restaurantName, setRestaurantName] = useState<string>("");
  const [boolShowPassword, setBoolShowPassword] = useState<boolean>(false);
  const [onCancel, setOnCancel] = useState<() => any>(
    () => () => setVisible(false)
  );
  const getTranslations = () => languages[language] || languages.en;

  const loggingIn = async () => {
    const translations = getTranslations();
    setBoolLoggingIn(true);
    if (!password || !user || !restaurantName) {
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
        await saveData(BOOL_ANIMATIONS, "true");

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
      setLanguage((await checkLanguage()) as LanguageKeys);
      setThingsLoaded((prev) => prev + 1);
    };
    const loadTokenAndRestaurantName = async () => {
      const dataToken = await loadDataSecure(TOKEN_KEY_STORAGE);
      const dataRestaurantName = await loadDataSecure(
        RESTAURANT_NAME_KEY_STORAGE
      );

      if (!dataToken || !dataRestaurantName)
        return setThingsLoaded((prev) => prev + 1);

      const { dateToken } = await getDateToken(dataRestaurantName, dataToken);
      const dateOfToken = new Date(dateToken);
      const timeDifference = new Date().getTime() - dateOfToken.getTime();
      const daysDifference = timeDifference / (1000 * 3600 * 24); //? (ms * s * h) => days

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
    useCallback(() => {
      const translations = getTranslations();
      const onBackPress = () => {
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

  if (loading) {
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
        <Loading progress={thingsLoaded / thingsToLoad} />
      </View>
    );
  } else if (error) {
    return (
      <ErrorComponent
        navigation={navigation}
        component="Login"
        error={
          errorText ? errorText : languages[language].errorText + "Uknown error"
        }
      />
    );
  }

  const translations = getTranslations();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AlertModel
        onOk={onOk}
        title={title}
        OkText={OkText}
        visible={visible}
        message={message}
        onCancel={onCancel}
        cancelText={cancelText}
      />
      <Image source={userImage} style={styles.imageUser} />

      <View style={styles.main}>
        <Text style={styles.text}>{translations.logIn}</Text>

        <View style={styles.formLogin}>
          <View style={styles.user}>
            <Text style={styles.textUser}>
              {translations.TextRestaurantName}
            </Text>

            <TextInput
              placeholder={translations.TextRestaurantName}
              onChangeText={(value) => setRestaurantName(value)}
              style={styles.textInputUser}
            />
          </View>

          <View style={styles.user}>
            <Text style={styles.textUser}>{translations.TextUser}</Text>

            <TextInput
              placeholder={translations.TextUser}
              onChangeText={(value) => setUser(value)}
              style={styles.textInputUser}
            />
          </View>

          <View style={styles.pass}>
            <Text style={styles.textPass}>{translations.TextPassword}</Text>

            <View style={{ flexDirection: "row" }}>
              <TextInput
                placeholder={translations.examplePassword}
                style={styles.textInputPass}
                secureTextEntry={!boolShowPassword}
                onChangeText={(value) => setPassword(value)}
                maxLength={100}
              />
              <Pressable
                style={styles.buttonShowPassword}
                onPress={() => setBoolShowPassword((prev) => !prev)}
              >
                {!boolShowPassword ? (
                  <Image
                    source={eyeNotLooking}
                    style={styles.imageShowPassword}
                  />
                ) : (
                  <Video
                    source={eyeLooking}
                    style={styles.videoShowPassword}
                    shouldPlay
                    isLooping
                    resizeMode={"cover" as ResizeMode}
                    rate={0.8}
                  />
                )}
              </Pressable>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.buttonRemeberMe,
              { opacity: pressed ? 0.9 : 1 },
            ]}
            onPress={() => setRememberMe((prev) => !prev)}
          >
            <Text style={styles.rememberMeText}>{translations.rememberMe}</Text>

            <Switch
              value={rememberMe}
              onChange={() => setRememberMe((prev) => !prev)}
            />
          </Pressable>

          <View style={styles.newAccountView}>
            <Text style={styles.newAccountText}>
              {translations.LogInNewAccount}
            </Text>

            <Pressable
              onPress={() => navigation.replace("Signin")}
              style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
            >
              <Text style={styles.textSignin}>{translations.signIn}</Text>
            </Pressable>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.logInButton,
              { opacity: pressed ? 0.5 : 1 },
            ]}
            onPress={() => loggingIn()}
          >
            {boolLogginIn ? (
              <ActivityIndicator size={25} />
            ) : (
              <Text style={styles.logInText}>{translations.logIn}</Text>
            )}
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

export default Login;
