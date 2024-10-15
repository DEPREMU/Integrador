import {
  View,
  Text,
  Pressable,
  Image,
  TextInput,
  ScrollView,
  BackHandler,
  ActivityIndicator,
  Alert,
} from "react-native";
import stylesHS from "../styles/stylesHomeScreen";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState, useCallback } from "react";
import {
  checkLanguage,
  Error,
  hashPassword,
  interpolateMessage,
  loadData,
  Loading,
  RESTAURANT_NAME_KEY_STORAGE,
  TOKEN_KEY_STORAGE,
  userImage,
} from "../components/globalVariables";
import languages from "../components/languages.json";
import {
  boolIsRestaurant,
  boolUserExist,
  getName,
  getRole,
  signIn,
} from "../components/DataBaseConnection";
import { useFocusEffect } from "@react-navigation/native";
import AlertModel from "../components/AlertModel";

const Signin = ({ navigation }) => {
  const thingsToLoad = 3;
  const [thingsLoaded, setThingsLoaded] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Loading.");
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [language, setLanguage] = useState(null);
  const [restaurantName, setRestaurantName] = useState("");
  const [name, setName] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [options, setOptions] = useState(null);
  const [boolSigningIn, setBoolSigningIn] = useState(false);
  const getTranslations = () => languages[language] || languages.en;
  const checkRestaurantName = (value) =>
    value.indexOf(" ") === -1 ? setRestaurantName(value) : null;
  const [visible, setVisible] = React.useState(false);
  const [title, setTitle] = React.useState("Titulo");
  const [message, setMessage] = React.useState("Mensaje");
  const [OkText, setOkText] = React.useState("Ok");
  const [cancelText, setCancelText] = React.useState(null);
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
        console.error("Error during sign in:", error);
      }
    } catch (error) {
      setError(true);
      setErrorText(`An error occurred during sign in. ${error}`);
      console.error("Error during sign in:", error);
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
        const opts = getTranslations().options;
        if (opts && opts.length > 0) {
          setOptions(opts);
          setRole(opts[0]);
          setThingsLoaded((prev) => prev + 1);
        } else {
          setError(true);
          setErrorText("No options available.");
        }
      } catch (error) {
        setError(true);
        setErrorText(error.message || "An error occurred.");
      }
    };

    const loadTokenAndRestaurantName = async () => {
      const translations = getTranslations();
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
          loadingText={loadingText}
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
    <ScrollView style={stylesHS.scrollView}>
      <AlertModel
        visible={visible}
        title={title}
        message={message}
        onOk={onOk}
        onCancel={onCancel}
        OkText={OkText}
        cancelText={cancelText}
      />
      <View style={stylesHS.container}>
        <Image source={userImage} style={stylesHS.imageUser} />

        <Text style={stylesHS.text}>{translations.signIn}</Text>

        <View style={stylesHS.formLogin}>
          <View style={stylesHS.user}>
            <Text style={stylesHS.textUser}>
              {translations.TextRestaurantName}
            </Text>

            <TextInput
              placeholder={translations.TextRestaurantName}
              value={restaurantName}
              onChangeText={(value) => checkRestaurantName(value)}
              style={stylesHS.textInputUser}
              maxLength={100}
            />
          </View>

          <View style={stylesHS.user}>
            <Text style={stylesHS.textUser}>{translations.TextName}</Text>
            <TextInput
              placeholder={translations.TextName}
              onChangeText={(value) => setName(value)}
              style={stylesHS.textInputUser}
              maxLength={100}
            />
          </View>

          <View style={stylesHS.user}>
            <Text style={stylesHS.textUser}>{translations.TextUser}</Text>
            <TextInput
              placeholder={translations.TextUser}
              onChangeText={(value) => setUser(value)}
              style={stylesHS.textInputUser}
              maxLength={50}
            />
          </View>

          <View style={stylesHS.pass}>
            <Text style={stylesHS.textPass}>{translations.TextPassword}</Text>
            <TextInput
              placeholder={translations.TextPassword}
              style={stylesHS.textInputPass}
              secureTextEntry={true}
              onChangeText={(value) => setPassword(value)}
              maxLength={100}
            />
          </View>

          <Text style={stylesHS.roles}>{translations.TextRoles}</Text>

          <View style={stylesHS.pickerContainer}>
            {options != null && (
              <Picker
                selectedValue={role}
                onValueChange={(itemValue) => setRole(itemValue)}
                style={stylesHS.picker}
              >
                {options.map((option, index) => (
                  <Picker.Item key={index} label={option} value={option} />
                ))}
              </Picker>
            )}
          </View>

          <View style={stylesHS.newAccountView}>
            <Text style={stylesHS.newAccountText}>
              {translations.SignInLogIn}
            </Text>

            <Pressable
              onPress={() => navigation.replace("Login")}
              style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
            >
              <Text style={stylesHS.textSignin}>{translations.logIn}</Text>
            </Pressable>
          </View>

          <Pressable
            style={({ pressed }) => [
              stylesHS.signInButton,
              { opacity: pressed ? 0.5 : 1 },
            ]}
            onPress={() => checkSignin()}
          >
            {boolSigningIn ? (
              <ActivityIndicator size={25} />
            ) : (
              <Text style={stylesHS.signInText}>{translations.signIn}</Text>
            )}
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

export default Signin;
