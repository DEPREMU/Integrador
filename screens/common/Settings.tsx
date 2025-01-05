import {
  loadData,
  saveData,
  removeData,
  checkLanguage,
  loadDataSecure,
} from "../../utils/globalVariables/utils";
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
  userImage,
  BOOL_ANIMATIONS,
  ROLE_STORAGE_KEY,
  TOKEN_KEY_STORAGE,
  tableNameErrorLogs,
  LANGUAGE_KEY_STORAGE,
  RESTAURANT_NAME_KEY_STORAGE,
  LanguageKeys,
} from "../../utils/globalVariables/constants";
import Loading from "../../components/common/Loading";
import languages from "../../utils/languages.json";
import AlertModel from "../../components/common/AlertModel";
import EachRectangle from "../../components/common/EachRectangle";
import ErrorComponent from "../../components/common/ErrorComponent";
import DeleteRestaurant from "../../components/owner/DeleteRestaurant";
import { insertInTable } from "../../utils/database/DataBaseConnection";
import { Picker, PickerIOS } from "@react-native-picker/picker";
import { stylesSettings as styles } from "../../styles/stylesSettings";
import React, { useEffect, useState } from "react";

interface SettingsProps {
  navigation: any;
}

const Settings: React.FC<SettingsProps> = ({ navigation }) => {
  const thingsToLoad = 3;
  const [role, setRole] = useState<string | null>(null);
  const [onOk, setOnOk] = useState<() => any>(() => () => {});
  const [error, setError] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [okText, setOkText] = useState<string>("Ok");
  const [seconds, setSeconds] = useState<number>(8);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [visible, setVisible] = useState<boolean>(false);
  const [language, setLanguage] = useState<string | LanguageKeys>("en");
  const [onCancel, setOnCancel] = useState<() => any>(() => () => {});
  const [errorText, setErrorText] = useState<string | null>(null);
  const [cancelText, setCancelText] = useState<string | null>(null);
  const [thingsLoaded, setThingsLoaded] = useState<number>(0);

  const [restaurantName, setRestaurantName] = useState<string | null>(null);
  const [boolAnimations, setBoolAnimations] = useState<boolean>(false);
  const [boolDeleteRestaurant, setBoolDeleteRestaurant] =
    useState<boolean>(false);
  const [languageBeforeChange, setLanguageBeforeChange] = useState<
    string | LanguageKeys
  >("en");
  const [languageCache, setLanguageCache] = useState<LanguageKeys | string>(
    "en"
  );
  const [boolSaveSettings, setBoolSaveSettings] = useState<boolean>(false);

  const getTranslations = () =>
    languages[language as LanguageKeys] || languages.en;

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
      setTitle(languages[languageBeforeChange as LanguageKeys].confirmed);
      setMessage(
        languages[languageBeforeChange as LanguageKeys].recommendRestart
      );
      setOkText(languages[languageBeforeChange as LanguageKeys].ok);
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
    let timer: any;
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

  if (loading || !restaurantName || !role)
    return <Loading progress={thingsLoaded / thingsToLoad} />;
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

interface PickerLanguageProps {
  languageBeforeChange: string | LanguageKeys;
  setLanguageBeforeChange: any;
  languages: any;
}

const PickerLanguage: React.FC<PickerLanguageProps> = ({
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
          <PickerIOS.Item key={code} label={name as string} value={code} />
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
          <Picker.Item key={code} label={name as string} value={code} />
        ))}
      </Picker>
    );
};
