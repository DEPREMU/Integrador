import { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Pressable,
  ActivityIndicator,
} from "react-native";
import {
  BOOL_LOG_OUT,
  heightDivided,
  removeData,
  removeDataSecure,
  RESTAURANT_NAME_KEY_STORAGE,
  TOKEN_KEY_STORAGE,
  widthDivided,
} from "./globalVariables";
import { deleteTables } from "./DataBaseConnection";
import AlertModel from "./AlertModel";

export default DeleteRestaurant = ({
  translations,
  navigation,
  onCancel,
  restaurantName,
}) => {
  const [restaurantNameDelete, setRestaurantNameDelete] = useState("");
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("Title");
  const [message, setMessage] = useState("Message");
  const [onOk, setOnOk] = useState(() => () => {});
  const [onCancelAlert, setOnCancelAlert] = useState(() => () => {});
  const [OkText, setOkText] = useState("Ok");
  const [cancelText, setCancelText] = useState(null);
  const [boolDeleting, setBoolDeleting] = useState(false);

  const deleting = async () => {
    await deleteTables(restaurantName);
    await removeDataSecure(RESTAURANT_NAME_KEY_STORAGE);
    await removeDataSecure(TOKEN_KEY_STORAGE);
    await removeData(BOOL_LOG_OUT);
    setTitle(translations.deletedConfirmed);
    setMessage(translations.deletedConfirmedText);
    setOnOk(() => () => navigation.replace("Login"));
    setOkText(translations.ok);
    setCancelText(null);
    setVisible(true);
  };

  const deleteRestaurant = async () => {
    setTitle(translations.deleteRestaurant);
    setMessage(translations.deleteRestaurantText);
    setOnOk(() => () => {
      setVisible(false);
      setBoolDeleting(true);
      deleting();
    });
    setOnCancelAlert(() => () => {
      setVisible(false);
    });
    setOkText(translations.delete);
    setCancelText(translations.cancel);
    setVisible(true);
  };

  const cancel = () => (typeof onCancel == "function" ? onCancel() : null);

  if (boolDeleting)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <AlertModel
          visible={visible}
          title={title}
          message={message}
          onOk={onOk}
          onCancel={onCancelAlert}
          OkText={OkText}
          cancelText={cancelText}
        />
        <ActivityIndicator size={50} color="#0000ff" />
      </View>
    );

  return (
    <View style={styles.container}>
      <AlertModel
        visible={visible}
        title={title}
        message={message}
        onOk={onOk}
        onCancel={onCancelAlert}
        OkText={OkText}
        cancelText={cancelText}
      />
      <Text style={styles.title}>{translations.writeTheRestaurantName}</Text>
      <Text style={styles.restaurantName}>"{restaurantName}"</Text>
      <TextInput
        style={styles.input}
        placeholder={translations.restaurantName}
        onChangeText={(text) => setRestaurantNameDelete(text)}
      />
      <View style={styles.rowButtons}>
        <Pressable
          style={({ pressed }) => [
            styles.buttonCancel,
            { opacity: pressed ? 0.5 : 1 },
          ]}
          onPress={() => cancel()}
        >
          <Text style={styles.textButton}>{translations.cancel}</Text>
        </Pressable>
        {restaurantNameDelete == restaurantName ? (
          <Pressable
            style={({ pressed }) => [
              styles.buttonDelete,
              { opacity: pressed ? 0.5 : 1 },
            ]}
            onPress={() => {
              deleteRestaurant(restaurantNameDelete);
            }}
          >
            <Text style={styles.textButton}>{translations.delete}</Text>
          </Pressable>
        ) : (
          <View style={styles.buttonGray}>
            <Text style={styles.textButton}>{translations.delete}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  restaurantName: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    color: "#555",
  },
  input: {
    width: widthDivided(1.5),
    height: heightDivided(20),
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    textAlign: "center",
    margin: 10,
    padding: 10,
    backgroundColor: "#fff",
  },
  buttonDelete: {
    flex: 1,
    backgroundColor: "#ff4d4d",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    margin: 10,
  },
  buttonGray: {
    flex: 1,
    backgroundColor: "#ccc",
    justifyContent: "center",
    height: 50,
    alignItems: "center",
    borderRadius: 10,
    margin: 10,
  },
  buttonCancel: {
    flex: 1,
    backgroundColor: "#4d79ff",
    justifyContent: "center",
    height: 50,
    alignItems: "center",
    borderRadius: 10,
    margin: 10,
  },
  textButton: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  rowButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
