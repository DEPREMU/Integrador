import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
} from "react-native";
import React, { useCallback, useState, useEffect } from "react";
import {
  deleteFromTable,
  getAllDataFromTable,
  insertInTable,
  updateTableByEq,
} from "./DataBaseConnection";
import Loading from "./Loading";
import EachRectangle from "./EachRectangle";
import TableInventory from "./TableInventory";
import AlertModel from "./AlertModel";
import { interpolateMessage, userImage } from "./globalVariables";

const Inventory = ({ translations, restaurantName, onPressToReturn }) => {
  const thingsToLoad = 1;
  const [title, setTitle] = useState("");
  const [onOk, setOnOk] = useState(() => () => {});
  const tableNameInventory = `${restaurantName}_inventory`;
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [quantity, setQuantity] = useState("");
  const [onCancel, setOnCancel] = useState(() => () => {});
  const [onOkText, setOnOkText] = useState("");
  const [inventory, setInventory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [idSelected, setIdSelected] = useState(null);
  const [description, setDescription] = useState("");
  const [thingsLoaded, setThingsLoaded] = useState(0);
  const [idSelectedToDelete, setIdSelectedToDelete] = useState(null);
  const [onCancelText, setOnCancelText] = useState("");
  const [quantityToAdd, setQuantityToAdd] = useState("");
  const [ingredientName, setIngredientName] = useState("");

  const loadInventory = async () => {
    const data = await getAllDataFromTable(tableNameInventory);
    if (data && data.length > 0) setInventory(JSON.stringify(data));
    setThingsLoaded((prev) => prev + 1);
  };

  useEffect(() => {
    loadInventory();
  }, []);

  useEffect(() => {
    if (!idSelectedToDelete) return;

    const ingredient = JSON.parse(inventory).find(
      (ingredient) => ingredient.id == idSelectedToDelete
    );
    if (!ingredient) return;

    setTitle(translations.delete);
    setMessage(
      interpolateMessage(translations.askDelete, [ingredient.productName])
    );
    setOnOk(() => () => {
      setVisible(false);
      deleteFromInventory();
    });
    setOnOkText(translations.delete);
    setOnCancelText(translations.cancel);
    setOnCancel(() => () => setVisible(false));
    setIdSelectedToDelete(null);
    setVisible(true);

    const deleteFromInventory = async () => {
      await deleteFromTable(tableNameInventory, 1, "id", idSelectedToDelete);
      loadInventory();
      setTitle(translations.delete);
      setMessage(translations.deletedConfirmed);
      setOnOkText(translations.ok);
      setOnOk(() => () => setVisible(false));
      setOnCancelText(null);
      setVisible(true);
    };
  }, [idSelectedToDelete]);

  useEffect(() => {
    if (thingsLoaded >= thingsToLoad) setIsLoading(false);
  }, [thingsLoaded]);

  useEffect(() => {
    if (idSelected) {
      const ingredient = JSON.parse(inventory).find(
        (ingredient) => ingredient.id === idSelected
      );
      setIngredientName(ingredient.productName);
      setQuantity(ingredient.stocks);
      setDescription(ingredient.productDescription);
    }
  }, [idSelected]);

  const verifyQuantity = (text) => {
    setQuantity((prev) => {
      if (isNaN(text)) return prev;
      return text;
    });
  };

  const verifyFills = async () => {
    if (idSelected) {
      await updateTableByEq(
        tableNameInventory,
        {
          stocks: parseFloat(quantity) + parseFloat(quantityToAdd || "0"),
          productName: ingredientName,
          productDescription: description,
        },
        idSelected,
        "id"
      );
      setQuantityToAdd("");
      setQuantity("");
      setIngredientName("");
      setIdSelected(null);
      setTitle(translations.success);
      setMessage(translations.ingredientUpdated);
      setOnOk(() => () => setVisible(false));
      setOnCancelText(null);
      setOnOkText(translations.ok);
      setVisible(true);

      return await loadInventory();
    }

    if (!ingredientName || !quantity || !description) {
      setTitle(translations.error);
      setMessage(translations.pleaseFillFields);
      setOnCancelText(null);
      setOnOk(() => () => setVisible(false));
      setOnOkText(translations.ok);
      setVisible(true);
      return;
    } else if (isNaN(quantity) || quantity < 0) {
      setTitle(translations.error);
      setOnCancelText(null);
      setMessage(translations.quantityMustBeNumber);
      setOnOk(() => () => setVisible(false));
      setOnOkText(translations.ok);
      setVisible(true);
      return;
    }
    const addIngredient = async () => {
      setIngredientName("");
      setQuantity("");
      setDescription("");
      await insertInTable(tableNameInventory, {
        productName: ingredientName,
        stocks: quantity,
        productDescription: description,
      });
      setTitle(translations.added);
      setMessage(translations.addedSuccess);
      setOnOkText(translations.ok);
      setOnOk(() => () => setVisible(false));
      setOnCancelText(null);
      setVisible(true);
      await loadInventory();
    };
    if (inventory) {
      const ingredient = JSON.parse(inventory).map(
        (ingredient) => ingredient.productName == ingredientName
      );
      if (!ingredient) addIngredient();
    } else addIngredient();
  };

  if (isLoading)
    return <Loading boolActivityIndicator={true} boolLoadingText={true} />;

  return (
    <View style={styles.container}>
      <AlertModel
        onOk={onOk}
        title={title}
        visible={visible}
        message={message}
        onCancel={onCancel}
        onOkText={onOkText}
        cancelText={onCancelText}
      />

      <EachRectangle
        texts={[translations.inventory, translations.ownerText]}
        imageVariable={userImage}
        onPress={onPressToReturn}
      />

      <View style={styles.main}>
        <View style={styles.newIngredient}>
          <Text style={styles.textTitle}>{translations.newIngredient}</Text>

          <View style={styles.newIngredientName}>
            <Text style={styles.textLabel}>{translations.ingredientName}</Text>

            <TextInput
              style={styles.input}
              placeholder={translations.exampleIngredientName}
              onChangeText={(text) => setIngredientName(text)}
              value={ingredientName}
            />
          </View>

          {!idSelected && (
            <View style={styles.newIngredientQuantity}>
              <Text style={styles.textLabel}>{translations.quantity}</Text>

              <TextInput
                style={styles.input}
                placeholder={translations.exampleIngredientQuantity}
                value={quantity}
                onChangeText={(text) => verifyQuantity(text)}
                maxLength={10}
                keyboardType="numeric"
              />
            </View>
          )}
          {idSelected && (
            <View style={styles.addNewQuantity}>
              <Text style={styles.textLabel}>
                {interpolateMessage(translations.addToQuantity, [quantity])}
              </Text>
              <TextInput
                style={styles.input}
                placeholder={translations.exampleIngredientQuantity}
                value={quantityToAdd}
                onChangeText={(text) => verifyQuantity(text)}
                maxLength={10}
                keyboardType="numeric"
              />
            </View>
          )}

          <View style={styles.newIngredientDescription}>
            <Text style={styles.textLabel}>{translations.description}</Text>

            <TextInput
              style={styles.input}
              placeholder={translations.exampleIngredientDescription}
              onChangeText={(text) => setDescription(text)}
              value={description}
            />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.buttonAddNew,
              { opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={() => verifyFills()}
          >
            <Text style={styles.buttonTextAddNew}>
              {idSelected ? translations.edit : translations.addIngredient}
            </Text>
          </Pressable>
        </View>
        {inventory != null && (
          <View style={styles.containerIngredients}>
            <TableInventory
              inventory={inventory}
              setIdSelected={setIdSelected}
              translations={translations}
              setIdSelectedToDelete={setIdSelectedToDelete}
              idSelected={idSelected}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default Inventory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  main: {
    flex: 5.5,
    marginTop: 15,
  },
  newIngredient: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  textTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  newIngredientName: {
    marginBottom: 15,
  },
  newIngredientQuantity: {
    marginBottom: 15,
  },
  addNewQuantity: {
    marginBottom: 15,
  },
  newIngredientDescription: {
    marginBottom: 20,
  },
  textLabel: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F1F1F1",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    fontSize: 16,
    color: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonAddNew: {
    backgroundColor: "#6F42C1",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    shadowColor: "#6F42C1",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonTextAddNew: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  containerIngredients: {
    flex: 1,
    marginTop: 20,
  },
});
