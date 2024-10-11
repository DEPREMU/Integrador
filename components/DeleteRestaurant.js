import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  Text,
  Alert,
} from "react-native";
import {
  BOOL_LOG_OUT,
  heightDivided,
  loadData,
  removeData,
  RESTAURANT_NAME_KEY_STORAGE,
  TOKEN_KEY_STORAGE,
  widthDivided,
} from "./globalVariables";
import { deleteTables } from "./DataBaseConnection";

export default DeleteRestaurant = ({
  translations,
  navigation,
  onCancel,
  restaurantName,
}) => {
  const [restaurantNameDelete, setRestaurantNameDelete] = useState("");

  const deleting = async () => {
    await deleteTables(restaurantName);
    await removeData(RESTAURANT_NAME_KEY_STORAGE);
    await removeData(TOKEN_KEY_STORAGE);
    await removeData(BOOL_LOG_OUT);
    Alert.alert(
      translations.deletedConfirmed,
      translations.deletedConfirmedText,
      [
        {
          text: translations.ok,
          onPress: () => navigation.replace("Login"),
        },
      ]
    );
  };

  const deleteRestaurant = async () => {
    Alert.alert(
      translations.deleteRestaurant,
      translations.deleteRestaurantConfirmation,
      [
        {
          text: translations.cancel,
          onPress: () => null,
        },
        {
          text: translations.delete,
          onPress: async () => await deleting(),
        },
      ]
    );
  };

  const cancel = () => (typeof onCancel == "function" ? onCancel() : null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{translations.writeTheRestaurantName}</Text>
      <Text style={styles.restaurantName}>"{restaurantName}"</Text>
      <TextInput
        style={styles.input}
        placeholder={translations.restaurantName}
        onChangeText={(text) => setRestaurantNameDelete(text)}
      />
      <View style={styles.rowButtons}>
        <TouchableOpacity style={styles.buttonCancel} onPress={() => cancel()}>
          <Text style={styles.textButton}>{translations.cancel}</Text>
        </TouchableOpacity>
        {restaurantNameDelete == restaurantName ? (
          <TouchableOpacity
            style={styles.buttonDelete}
            onPress={() => {
              deleteRestaurant(restaurantNameDelete);
            }}
          >
            <Text style={styles.textButton}>{translations.delete}</Text>
          </TouchableOpacity>
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
