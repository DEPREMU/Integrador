import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ScrollView,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import stylesHS from "../styles/stylesHomeScreen";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState, useCallback } from "react";
import {
  checkLanguage,
  Error,
  hashPassword,
  Loading,
  userImage,
} from "../components/globalVariables";
import languages from "../components/languages.json";
import {
  boolIsRestaurant,
  boolUserExist,
  signIn,
} from "../components/DataBaseConnection";
import { useFocusEffect } from "@react-navigation/native";

const Signin = ({ navigation }) => {
  const thingsToLoad = 2;
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

      if (success)
        Alert.alert(translations.signIn, translations.signInSuccess, [
          {
            text: translations.logIn,
            onPress: () => {
              navigation.replace("Login");
              setBoolSigningIn(false);
            },
          },
        ]);
      else if (error && error.indexOf("does not exist") > -1) {
        Alert.alert(translations.errorText, translations.restaurantNameWrong, [
          {
            text: translations.ok,
            onPress: () => setBoolSigningIn(false),
          },
        ]);
      } else {
        setError(true);
        setErrorText(error);
      }
    } catch (error) {
      setError(true);
      setErrorText("An error occurred during sign in.");
      console.error("Error during sign in:", error);
    }
  };

  const checkSignin = async () => {
    setBoolSigningIn(true);
    const translations = getTranslations();
    if (user == "" || password == "" || name == "" || restaurantName == "") {
      Alert.alert(translations.error, translations.pleaseFillFields, [
        {
          text: translations.ok,
          onPress: () => setBoolSigningIn(false),
        },
      ]);
      return;
    }

    if (isFinite(restaurantName[0])) {
      Alert.alert(translations.error, translations.noNumbersInName, [
        {
          text: translations.ok,
          onPress: () => setBoolSigningIn(false),
        },
      ]);
      return;
    }

    const boolExistRestaurant = await boolIsRestaurant(restaurantName);
    const boolUserExists = await boolUserExist(restaurantName, user);
    if (role == translations.options[2] && boolExistRestaurant) {
      Alert.alert(translations.error, translations.restaurantAlreadyExists, [
        {
          text: translations.ok,
          onPress: () => setBoolSigningIn(false),
        },
      ]);
      return;
    }
    if (boolUserExists) {
      Alert.alert(translations.error, translations.userAlreadyExists, [
        {
          text: translations.ok,
          onPress: () => setBoolSigningIn(false),
        },
      ]);
      return;
    }

    Alert.alert(translations.signIn, translations.askSignIn, [
      {
        text: translations.cancel,
        onPress: () => setBoolSigningIn(false),
      },
      {
        text: translations.ok,
        onPress: () => signingIn(),
      },
    ]);
  };

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const lang = await checkLanguage();
        setLanguage(lang);
        const opts = languages[lang].options;
        if (opts && opts.length > 0) {
          setOptions(opts);
          setRole(opts[0]);
          setThingsLoaded((prev) => prev + 2);
        } else {
          setError(true);
          setErrorText("No options available.");
        }
      } catch (error) {
        setError(true);
        setErrorText(error.message || "An error occurred.");
      }
    };

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
      <Loading
        loadingText={loadingText}
        progress={
          thingsLoaded / thingsToLoad > 1 ? 1 : thingsLoaded / thingsToLoad
        }
      />
    );
  if (error)
    return (
      <Error navigation={navigation} component="Signin" error={errorText} />
    );

  const translations = getTranslations();

  return (
    <ScrollView style={stylesHS.scrollView}>
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
            {options && (
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

            <TouchableOpacity onPress={() => navigation.replace("Login")}>
              <Text style={stylesHS.textSignin}>{translations.logIn}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={stylesHS.signInButton}
            onPress={() => checkSignin()}
          >
            {boolSigningIn ? (
              <ActivityIndicator size={25} />
            ) : (
              <Text style={stylesHS.signInText}>{translations.signIn}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Signin;
