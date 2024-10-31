import { View, Text, Modal, ScrollView, Alert, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import languages from "../components/languages.json";
import {
  TOKEN_KEY_STORAGE,
  LANGUAGE_KEY_STORAGE,
  Error,
  Loading,
  loadData,
  saveData,
  RESTAURANT_NAME_KEY_STORAGE,
  checkLanguage,
  tableNameErrorLogs,
  appName,
} from "../components/globalVariables";
import { getRole, insertInTable } from "../components/DataBaseConnection";
import { Picker } from "@react-native-picker/picker";
import stylesSettings from "../styles/stylesSettings";
import AlertModel from "../components/AlertModel";

const Settings = ({ navigation }) => {
  const thingsToLoad = 3;
  const [thingsLoaded, setThingsLoaded] = useState(0);
  const [language, setLanguage] = useState("en");
  const [languageBeforeChange, setLanguageBeforeChange] = useState("en");
  const [languageCache, setLanguageCache] = useState("en");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState(null);
  const [seconds, setSeconds] = useState(8);
  const [token, setToken] = useState(null);
  const [restaurantName, setRestaurantName] = useState(null);
  const [role, setRole] = useState(null);
  const [titleAlert, setTitleAlert] = useState(null);
  const [bodyAlert, setBodyAlert] = useState(null);
  const [visibleAlert, setVisibleAlert] = useState(false);
  const [okText, setOkText] = useState("Ok");
  const [cancelText, setCancelText] = useState(null);
  const [onOkAlert, setOnOkAlert] = useState(() => () => {
    console.log("Change onOkAlert function  ./Settings");
  });
  const [onCancelAlert, setOnCancelAlert] = useState(() => () => {});

  const getTranslations = () => languages[language] || languages.en;

  useEffect(() => {
    const loadLanguage = async () => {
      const language = await checkLanguage();
      setLanguage(language);
      setLanguageBeforeChange(language);
      setLanguageCache(language);
      setThingsLoaded((prev) => (prev < thingsToLoad ? prev + 1 : prev));
    };

    const loadTokenAndRestaurantName = async () => {
      try {
        const token = await loadData(TOKEN_KEY_STORAGE);
        const restaurantName = await loadData(RESTAURANT_NAME_KEY_STORAGE);
        setRestaurantName(restaurantName);
        if (token) {
          const { role } = await getRole(restaurantName, token);
          setToken(token);
          setRole(role);
        }
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
      setVisibleAlert(false);
      setLanguage(languageCache);
    }
    return () => clearTimeout(timer);
  }, [seconds]);

  const saveSettings = () => {
    const translations = getTranslations();
    setLanguage(languageBeforeChange);
    setSeconds(8);
    setTitleAlert(translations.save);
    setBodyAlert(translations.saveSettingsConfirm);
    setCancelText(translations.cancel);
    setOnCancelAlert(() => () => {
      setVisibleAlert(false);
      setLanguage(languageCache);
    });
    setOkText(translations.ok);
    setOnOkAlert(() => () => {
      confirm();
    });
    setVisibleAlert(true);
  };

  const confirm = async () => {
    if (languageBeforeChange != languageCache) {
      await saveData(LANGUAGE_KEY_STORAGE, languageBeforeChange);
      setTitleAlert(languages[languageBeforeChange].confirmed);
      setBodyAlert(languages[languageBeforeChange].recommendRestart);
      setOkText(languages[languageBeforeChange].ok);
      setOnOkAlert(() => () => navigation.replace("Login"));
      setVisibleAlert(true);
    }
    setVisibleAlert(false);
  };

  if (loading)
    return (
      <Loading
        progress={
          thingsLoaded / thingsToLoad > 1 ? 1 : thingsLoaded / thingsToLoad
        }
      />
    );
  if (error)
    return (
      <Error
        component="Settings"
        navigation={navigation}
        error={errorText ? errorText : "Uknown error"}
      />
    );

  const translations = getTranslations();

  return (
    <View style={stylesSettings.container}>
      <AlertModel
        visible={visibleAlert}
        title={titleAlert}
        message={bodyAlert}
        OkText={okText}
        onOk={onOkAlert}
        cancelText={`${cancelText} ${visibleAlert ? seconds : ""}`}
        onCancel={onCancelAlert}
      />
      <View style={stylesSettings.settingsView}>
        <Text style={stylesSettings.texts}>{translations.settingsText}</Text>
      </View>
      {role != null && (
        <Pressable
          onPress={() => navigation.replace(role)}
          style={({ pressed }) => [
            stylesSettings.buttonBack,
            { opacity: pressed ? 0.5 : 1 },
          ]}
        >
          <Text style={stylesSettings.settings}>{translations.back}</Text>
        </Pressable>
      )}
      <ScrollView>
        <View style={stylesSettings.viewPicker}>
          <Text style={[stylesSettings.texts, { textAlign: "center" }]}>
            {translations.selectLanguage}
          </Text>
          <Picker
            selectedValue={languageBeforeChange}
            style={stylesSettings.picker}
            onValueChange={(itemValue) => setLanguageBeforeChange(itemValue)}
          >
            {Object.entries(languages.languagesNames).map(([code, name]) => (
              <Picker.Item key={code} label={name} value={code} />
            ))}
          </Picker>
        </View>
      </ScrollView>
      <Pressable
        onPress={saveSettings}
        style={({ pressed }) => [
          stylesSettings.buttonSave,
          { opacity: pressed ? 0.5 : 1 },
        ]}
      >
        <Text style={stylesSettings.texts}>{translations.save}</Text>
      </Pressable>
    </View>
  );
};

export default Settings;
