import {
  signIn,
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
  userImage,
  hashPassword,
  checkLanguage,
  tableNameErrorLogs,
} from "../components/globalVariables";
import ErrorComponent from "../components/ErrorComponent";
import Loading from "../components/Loading";
import stylesMC from "../styles/stylesMainComponents";
import languages from "../components/languages.json";
import AlertModel from "../components/AlertModel";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "@react-navigation/native";
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
  const [error, setError] = useState(false);
  const [title, setTitle] = React.useState("Titulo");
  const [OkText, setOkText] = React.useState("Ok");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = React.useState("Mensaje");
  const [options, setOptions] = useState(null);
  const [visible, setVisible] = React.useState(false);
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [cancelText, setCancelText] = React.useState(null);
  const [thingsLoaded, setThingsLoaded] = useState(0);
  const [boolSigningIn, setBoolSigningIn] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [onOk, setOnOk] = useState(() => () => {
    console.log("Modificar!!");
    setVisible(false);
  });
  const [onCancel, setOnCancel] = useState(() => () => {
    console.log("Modificar!!");
    setVisible(false);
  });
  const passwordConfirmed = () => password == confirmPassword && password;

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

      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
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

        <Loading boolLoadingText={true} boolActivityIndicator={true} />
      </View>
    );
  if (error)
    return (
      <ErrorComponent
        navigation={navigation}
        component="Owner"
        error={errorText}
      />
    );

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

        <Text style={stylesMC.text}>{translations.addNewEmploye}</Text>

        <View style={stylesMC.formLogin}>
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

          <View style={stylesMC.pass}>
            <Text style={stylesMC.textPass}>
              {translations.TextConfirmPassword}
            </Text>
            <TextInput
              placeholder={translations.TextConfirmPassword}
              style={stylesMC.textInputPass}
              secureTextEntry={true}
              onChangeText={(value) => setConfirmPassword(value)}
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
                {options.map(
                  (option, index) =>
                    option != translations.options[2] && (
                      <Picker.Item key={index} label={option} value={option} />
                    )
                )}
              </Picker>
            )}
          </View>

          <View style={stylesMC.newAccountView} />

          {passwordConfirmed() ? (
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
                <Text style={stylesMC.signInText}>
                  {translations.addNewEmploye}
                </Text>
              )}
            </Pressable>
          ) : (
            <View style={[stylesMC.signInButton, { backgroundColor: "gray" }]}>
              <Text style={stylesMC.signInText}>
                {translations.addNewEmploye}
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};
