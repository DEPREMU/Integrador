import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  BackHandler,
} from "react-native";
import React, { useEffect, useState } from "react";
import languages from "../components/languages.json";
import {
  USER_KEY_STORAGE,
  TOKEN_KEY_STORAGE,
  LANGUAGE_KEY_STORAGE,
  Error,
  Loading,
  loadData,
  saveData,
  RESTAURANT_NAME_KEY_STORAGE,
} from "../components/globalVariables";
import { getRole } from "../components/DataBaseConnection";
import { Picker } from "@react-native-picker/picker";
import stylesSettings from "../styles/stylesSettings";

const Settings = ({ navigation }) => {
  const thingsToLoad = 3;
  const [thingsLoaded, setThingsLoaded] = useState(0);
  const [language, setLanguage] = useState("en");
  const [languageBeforeChange, setLanguageBeforeChange] = useState("en");
  const [languageCache, setLanguageCache] = useState("en");
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Loading.");
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState(null);
  const [seconds, setSeconds] = useState(8);
  const [modalVisible, setModalVisible] = useState(false);
  const [token, setToken] = useState(null);
  const [restaurantName, setRestaurantName] = useState(null);
  const [role, setRole] = useState(null);
  const getTranslations = () => languages[language] || languages.en;
  useEffect(() => {
    const loadLanguage = async () => {
      const language = await loadData(LANGUAGE_KEY_STORAGE);
      setLanguage(language);
      setLanguageBeforeChange(language);
      setLanguageCache(language);
      setThingsLoaded((prev) => (prev < thingsToLoad ? prev + 1 : prev));
    };
    const loadTokenAndRestaurantName = async () => {
      try {
        const token = await loadData(TOKEN_KEY_STORAGE);
        const restaurantName = await loadData(RESTAURANT_NAME_KEY_STORAGE);
        if (token && restaurantName) {
          const { role } = await getRole(restaurantName, token);
          setToken(token);
          setRestaurantName(restaurantName);
          setRole(role);
        }
      } catch (error) {
      } finally {
        setThingsLoaded((prev) => (prev < thingsToLoad ? prev + 2 : prev));
      }
    };

    loadLanguage();
    loadTokenAndRestaurantName();
  }, []);

  useEffect(() => {
    if (!loading || thingsLoaded >= thingsToLoad) setLoading(false);

    setTimeout(() => {
      setLoadingText((prev) => {
        if (prev === "Loading.") return "Loading..";
        if (prev === "Loading..") return "Loading...";
        return "Loading.";
      });
    }, 750);
  }, [loadingText, loading]);

  useEffect(() => {
    let timer;
    if (seconds > 0) {
      timer = setTimeout(() => {
        setSeconds((prev) => (prev > 0 ? prev - 1 : prev));
      }, 1000);
    } else if (seconds == 0) {
      setModalVisible(false);
      setLanguage(languageCache);
    }
    return () => clearTimeout(timer);
  }, [seconds]);

  const saveSettings = () => {
    setLanguage(languageBeforeChange);
    setSeconds(8);
    setModalVisible(true);
  };

  const confirm = async () => {
    if (languageBeforeChange != languageCache) {
      await saveData(LANGUAGE_KEY_STORAGE, language);
      Alert.alert(
        languages[languageBeforeChange].confirmed,
        languages[languageBeforeChange].recommendRestart,
        [
          {
            text: languages[languageBeforeChange].ok,
            onPress: () => navigation.replace("Login"),
          },
        ]
      );
    }
    setModalVisible(false);
  };

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
      <Error
        component={"Settings"}
        error={errorText ? errorText : "Uknown error"}
      />
    );

  const translations = getTranslations();

  return (
    <View style={stylesSettings.container}>
      <View style={stylesSettings.settingsView}>
        <Text style={stylesSettings.texts}>{translations.settingsText}</Text>
      </View>
      {role && (
        <TouchableOpacity
          onPress={() => navigation.navigate(role)}
          style={stylesSettings.buttonBack}
        >
          <Text style={stylesSettings.settings}>{translations.back}</Text>
        </TouchableOpacity>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={stylesSettings.viewModalContainer}>
          <View style={stylesSettings.viewModal}>
            <Text style={stylesSettings.saveText}>{translations.save}</Text>
            <Text style={stylesSettings.saveConfirm}>
              {translations.saveSettingsConfirm}
            </Text>
            <View style={stylesSettings.buttonsSaveData}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setLanguage(languageCache);
                }}
                style={stylesSettings.buttonCancel}
              >
                <Text>
                  {translations.cancel} {seconds}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  confirm();
                }}
                style={stylesSettings.buttonConfirm}
              >
                <Text>{translations.ok}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
      <TouchableOpacity
        onPress={saveSettings}
        style={stylesSettings.buttonSave}
      >
        <Text style={stylesSettings.texts}>{translations.save}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Settings;
