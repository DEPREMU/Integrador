import {
  signIn,
  boolUserExist,
  insertInTable,
} from "../components/DataBaseConnection";
import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  ScrollView,
  BackHandler,
  ActivityIndicator,
  Platform,
} from "react-native";
import {
  appName,
  userImage,
  hashPassword,
  checkLanguage,
  tableNameErrorLogs,
  eyeNotLooking,
  eyeLooking,
} from "../components/globalVariables";
import Loading from "../components/Loading";
import { Video } from "expo-av";
import languages from "../components/languages.json";
import AlertModel from "../components/AlertModel";
import EachRectangle from "./EachRectangle";
import ErrorComponent from "../components/ErrorComponent";
import { useFocusEffect } from "@react-navigation/native";
import { Picker, PickerIOS } from "@react-native-picker/picker";
import { stylesSignUp as styles } from "../styles/stylesSignUp";
import React, { useEffect, useState, useCallback } from "react";

export default AddEmployeOwner = ({
  translations,
  returnToBackPage,
  restaurantName,
}) => {
  const thingsToLoad = 1;
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [user, setUser] = useState("");
  const [onOk, setOnOk] = useState(() => () => setVisible(false));
  const [error, setError] = useState(false);
  const [title, setTitle] = React.useState("Titulo");
  const [OkText, setOkText] = React.useState("Ok");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = React.useState("Mensaje");
  const [options, setOptions] = useState(null);
  const [visible, setVisible] = React.useState(false);
  const [onCancel, setOnCancel] = useState(() => () => setVisible(false));
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [cancelText, setCancelText] = React.useState(null);
  const [thingsLoaded, setThingsLoaded] = useState(0);
  const [boolSigningIn, setBoolSigningIn] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [boolShowFirstPassword, setBoolShowFirstPassword] = useState(false);
  const [boolShowSecondPassword, setBoolShowSecondPassword] = useState(false);
  const passwordConfirmed = () => password == confirmPassword;

  const signingIn = async () => {
    try {
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
        setTitle(translations.added);
        setMessage(translations.addedSuccess);
        setOkText(translations.ok);
        setOnOk(() => () => {
          setVisible(false);
          setBoolSigningIn(false);
        });
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
    setTitle(translations.addNewEmploye);
    setMessage(translations.askAddNewEmploye);
    setVisible(true);
    setCancelText(translations.cancel);
    setOkText(translations.yes);
  };

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const lang = await checkLanguage();
        const opts = languages[lang].options;

        if (opts && opts.length > 0) {
          setOptions(opts);
          setRole(opts[0]);
          setTimeout(() => {
            setThingsLoaded((prev) => prev + 1);
          }, 1000);
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

    loadOptions();
  }, []);

  useEffect(() => {
    if (thingsLoaded >= thingsToLoad) setLoading(false);
  }, [thingsLoaded]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (returnToBackPage && typeof returnToBackPage == "function")
          returnToBackPage();
        return true;
      };

      BackHandler.addEventListener(
        "hardwareBackPressAddEmployeOwner",
        onBackPress
      );
      return () =>
        BackHandler.removeEventListener(
          "hardwareBackPressAddEmployeOwner",
          onBackPress
        );
    }, [loading])
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

        <Loading boolLoadingText={true} boolActivityIndicator={true} />
      </View>
    );
  }

  if (error) {
    return (
      <ErrorComponent
        navigation={navigation}
        component="Owner"
        error={errorText}
      />
    );
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      {/* style={styles.scrollView} */}
      <AlertModel
        onOk={onOk}
        title={title}
        OkText={OkText}
        visible={visible}
        message={message}
        onCancel={onCancel}
        cancelText={cancelText}
      />
      <View style={styles.container}>
        <EachRectangle
          texts={[restaurantName, role]}
          onPress={returnToBackPage}
          imageVariable={userImage}
        />

        <Text style={styles.text}>{translations.addNewEmploye}</Text>

        <View style={styles.formLogin}>
          <View style={styles.user}>
            <Text style={styles.textUser}>{translations.TextName}</Text>
            <TextInput
              placeholder={translations.TextName}
              onChangeText={(value) => setName(value)}
              style={styles.textInputUser}
              maxLength={100}
            />
          </View>

          <View style={styles.user}>
            <Text style={styles.textUser}>{translations.TextUser}</Text>
            <TextInput
              placeholder={translations.TextUser}
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
                secureTextEntry={!boolShowFirstPassword}
                onChangeText={(value) => setPassword(value)}
                maxLength={100}
              />
              <Pressable
                style={styles.buttonShowPassword}
                onPress={() => setBoolShowFirstPassword((prev) => !prev)}
              >
                {!boolShowFirstPassword ? (
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

          <View style={styles.pass}>
            <Text style={styles.textPass}>
              {translations.TextConfirmPassword}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <TextInput
                placeholder={translations.examplePassword}
                style={styles.textInputPass}
                secureTextEntry={!boolShowSecondPassword}
                onChangeText={(value) => setConfirmPassword(value)}
                maxLength={100}
              />
              <Pressable
                style={styles.buttonShowPassword}
                onPress={() => setBoolShowSecondPassword((prev) => !prev)}
              >
                {!boolShowSecondPassword ? (
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

          {options != null && (
            <View style={styles.pickerContainer}>
              {Platform.OS != "ios" ? (
                <Picker
                  selectedValue={role}
                  onValueChange={(itemValue) => setRole(itemValue)}
                  style={styles.picker}
                >
                  {options.map(
                    (option, index) =>
                      option != translations.options[2] && (
                        <Picker.Item
                          key={index}
                          label={option}
                          value={option}
                        />
                      )
                  )}
                </Picker>
              ) : (
                <PickerIOS
                  selectedValue={role}
                  onValueChange={(itemValue) => setRole(itemValue)}
                  style={styles.pickerIOS}
                >
                  {options.map(
                    (option, index) =>
                      option != translations.options[2] && (
                        <PickerIOS.Item
                          key={index}
                          label={option}
                          value={option}
                        />
                      )
                  )}
                </PickerIOS>
              )}
            </View>
          )}

          <View style={styles.newAccountView} />

          {passwordConfirmed() ? (
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
                <Text style={styles.signInText}>
                  {translations.addNewEmploye}
                </Text>
              )}
            </Pressable>
          ) : (
            <View style={[styles.signInButton, { backgroundColor: "gray" }]}>
              <Text style={styles.signInText}>
                {translations.addNewEmploye}
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};
