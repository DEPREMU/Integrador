import {
  Text,
  View,
  TextInput,
  ScrollView,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
  Platform,
} from "react-native";
import Loading from "../../components/common/Loading";
import languages from "../../utils/languages.json";
import AlertModel from "../../components/common/AlertModel";
import { LanguageKeys } from "../../utils/globalVariables/constants";
import { checkLanguage } from "../../utils/globalVariables/utils";
import DatePickerComponent from "../../components/common/DatePicker";
import { boolIsRestaurant } from "../../utils/database/DataBaseConnection";
import { useStylesForgotPassword } from "../../styles/stylesForgotPassword";
import React, { useEffect, useState } from "react";
import {
  verifyData as verifyDataDB,
  changePassword as changePasswordDB,
} from "../../utils/database/DataBaseConnection";

interface ForgotPasswordProps {
  navigation: any;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ navigation }) => {
  const styles = useStylesForgotPassword();
  const thingsToLoad = 1;
  const getTranslations = () => languages[lang as LanguageKeys];

  const [show, setShow] = useState<boolean>(false);
  const [date, setDate] = useState<Date>(new Date());
  const [lang, setLang] = useState<LanguageKeys>("en");
  const [onOk, setOnOk] = useState<() => any>(() => () => setVisible(false));
  const [title, setTitle] = useState<string>("");
  const [OkText, setOkText] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [visible, setVisible] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [onCancel, setOnCancel] = useState<() => any>(() => {});
  const [verifyPass, setVerifyPass] = useState<string>("");
  const [cancelText, setCancelText] = useState<string | null>(null);
  const [thingsLoaded, setThingsLoaded] = useState<number>(0);
  const [dataVerified, setDataVerified] = useState<boolean>(false);
  const [restaurantName, setRestaurantName] = useState<string>("");
  const [changingPassword, setChangingPassword] = useState<boolean>(false);

  const verifyData = async () => {
    const tranlations = getTranslations();
    if (!restaurantName || !userName || !fullName) {
      setTitle(tranlations.error);
      setMessage(tranlations.pleaseFillFields);
      setOkText(tranlations.ok);
      setOnOk(() => () => setVisible(false));
      setVisible(true);
      return;
    }

    const boolExistRestaurant = await boolIsRestaurant(restaurantName);

    if (!boolExistRestaurant) {
      setTitle(tranlations.error);
      setMessage(tranlations.restaurantNameWrong);
      setOkText(tranlations.ok);
      setOnOk(() => () => setVisible(false));
      setVisible(true);
      return;
    }

    const boolVerified = await verifyDataDB(
      restaurantName,
      userName,
      fullName,
      date
    );
    if (!boolVerified) {
      setTitle(tranlations.error);
      setMessage(tranlations.error);
      setOkText(tranlations.ok);
      setOnOk(() => () => setVisible(false));
      setVisible(true);
      return;
    } else setDataVerified(true);
  };

  const changePassword = async () => {
    await changePasswordDB(restaurantName, userName, fullName, password);
    const translations = getTranslations();
    setTitle(translations.confirmed);
    setMessage(translations.confirmed);
    setOkText(translations.ok);
    setOnOk(() => () => {
      navigation.replace("Login");
    });
    setVisible(true);
    setChangingPassword(false);
  };

  useEffect(() => {
    const loadLanguage = async () => {
      const lang = await checkLanguage();
      setLang(lang as LanguageKeys);
      setThingsLoaded((prev) => (prev < thingsToLoad ? prev + 1 : prev));
    };
    loadLanguage();
  }, []);

  useEffect(() => {
    if (changingPassword) setTimeout(() => changePassword(), 1000);
  }, [changingPassword]);

  useEffect(() => {
    if (thingsLoaded >= thingsToLoad) setLoading(false);
  }, [thingsLoaded]);

  const translations = languages[lang as LanguageKeys];

  if (loading) return <Loading boolActivityIndicator={true} />;

  if (dataVerified) {
    return (
      <SafeAreaView style={styles.container}>
        <AlertModel
          onOk={onOk}
          title={title}
          OkText={OkText}
          visible={visible}
          message={message}
          onCancel={onCancel}
          cancelText={cancelText}
        />

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.main}>
            <Text style={styles.title}>{translations.recoveryPassword}</Text>

            <View style={styles.containerForm}>
              <View style={styles.user}>
                <Text style={styles.textUser}>{translations.newPassword}</Text>

                <TextInput
                  placeholder={translations.examplePassword}
                  onChangeText={setPassword}
                  style={styles.textInputUser}
                  value={password}
                  secureTextEntry={true}
                  passwordRules={
                    "required: lower; required: upper; required: digit; required: length(8);"
                  }
                />
              </View>

              <View style={styles.user}>
                <Text style={styles.textUser}>
                  {translations.verifyNewPassword}
                </Text>

                <TextInput
                  placeholder={translations.TextPassword}
                  onChangeText={(text) => setVerifyPass(text)}
                  value={verifyPass}
                  style={styles.textInputUser}
                  passwordRules={
                    "required: lower; required: upper; required: digit; required: length(8);"
                  }
                  secureTextEntry={true}
                />
              </View>

              <Pressable
                onPress={() =>
                  password && password == verifyPass
                    ? setChangingPassword(true)
                    : null
                }
                style={({ pressed }) => [
                  styles.buttonVerifyData,
                  {
                    opacity: pressed ? 0.5 : 1,
                    backgroundColor:
                      password == verifyPass && password ? "#FF5733" : "gray",
                  },
                ]}
              >
                {changingPassword ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.textVerifyData}>
                    {translations.verifyData}
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <AlertModel
        onOk={onOk}
        title={title}
        OkText={OkText}
        visible={visible}
        message={message}
        onCancel={onCancel}
        cancelText={cancelText}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.main}>
          <Text style={styles.title}>{translations.recoveryPassword}</Text>

          <View style={styles.containerForm}>
            <View style={styles.user}>
              <Text style={styles.textUser}>
                {translations.TextRestaurantName}
              </Text>

              <TextInput
                placeholder={translations.TextRestaurantName}
                onChangeText={(value) => setRestaurantName(value)}
                style={styles.textInputUser}
              />
            </View>

            <View style={styles.user}>
              <Text style={styles.textUser}>
                {translations.writeUserNameForgotPassword}
              </Text>
              <TextInput
                placeholder={translations.TextUser}
                onChangeText={(text) => setUserName(text)}
                value={userName}
                style={styles.textInputUser}
              />
            </View>

            <View style={styles.user}>
              <Text style={styles.textUser}>
                {translations.writeFullNameForgotPassword}
              </Text>
              <TextInput
                placeholder={translations.TextName}
                onChangeText={(text) => setFullName(text)}
                value={fullName}
                style={styles.textInputUser}
              />
            </View>

            <View style={styles.date}>
              <Text style={styles.textDate}>
                {translations.selectDateForgotPassword}
              </Text>
              <Pressable
                style={styles.buttonDatePicker}
                onPress={() => setShow(true)}
              >
                <DatePickerComponent
                  show={show}
                  setShow={setShow}
                  date={date}
                  setDate={setDate}
                />
                <Text style={styles.textDatePicker}>{date.toDateString()}</Text>
              </Pressable>
            </View>

            <Pressable
              onPress={() => verifyData()}
              style={({ pressed }) => [
                styles.buttonVerifyData,
                { opacity: pressed ? 0.5 : 1 },
              ]}
            >
              <Text style={styles.textVerifyData}>
                {translations.verifyData}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => navigation.replace("Login")}
              style={({ pressed }) => [
                styles.buttonLogIn,
                { opacity: pressed ? 0.5 : 1 },
              ]}
            >
              <Text style={styles.textLogin}>{translations.logIn}</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPassword;
