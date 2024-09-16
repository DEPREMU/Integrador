import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ScrollView,
  BackHandler,
} from "react-native";
import stylesHS from "../styles/stylesHomeScreen";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useReducer, useState } from "react";
import {
  checkLanguage,
  Error,
  Loading,
  userImage,
} from "../components/globalVariables";
import AsyncStorage from "@react-native-async-storage/async-storage";
import languages from "../components/languages.json";
import { boolIsRestaurant, signIn } from "../components/DataBaseConnection";
import { useFocusEffect } from "@react-navigation/native";

const Signin = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Loading.");
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [thingsLoaded, setThingsLoaded] = useState(0);
  const thingsToLoad = 2;
  const [language, setLanguage] = useState(null);
  const [restaurantName, setRestaurantName] = useState("");
  const [name, setName] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [options, setOptions] = useState(null);

  const checkRestaurantName = (value) => {
    if (value.indexOf(" ") == -1) {
      setRestaurantName(value);
    }
  };

  const signingIn = async () => {
    try {
      const index = languages.options[language].indexOf(role);

      const {
        success,
        user: user1,
        error,
      } = await signIn(
        restaurantName,
        user,
        password,
        languages.options["en"][index],
        name
      );
      if (success) {
        Alert.alert(
          languages.signIn[language],
          languages.signInSuccess[language],
          [
            {
              text: languages.logIn[language],
            },
          ]
        );
        navigation.navigate("Login");
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
    if (user == "" || password == "" || name == "" || restaurantName == "") {
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
    if (isFinite(restaurantName) || isFinite(restaurantName[0])) {
      Alert.alert(
        languages.error[language],
        languages.noNumbersInName[language],
        [
          {
            text: languages.ok[language],
          },
        ]
      );
      return;
    }

    const boolExistRestaurant = await boolIsRestaurant(restaurantName);
    if (role == languages.options[language][2] && boolExistRestaurant) {
      Alert.alert(
        languages.error[language],
        languages.restaurantAlreadyExists[language],
        [
          {
            text: languages.ok[language],
          },
        ]
      );
      return;
    }
    Alert.alert(languages.signIn[language], languages.askSignIn[language], [
      {
        text: languages.cancel[language],
        onPress: () => {},
      },
      {
        text: languages.ok[language],
        onPress: () => {
          signingIn();
        },
      },
    ]);
  };

  useEffect(() => {
    const changeLanguage = async () => {
      try {
        const language = await checkLanguage();
        setLanguage(language);
        return language;
      } catch (error) {
        setLanguage("en");
        return "en";
      }
    };

    const loadOptions = async () => {
      const lang = await changeLanguage();
      try {
        const opts = languages.options[lang];
        if (opts && opts.length > 0) {
          setOptions(opts);
          setRole(opts[0]);
          setThingsLoaded((prevThingsLoaded) => prevThingsLoaded + 2);
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
  }, [languages]);

  useEffect(() => {
    if (thingsLoaded === thingsToLoad) {
      setLoading(false);
    } else {
      setTimeout(() => {
        setLoadingText((prev) => {
          if (prev === "Loading.") return "Loading..";
          if (prev === "Loading..") return "Loading...";
          return "Loading.";
        });
      }, 1000);
    }
  }, [thingsLoaded]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = async () => {
        const language = await checkLanguage();
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
  if (error) return <Error error={errorText} />;

  return (
    <ScrollView style={stylesHS.scrollView}>
      <View style={stylesHS.container}>
        <Image source={userImage} style={stylesHS.imageUser} />

        <Text style={stylesHS.text}>{languages.signIn[language]}</Text>

        <View style={stylesHS.formLogin}>
          <View style={stylesHS.user}>
            <Text style={stylesHS.textUser}>
              {languages.TextRestaurantName[language]}
            </Text>
            <TextInput
              placeholder={languages.TextRestaurantName[language]}
              value={restaurantName}
              onChangeText={(value) => checkRestaurantName(value)}
              style={stylesHS.textInputUser}
              maxLength={100}
            />
          </View>

          <View style={stylesHS.user}>
            <Text style={stylesHS.textUser}>
              {languages.TextName[language]}
            </Text>
            <TextInput
              placeholder={languages.TextName[language]}
              onChangeText={(value) => setName(value)}
              style={stylesHS.textInputUser}
              maxLength={100}
            />
          </View>

          <View style={stylesHS.user}>
            <Text style={stylesHS.textUser}>
              {languages.TextUser[language]}
            </Text>
            <TextInput
              placeholder={languages.TextUser[language]}
              onChangeText={(value) => setUser(value)}
              style={stylesHS.textInputUser}
              maxLength={50}
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
              maxLength={100}
            />
          </View>

          <Text style={stylesHS.roles}>{languages.TextRoles[language]}</Text>

          <View style={stylesHS.pickerContainer}>
            <Picker
              selectedValue={role}
              onValueChange={(itemValue) => setRole(itemValue)}
              style={stylesHS.picker}
            >
              {options.map((option, index) => (
                <Picker.Item key={index} label={option} value={option} />
              ))}
            </Picker>
          </View>

          <View style={stylesHS.newAccountView}>
            <Text style={stylesHS.newAccountText}>
              {languages.SigInLogIn[language]}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={stylesHS.textSignin}>
                {languages.logIn[language]}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={stylesHS.signInButton}
            onPress={() => checkSignin()}
          >
            <Text style={stylesHS.signInText}>
              {languages.signIn[language]}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Signin;
