import {
  signIn,
  getName,
  getDateToken,
  boolUserExist,
  insertInTable,
  boolIsRestaurant,
} from "../components/DataBaseConnection";
import {
  View,
  Text,
  Alert,
  Image,
  Platform,
  Pressable,
  TextInput,
  ScrollView,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import {
  appName,
  userImage,
  hashPassword,
  checkLanguage,
  loadDataSecure,
  removeDataSecure,
  TOKEN_KEY_STORAGE,
  interpolateMessage,
  tableNameErrorLogs,
  RESTAURANT_NAME_KEY_STORAGE,
  ROLE_STORAGE_KEY,
  eyeNotLooking,
  eyeLooking,
} from "../components/globalVariables";
import Loading from "../components/Loading";
import languages from "../components/languages.json";
import AlertModel from "../components/AlertModel";
import ErrorComponent from "../components/ErrorComponent";
import { useFocusEffect } from "@react-navigation/native";
import { Picker, PickerIOS } from "@react-native-picker/picker";
import { stylesSignUp } from "../styles/stylesSignUp";
import React, { useEffect, useState, useCallback } from "react";
import { Video } from "expo-av";

const Signin = ({ navigation }) => {
  const styles = stylesSignUp();
  const thingsToLoad = 3;

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [user, setUser] = useState("");
  const [onOk, setOnOk] = useState(() => () => setVisible(false));
  const [error, setError] = useState(false);
  const [title, setTitle] = useState("Title");
  const [OkText, setOkText] = useState("Ok");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Message");
  const [options, setOptions] = useState(null);
  const [visible, setVisible] = useState(false);
  const [onCancel, setOnCancel] = useState(() => () => setVisible(false));
  const [language, setLanguage] = useState(null);
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [cancelText, setCancelText] = useState(null);
  const [thingsLoaded, setThingsLoaded] = useState(0);
  const [boolSigningIn, setBoolSigningIn] = useState(false);
  const [restaurantName, setRestaurantName] = useState("");
  const [boolShowPassword, setBoolShowPassword] = useState(false);
  const getTranslations = () => languages[language] || languages.en;
  const checkRestaurantName = (value) =>
    value.indexOf(" ") == -1 ? setRestaurantName(value) : null;

  const signingIn = async () => {
    try {
      const translations = getTranslations();
      const indexOfRole = translations.options.indexOf(role);
      const roleValue = languages.en.options[indexOfRole];
      console.log(roleValue);

      const hashedPassword = hashPassword(password);
      const { success, error } = await signIn(
        restaurantName,
        user,
        hashedPassword,
        roleValue,
        name
      );

      if (success) {
        setTitle(translations.signIn);
        setMessage(translations.signInSuccess);
        setOkText(translations.logIn);
        setOnOk(() => () => navigation.replace("Login"));
        setCancelText(null);
        setVisible(true);
      } else {
        setError(true);
        setErrorText(error);
        console.error(`Error during sign in: ${error}`);
        await insertInTable(tableNameErrorLogs, {
          appName: appName,
          error: error,
          date: new Date().toLocaleString(),
          component: `./Screens/Signin/signingIn() else {} => Error during sign in: ${error}`,
        });
      }
    } catch (error) {
      setError(true);
      setErrorText(`An error occurred during sign in. ${error}`);
      console.error("Error during sign in:", error);
      await insertInTable(tableNameErrorLogs, {
        appName: appName,
        error: `An error occurred during sign in. ${error}`,
        date: new Date().toLocaleString(),
        component: `./Screens/Signin/signingIn() catch (error) => Error during sign in: ${error}`,
      });
    }
  };

  const checkSignin = async () => {
    setBoolSigningIn(true);
    const translations = getTranslations();
    if (user == "" || password == "" || name == "" || restaurantName == "") {
      setTitle(translations.error);
      setMessage(translations.pleaseFillFields);
      setCancelText(null);
      setOkText(translations.ok);
      setOnOk(() => () => {
        setVisible(false);
        setBoolSigningIn(false);
      });
      setVisible(true);
      return;
    }

    if (isFinite(restaurantName[0])) {
      setTitle(translations.error);
      setMessage(translations.noNumbersInName);
      setCancelText(null);
      setOkText(translations.ok);
      setOnOk(() => () => {
        setVisible(false);
        setBoolSigningIn(false);
      });
      setVisible(true);
      return;
    }

    const boolExistRestaurant = await boolIsRestaurant(restaurantName);

    if (!boolExistRestaurant && role != translations.options[3]) {
      setTitle(translations.error);
      setMessage(translations.restaurantNameWrong);
      setOkText(translations.ok);
      setOnOk(() => () => {
        setVisible(false);
        setBoolSigningIn(false);
        setCancelText(null);
      });
      setVisible(true);
      return;
    } else if (role == translations.options[3] && boolExistRestaurant) {
      setTitle(translations.error);
      setMessage(translations.restaurantAlreadyExists);
      setOkText(translations.ok);
      setOnOk(() => () => {
        setVisible(false);
        setBoolSigningIn(false);
        setCancelText(null);
      });
      setVisible(true);
      return;
    }

    const boolUserExists = await boolUserExist(restaurantName, user);
    if (boolUserExists) {
      setTitle(translations.error);
      setMessage(translations.userAlreadyExists);
      setCancelText(null);
      setOkText(translations.ok);
      setOnOk(() => () => {
        setVisible(false);
        setBoolSigningIn(false);
      });
      setVisible(true);
      return;
    }

    //Preguntar si iniciar sesion
    setOnCancel(() => () => {
      setBoolSigningIn(false);
      setVisible(false);
    });
    setOnOk(() => () => {
      setVisible(false);
      signingIn();
    });
    setTitle(translations.signIn);
    setMessage(translations.askSignIn);
    setVisible(true);
    setCancelText(translations.cancel);
    setOkText(translations.ok);
  };

  useEffect(() => {
    const loadLanguage = async () => {
      setLanguage(await checkLanguage());
      setThingsLoaded((prev) => prev + 1);
    };

    const loadOptions = async () => {
      try {
        const lang = await checkLanguage();
        const opts = languages[lang].options;
        if (opts && opts.length > 0) {
          setOptions(opts);
          setRole(opts[0]);
          setThingsLoaded((prev) => prev + 1);
        } else {
          setError(true);
          setErrorText("No options available.");
          await insertInTable(tableNameErrorLogs, {
            appName: appName,
            error: `No options available: Options: {${options}}, lang {${lang}}`,
            date: new Date().toLocaleString(),
            component:
              "./Screens/Signin/loadOptions() else {} => No options available.",
          });
        }
      } catch (error) {
        setError(true);
        setErrorText(error.message || "An error occurred.");
        console.error("Error loading options:", error);
        await insertInTable(tableNameErrorLogs, {
          appName: appName,
          error: error.message,
          date: new Date().toLocaleString(),
          component: `./Screens/Signin/loadOptions() catch (error) => Error loading options: ${error}`,
        });
      }
    };

    const loadTokenAndRestaurantName = async () => {
      const lang = await checkLanguage();
      const translations = languages[lang];
      const dataToken = await loadDataSecure(TOKEN_KEY_STORAGE);
      const dataRestaurantName = await loadDataSecure(
        RESTAURANT_NAME_KEY_STORAGE
      );

      if (dataToken && dataRestaurantName) {
        const { dateToken } = await getDateToken(dataRestaurantName, dataToken);
        const dateOfToken = new Date(dateToken);
        const currentDate = new Date();
        const timeDifference = currentDate - dateOfToken;
        const daysDifference = timeDifference / (1000 * 3600 * 24);

        if (!dateToken || daysDifference > 30) {
          await removeDataSecure(TOKEN_KEY_STORAGE);
          setTitle(translations.error);
          setMessage(translations.tokenExpired);
          setOnOk(() => () => navigation.replace("Login"));
          setOkText(translations.ok);
          setVisible(true);
          return;
        }

        const { name } = await getName(dataRestaurantName, dataToken);
        const role = await loadDataSecure(ROLE_STORAGE_KEY);
        if (role) {
          setTitle(interpolateMessage(translations.welcome, [name || ""]));
          setMessage(translations.logInSuccess);
          setOnOk(() => () => navigation.replace(role));
          setOkText(translations.ok);
          setVisible(true);
        } else {
          setError(true);
          setErrorText(`An error occurred during log in.`);
          console.error("Error during log in:");
          await insertInTable(tableNameErrorLogs, {
            appName: appName,
            error: `An error occurred during log in.`,
            date: new Date().toLocaleString(),
            component: `./Screens/Signin/loadTokenAndRestaurantName() else {} => Error during log in`,
          });
        }
      } else setThingsLoaded((prevThingsLoaded) => prevThingsLoaded + 1);
    };

    loadLanguage();
    loadTokenAndRestaurantName();
    loadOptions();
  }, []);

  useEffect(() => {
    if (thingsLoaded >= thingsToLoad) setLoading(false);
  }, [thingsLoaded]);

  useFocusEffect(
    useCallback(() => {
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

        <Loading progress={thingsLoaded / thingsToLoad} />
      </View>
    );
  if (error)
    return (
      <ErrorComponent
        navigation={navigation}
        component="Signin"
        error={errorText}
      />
    );

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
        visible={visible}
        title={title}
        message={message}
        onOk={onOk}
        onCancel={onCancel}
        OkText={OkText}
        cancelText={cancelText}
      />
      <View style={styles.main}>
        <Image source={userImage} style={styles.imageUser} />

        <Text style={styles.text}>{translations.signIn}</Text>
        <View style={styles.formSignin}>
          <View style={styles.user}>
            <Text style={styles.textUser}>
              {translations.TextRestaurantName}
            </Text>

            <TextInput
              placeholder={translations.exampleRestaurantName}
              value={restaurantName}
              onChangeText={(value) => checkRestaurantName(value)}
              style={styles.textInputUser}
              maxLength={100}
            />
          </View>

          <View style={styles.user}>
            <Text style={styles.textUser}>{translations.TextName}</Text>
            <TextInput
              placeholder={translations.exampleName}
              onChangeText={(value) => setName(value)}
              style={styles.textInputUser}
              maxLength={100}
            />
          </View>

          <View style={styles.user}>
            <Text style={styles.textUser}>{translations.TextUser}</Text>
            <TextInput
              placeholder={translations.exampleUserName}
              onChangeText={(value) => setUser(value)}
              style={styles.textInputUser}
              maxLength={50}
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
                    style={{
                      width: 40,
                      height: 40,
                      right: -5,
                    }}
                    shouldPlay
                    isLooping
                    resizeMode="cover"
                    rate={0.8}
                  />
                )}
              </Pressable>
            </View>
          </View>

          <Text style={styles.roles}>{translations.TextRoles}</Text>

          <View style={styles.pickerContainer}>
            {Platform.OS == "ios" && (
              <PickerIOS
                selectedValue={role}
                onValueChange={(itemValue) => setRole(itemValue)}
                style={styles.pickerIOS}
              >
                {options.map((option, index) => (
                  <PickerIOS.Item key={index} label={option} value={option} />
                ))}
              </PickerIOS>
            )}
            {Platform.OS != "ios" && (
              <Picker
                selectedValue={role}
                onValueChange={(itemValue) => setRole(itemValue)}
                style={styles.picker}
              >
                {options.map((option, index) => (
                  <Picker.Item key={index} label={option} value={option} />
                ))}
              </Picker>
            )}
          </View>

          <View style={styles.newAccountView}>
            <Text style={styles.newAccountText}>
              {translations.SignInLogIn}
            </Text>

            <Pressable
              onPress={() => navigation.replace("Login")}
              style={({ pressed }) => [
                styles.buttonLogIn,
                { opacity: pressed ? 0.5 : 1 },
              ]}
            >
              <Text style={styles.textLogin}>{translations.logIn}</Text>
            </Pressable>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.signInButton,
              { opacity: pressed ? 0.5 : 1 },
            ]}
            onPress={() => checkSignin()}
          >
            {boolSigningIn ? (
              <ActivityIndicator size={25} />
            ) : (
              <Text style={styles.signInText}>{translations.signIn}</Text>
            )}
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

export default Signin;
