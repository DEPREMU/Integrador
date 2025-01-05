import {
  signIn,
  boolUserExist,
  insertInTable,
} from "../../utils/database/DataBaseConnection";
import {
  appName,
  userImage,
  eyeLooking,
  eyeNotLooking,
  tableNameErrorLogs,
} from "../../utils/globalVariables/constants";
import {
  View,
  Text,
  Image,
  Platform,
  Pressable,
  TextInput,
  ScrollView,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import Loading from "../common/Loading";
import languages from "../../utils/languages.json";
import AlertModel from "../../components/common/AlertModel";
import EachRectangle from "../common/EachRectangle";
import ErrorComponent from "../../components/common/ErrorComponent";
import { Translations } from "../../utils/interfaceTranslations";
import { stylesSignUp } from "../../styles/stylesSignUp";
import { useFocusEffect } from "@react-navigation/native";
import { Video, ResizeMode } from "expo-av";
import { Picker, PickerIOS } from "@react-native-picker/picker";
import { hashPassword, checkLanguage } from "../../utils/globalVariables/utils";
import React, { useEffect, useState, useCallback } from "react";

interface AddEmployeOwnerProps {
  navigation: any;
  translations: Translations;
  returnToBackPage: () => void;
  restaurantName: string;
}

const AddEmployeOwner: React.FC<AddEmployeOwnerProps> = ({
  navigation,
  translations,
  returnToBackPage,
  restaurantName,
}) => {
  const thingsToLoad = 1;
  const [name, setName] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [user, setUser] = useState<string>("");
  const [onOk, setOnOk] = useState<any>(() => () => setVisible(false));
  const [error, setError] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("Titulo");
  const [OkText, setOkText] = useState<string>("Ok");
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("Mensaje");
  const [options, setOptions] = useState<string[] | null>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [onCancel, setOnCancel] = useState<any>(() => () => setVisible(false));
  const [password, setPassword] = useState<string>("");
  const [errorText, setErrorText] = useState<string | null>(null);
  const [cancelText, setCancelText] = useState<string | null>(null);
  const [thingsLoaded, setThingsLoaded] = useState<number>(0);
  const [boolSigningIn, setBoolSigningIn] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [boolShowFirstPassword, setBoolShowFirstPassword] =
    useState<boolean>(false);
  const [boolShowSecondPassword, setBoolShowSecondPassword] =
    useState<boolean>(false);
  const passwordConfirmed = () => password == confirmPassword;

  const styles = stylesSignUp();

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
        setErrorText(error as string);
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
        const opts = (
          languages[lang as keyof typeof languages] as { options: string[] }
        ).options;

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
        setErrorText((error as Error).message || "An error occurred.");
        // console.error("Error loading options:", error);
        await insertInTable(tableNameErrorLogs, {
          appName: appName,
          error: (error as Error).message,
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

        <View style={styles.formSignin}>
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
                    resizeMode={"cover" as ResizeMode}
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
                    resizeMode={"cover" as ResizeMode}
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
                  onValueChange={(itemValue) => setRole(itemValue as string)}
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

export default AddEmployeOwner;
