import {
  View,
  Text,
  Switch,
  Platform,
  Pressable,
  ScrollView,
} from "react-native";
import {
  appName,
  loadData,
  saveData,
  userImage,
  removeData,
  checkLanguage,
  loadDataSecure,
  BOOL_ANIMATIONS,
  ROLE_STORAGE_KEY,
  TOKEN_KEY_STORAGE,
  tableNameErrorLogs,
  LANGUAGE_KEY_STORAGE,
  RESTAURANT_NAME_KEY_STORAGE,
} from "../components/globalVariables";
import Loading from "../components/Loading";
import languages from "../components/languages.json";
import AlertModel from "../components/AlertModel";
import EachRectangle from "../components/EachRectangle";
import ErrorComponent from "../components/ErrorComponent";
import DeleteRestaurant from "../components/DeleteRestaurant";
import { insertInTable } from "../components/DataBaseConnection";
import { Picker, PickerIOS } from "@react-native-picker/picker";
import { stylesSettings as styles } from "../styles/stylesSettings";
import React, { useEffect, useState } from "react";

const Settings = ({ navigation }) => {
  const thingsToLoad = 3;
  const [role, setRole] = useState(null);
  const [error, setError] = useState(false);
  const [token, setToken] = useState(null);
  const [okText, setOkText] = useState("Ok");
  const [loading, setLoading] = useState(true);
  const [seconds, setSeconds] = useState(8);
  const [language, setLanguage] = useState("en");
  const [message, setMessage] = useState(null);
  const [errorText, setErrorText] = useState(null);
  const [onOk, setOnOk] = useState(() => () => {});
  const [cancelText, setCancelText] = useState(null);
  const [title, setTitle] = useState(null);
  const [thingsLoaded, setThingsLoaded] = useState(0);
  const [visible, setVisible] = useState(false);
  const [onCancel, setOnCancel] = useState(() => () => {});
  const [languageCache, setLanguageCache] = useState("en");
  const [restaurantName, setRestaurantName] = useState(null);
  const [boolAnimations, setBoolAnimations] = useState(null);
  const [boolDeleteRestaurant, setBoolDeleteRestaurant] = useState(false);
  const [languageBeforeChange, setLanguageBeforeChange] = useState("en");
  const [boolSaveSettings, setBoolSaveSettings] = useState(false);

  const getTranslations = () => languages[language] || languages.en;

  const confirmDeleteRestaurant = () => {
    const translations = getTranslations();
    setVisible(true);
    setTitle(translations.deleteRestaurant);
    setMessage(translations.deleteRestaurantConfirmation);
    setOnOk(() => () => {
      setVisible(false);
      setBoolDeleteRestaurant(true);
    });
    setOnCancel(() => () => setVisible(false));
    setOkText(translations.deleteRestaurant);
    setCancelText(translations.cancel);
    setOnCancel(() => () => {
      setVisible(false);
    });
  };

  const saveSettings = () => {
    const translations = getTranslations();
    setLanguage(languageBeforeChange);
    setBoolSaveSettings(true);
    setSeconds(8);
    setTitle(translations.save);
    setMessage(translations.saveSettingsConfirm);
    setCancelText(translations.cancel);
    setOnCancel(() => () => {
      setVisible(false);
      setLanguage(languageCache);
      setBoolSaveSettings(false);
    });
    setOkText(translations.ok);
    setOnOk(() => () => {
      setBoolSaveSettings(false);
      confirm();
    });
    setVisible(true);
  };

  const confirm = async () => {
    if (languageBeforeChange != languageCache) {
      await saveData(LANGUAGE_KEY_STORAGE, languageBeforeChange);
      setTitle(languages[languageBeforeChange].confirmed);
      setMessage(languages[languageBeforeChange].recommendRestart);
      setOkText(languages[languageBeforeChange].ok);
      setOnOk(() => () => navigation.replace(role || "Login"));
      setVisible(true);
    }
    if (!boolAnimations) await removeData(BOOL_ANIMATIONS);
    else await saveData(BOOL_ANIMATIONS, "true");
    setVisible(false);
  };

  useEffect(() => {
    const loadLanguage = async () => {
      const language = await checkLanguage();
      setLanguage(language);
      setLanguageBeforeChange(language);
      setLanguageCache(language);
      setThingsLoaded((prev) => (prev < thingsToLoad ? prev + 1 : prev));
    };

    const loadBoolAnimations = async () => {
      const data = await loadData(BOOL_ANIMATIONS);
      setBoolAnimations(data ? true : false);
    };

    const loadTokenAndRestaurantName = async () => {
      try {
        setRestaurantName(await loadDataSecure(RESTAURANT_NAME_KEY_STORAGE));
        setToken(await loadDataSecure(TOKEN_KEY_STORAGE));
        setRole(await loadDataSecure(ROLE_STORAGE_KEY));
      } catch (error) {
        await insertInTable(tableNameErrorLogs, {
          appName: appName,
          error: error,
          date: new Date().toLocaleString(),
          component: `./Settings/useEffect/loadTokenAndRestaurantName() catch (error) => ${error}`,
        });
      } finally {
        setThingsLoaded((prev) => (prev < thingsToLoad ? prev + 2 : prev));
      }
    };

    loadLanguage();
    loadBoolAnimations();
    loadTokenAndRestaurantName();
  }, []);

  useEffect(() => {
    if (thingsLoaded >= thingsToLoad) setLoading(false);
  }, [thingsLoaded]);

  useEffect(() => {
    let timer;
    if (seconds > 0) {
      timer = setTimeout(() => {
        setSeconds((prev) => (prev > 0 ? prev - 1 : prev));
      }, 1000);
    } else if (seconds == 0) {
      setVisible(false);
      setLanguage(languageCache);
    }
    return () => clearTimeout(timer);
  }, [seconds]);

  if (loading) return <Loading progress={thingsLoaded / thingsToLoad} />;
  if (error)
    return (
      <ErrorComponent
        component="Settings"
        navigation={navigation}
        error={errorText || "Uknown error"}
      />
    );

  const translations = getTranslations();

  if (boolDeleteRestaurant) {
    return (
      <DeleteRestaurant
        translations={translations}
        navigation={navigation}
        onCancel={setBoolDeleteRestaurant}
        restaurantName={restaurantName}
      />
    );
  }

  return (
    <View style={styles.container}>
      <AlertModel
        visible={visible}
        title={title}
        message={message}
        OkText={okText}
        onOk={onOk}
        cancelText={`${cancelText} ${boolSaveSettings ? seconds : ""}`}
        onCancel={onCancel}
      />
      <EachRectangle
        texts={[restaurantName, role]}
        onPress={() => navigation.replace(role)}
        imageVariable={userImage}
      />
      <View style={styles.main}>
        <View style={styles.settingsView}>
          <Text style={styles.textsTitles}>{translations.settingsText}</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "flex-start",
          }}
        >
          <View style={styles.viewPicker}>
            <View style={styles.changeLanguage}>
              <Text style={styles.textLabel}>
                {translations.selectLanguage}
              </Text>

              <PickerLanguage
                languageBeforeChange={languageBeforeChange}
                setLanguageBeforeChange={setLanguageBeforeChange}
                languages={languages.languagesNames}
              />
            </View>
          </View>
          <View style={styles.animations}>
            <Text style={styles.textLabel}>{translations.animations}</Text>
            <View style={styles.row}>
              <Text style={styles.texts}>{translations.showAnimations}</Text>

              <Switch
                value={boolAnimations}
                onValueChange={() => setBoolAnimations((prev) => !prev)}
              />
            </View>
          </View>

          <View style={styles.viewDeleteRestaurant}>
            <Pressable
              style={({ pressed }) => [
                styles.buttonDeleteRestaurant,
                { opacity: pressed ? 0.5 : 1 },
              ]}
              onPress={confirmDeleteRestaurant}
            >
              <Text style={styles.textDeleteRestaurant}>
                {translations.deleteRestaurant}
              </Text>
            </Pressable>
          </View>
        </ScrollView>

        <Pressable
          onPress={saveSettings}
          style={({ pressed }) => [
            styles.buttonSave,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Text style={styles.buttonTextSave}>{translations.save}</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Settings;

const PickerLanguage = ({
  languageBeforeChange,
  setLanguageBeforeChange,
  languages,
}) => {
  {
    /*//?Picker for iOS  */
  }

  if (Platform.OS == "ios")
    return (
      <PickerIOS
        selectedValue={languageBeforeChange}
        style={styles.pickerIOS}
        onValueChange={(itemValue) => setLanguageBeforeChange(itemValue)}
      >
        {Object.entries(languages).map(([code, name]) => (
          <PickerIOS.Item key={code} label={name} value={code} />
        ))}
      </PickerIOS>
    );
  else
    return (
      <Picker
        selectedValue={languageBeforeChange}
        style={styles.picker}
        onValueChange={(itemValue) => setLanguageBeforeChange(itemValue)}
      >
        {Object.entries(languages).map(([code, name]) => (
          <Picker.Item key={code} label={name} value={code} />
        ))}
      </Picker>
    );
};
