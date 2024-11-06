import {
  signIn,
  getName,
  getRole,
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
  Pressable,
  TextInput,
  ScrollView,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import {
  appName,
  loadData,
  userImage,
  removeData,
  hashPassword,
  checkLanguage,
  TOKEN_KEY_STORAGE,
  interpolateMessage,
  tableNameErrorLogs,
  LANGUAGE_KEY_STORAGE,
  RESTAURANT_NAME_KEY_STORAGE,
} from "../components/globalVariables";
import Error from "../components/Error";
import Loading from "../components/Loading";
import stylesMC from "../styles/stylesMainComponents";
import languages from "../components/languages.json";
import AlertModel from "../components/AlertModel";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState, useCallback } from "react";

const Signin = ({ navigation }) => {
  const thingsToLoad = 3;
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [user, setUser] = useState("");
  const [error, setError] = useState(false);
  const [title, setTitle] = React.useState("Titulo");
  const [OkText, setOkText] = React.useState("Ok");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = React.useState("Mensaje");
  const [options, setOptions] = useState(null);
  const [visible, setVisible] = React.useState(false);
  const [language, setLanguage] = useState(null);
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [cancelText, setCancelText] = React.useState(null);
  const [loadingText, setLoadingText] = useState("Loading.");
  const [thingsLoaded, setThingsLoaded] = useState(0);
  const [boolSigningIn, setBoolSigningIn] = useState(false);
  const [restaurantName, setRestaurantName] = useState("");
  const getTranslations = () => languages[language] || languages.en;
  const checkRestaurantName = (value) =>
    value.indexOf(" ") === -1 ? setRestaurantName(value) : null;
  const [onOk, setOnOk] = useState(() => () => {
    console.log("Modificar!!");
    setVisible(false);
  });
  const [onCancel, setOnCancel] = useState(() => () => {
    console.log("Modificar!!");
    setVisible(false);
  });

  const signingIn = async () => {
    try {
      const translations = getTranslations();
      const indexOfRole = translations.options.indexOf(role);
      const roleValue = languages.en.options[indexOfRole];
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

    if (!boolExistRestaurant && role != translations.options[2]) {
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
    } else if (role == translations.options[2] && boolExistRestaurant) {
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
        const lang = await loadData(LANGUAGE_KEY_STORAGE);
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
      const lang = await loadData(LANGUAGE_KEY_STORAGE);
      const translations = languages[lang];
      const dataToken = await loadData(TOKEN_KEY_STORAGE);
      const dataRestaurantName = await loadData(RESTAURANT_NAME_KEY_STORAGE);

      if (dataToken && dataRestaurantName) {
        const { dateToken } = await getDateToken(dataRestaurantName, dataToken);
        const dateOfToken = new Date(dateToken);
        const currentDate = new Date();
        const timeDifference = currentDate - dateOfToken;
        const daysDifference = timeDifference / (1000 * 3600 * 24);

        if (!dateToken || daysDifference > 30) {
          await removeData(TOKEN_KEY_STORAGE);
          setTitle(translations.error);
          setMessage(translations.tokenExpired);
          setOnOk(() => () => navigation.replace("Login"));
          setOkText(translations.ok);
          setVisible(true);
          return;
        }

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
          console.error("Error during log in:", error);
          await insertInTable(tableNameErrorLogs, {
            appName: appName,
            error: `An error occurred during log in: ${error}`,
            date: new Date().toLocaleString(),
            component: `./Screens/Signin/loadTokenAndRestaurantName() else {} => Error during log in: ${error}`,
          });
        }
      } else setThingsLoaded((prevThingsLoaded) => prevThingsLoaded + 1);
    };

    loadLanguage();
    loadTokenAndRestaurantName();
    loadOptions();
  }, []);

  useEffect(() => {
    let timer;
    if (thingsLoaded >= thingsToLoad) setLoading(false);
    else
      timer = setTimeout(() => {
        setLoadingText((prev) => {
          if (prev === "Loading.") return "Loading..";
          else if (prev === "Loading..") return "Loading...";
          return "Loading.";
        });
      }, 750);

    return () => clearTimeout(timer);
  }, [loadingText]);

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

        <Loading
          progress={
            thingsLoaded / thingsToLoad > 1 ? 1 : thingsLoaded / thingsToLoad
          }
        />
      </View>
    );
  if (error)
    return (
      <Error navigation={navigation} component="Signin" error={errorText} />
    );

  const translations = getTranslations();

  return (
    <ScrollView style={stylesMC.scrollView}>
      <AlertModel
        visible={visible}
        title={title}
        message={message}
        onOk={onOk}
        onCancel={onCancel}
        OkText={OkText}
        cancelText={cancelText}
      />
      <View style={stylesMC.container}>
        <Image source={userImage} style={stylesMC.imageUser} />

        <Text style={stylesMC.text}>{translations.signIn}</Text>

        <View style={stylesMC.formLogin}>
          <View style={stylesMC.user}>
            <Text style={stylesMC.textUser}>
              {translations.TextRestaurantName}
            </Text>

            <TextInput
              placeholder={translations.TextRestaurantName}
              value={restaurantName}
              onChangeText={(value) => checkRestaurantName(value)}
              style={stylesMC.textInputUser}
              maxLength={100}
            />
          </View>

          <View style={stylesMC.user}>
            <Text style={stylesMC.textUser}>{translations.TextName}</Text>
            <TextInput
              placeholder={translations.TextName}
              onChangeText={(value) => setName(value)}
              style={stylesMC.textInputUser}
              maxLength={100}
            />
          </View>

          <View style={stylesMC.user}>
            <Text style={stylesMC.textUser}>{translations.TextUser}</Text>
            <TextInput
              placeholder={translations.TextUser}
              onChangeText={(value) => setUser(value)}
              style={stylesMC.textInputUser}
              maxLength={50}
            />
          </View>

          <View style={stylesMC.pass}>
            <Text style={stylesMC.textPass}>{translations.TextPassword}</Text>
            <TextInput
              placeholder={translations.TextPassword}
              style={stylesMC.textInputPass}
              secureTextEntry={true}
              onChangeText={(value) => setPassword(value)}
              maxLength={100}
            />
          </View>

          <Text style={stylesMC.roles}>{translations.TextRoles}</Text>

          <View style={stylesMC.pickerContainer}>
            {options != null && (
              <Picker
                selectedValue={role}
                onValueChange={(itemValue) => setRole(itemValue)}
                style={stylesMC.picker}
              >
                {options.map((option, index) => (
                  <Picker.Item key={index} label={option} value={option} />
                ))}
              </Picker>
            )}
          </View>

          <View style={stylesMC.newAccountView}>
            <Text style={stylesMC.newAccountText}>
              {translations.SignInLogIn}
            </Text>

            <Pressable
              onPress={() => navigation.replace("Login")}
              style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
            >
              <Text style={stylesMC.textSignin}>{translations.logIn}</Text>
            </Pressable>
          </View>

          <Pressable
            style={({ pressed }) => [
              stylesMC.signInButton,
              { opacity: pressed ? 0.5 : 1 },
            ]}
            onPress={() => checkSignin()}
          >
            {boolSigningIn ? (
              <ActivityIndicator size={25} />
            ) : (
              <Text style={stylesMC.signInText}>{translations.signIn}</Text>
            )}
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

export default Signin;
