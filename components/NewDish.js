import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Switch,
  ScrollView,
} from "react-native";
import Loading from "./Loading";
import { getAllDataFromTable, insertInTable } from "./DataBaseConnection";
import { appName, tableNameErrorLogs, userImage } from "./globalVariables";
import EachRectangle from "./EachRectangle";

const NewDish = ({
  navigation,
  translations,
  onPressToReturn,
  restaurantName,
}) => {
  const thingsToLoad = 1;
  const [newDishName, setNewDishName] = useState("");
  const [newDishPrice, setNewDishPrice] = useState("");
  const [newDishIngredients, setNewDishIngredients] = useState([]);
  const [newDishImageLink, setNewDishImageLink] = useState("");
  const [allIngredients, setAllIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [thingsLoaded, setThingsLoaded] = useState(0);
  const [error, setError] = useState(null);
  const [onOk, setOnOk] = useState(() => () => {});
  const [title, setTitle] = useState("Title");
  const [OkText, setOkText] = useState("Ok");
  const [message, setMessage] = useState("Message");
  const [visible, setVisible] = useState(false);
  const [onCancel, setOnCancel] = useState(() => () => {});
  const [cancelText, setCancelText] = useState(null);
  const [boolAddImageLink, setBoolAddImageLink] = useState(false);
  const [ingredients, setIngredients] = useState(JSON.stringify({}));
  const [boolAddDish, setBoolAddDish] = useState(false);

  const fetchInventory = async () => {
    try {
      const dataIngredients = await getAllDataFromTable(
        `${restaurantName}_inventory`
      );
      console.log("Data:", dataIngredients);

      if (dataIngredients && dataIngredients.length > 0)
        setAllIngredients(JSON.stringify(dataIngredients));
      else setAllIngredients([]);
    } catch (error) {
      setError(true);
      await insertInTable(tableNameErrorLogs, {
        appName: appName,
        error: `An error occurred fetching ingredients: ${error}`,
        date: new Date().toLocaleString(),
        component: `./Screens/Menu/NewDish/useEffect/fetchInventory() catch (error) => Error fetching ingredients: ${error}`,
      });
    }
  };

  const changeIngredients = (id) => {
    if (newDishIngredients.includes(id)) {
      setNewDishIngredients((prev) => prev.filter((oldId) => oldId != id));
      const newIngredients = JSON.parse(ingredients);
      delete newIngredients[id];
      setIngredients(JSON.stringify(newIngredients));
    } else setNewDishIngredients((prev) => [...prev, id]);
  };

  const verifyQuantity = (text, id) => {
    if (!isFinite(text)) return;
    const newIngredients = JSON.parse(ingredients);
    newIngredients[id] = text;
    setIngredients(JSON.stringify(newIngredients));
  };

  const askAddNewDish = () => {
    setOnOk(() => () => setBoolAddDish(true));
    setOnCancel(() => () => setVisible(false));
    setTitle(translations.addDish);
    setMessage(translations.addDishConfirmation);
    setOkText(translations.addDish);
    setCancelText(translations.cancel);
    setVisible(true);
  };

  useEffect(() => {
    const loadIngredients = async () => {
      await fetchInventory();
      setThingsLoaded((prev) => prev + 1);
    };
    loadIngredients();
  }, []);

  useEffect(() => {
    if (thingsToLoad >= thingsLoaded) setLoading(false);
  }, [thingsLoaded]);

  useEffect(() => {
    const addNewDish = async () => {
      try {
        setVisible(false);
        const newDish = {
          name: newDishName,
          ingredients: ingredients,
          price: newDishPrice,
          imageLink: boolAddImageLink ? newDishImageLink : "",
        };
        await insertInTable(`${restaurantName}_menu`, newDish);
        setMessage(translations.dishAdded);
        setOkText(translations.ok);
        setOnOk(() => () => setVisible(false));
        setCancelText(null);
        setVisible(true);
        setBoolAddDish(false);
        setNewDishName("");
        setNewDishPrice(0);
        setNewDishImageLink("");
        setBoolAddImageLink(false);
        setIngredients(JSON.stringify({}));
      } catch (error) {
        console.error(error);
        setError(true);
        await insertInTable(tableNameErrorLogs, {
          appName: appName,
          error: `An error occurred adding new dish: ${error}`,
          date: new Date().toLocaleString(),
          component: `./Screens/Menu/NewDish/useEffect/addNewDish() catch (error) => Error adding new dish: ${error}`,
        });
      }
    };
    if (boolAddDish) addNewDish();
  }, [boolAddDish]);

  if (loading)
    return <Loading boolActivityIndicator={true} boolLoadingText={true} />;

  return (
    <View style={styles.container}>
      <AlertModel
        visible={visible}
        title={title}
        message={message}
        onOk={onOk}
        onCancel={onCancel}
        OkText={OkText}
        cancelText={cancelText}
      />

      <EachRectangle
        texts={[restaurantName, translations.ownerText]}
        onPress={() => onPressToReturn()}
        imageVariable={userImage}
      />

      <View style={styles.main}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{translations.newDish}</Text>
        </View>

        <View style={styles.body}>
          <View style={styles.containerDishName}>
            <Text style={styles.textLabel}>{translations.dishName}</Text>
            <TextInput
              style={styles.input}
              placeholder={translations.exampleDishName}
              onChangeText={(text) => setNewDishName(text)}
            />
          </View>
          <View style={styles.containerDishPrice}>
            <Text style={styles.textLabel}>{translations.dishPrice}</Text>
            <TextInput
              style={styles.input}
              placeholder={translations.exampleDishPrice}
              value={newDishPrice}
              onChangeText={(text) =>
                setNewDishPrice(isFinite(text) ? text : "")
              }
              keyboardType="numeric"
            />
          </View>

          {allIngredients != null && allIngredients.length > 0 && (
            <ScrollView style={styles.scrollView}>
              {JSON.parse(allIngredients).map((value) => (
                <View style={styles.eachProduct} key={value.id}>
                  <Switch
                    value={newDishIngredients.includes(value.id)}
                    onValueChange={() => changeIngredients(value.id)}
                  />

                  {newDishIngredients.includes(value.id) && (
                    <TextInput
                      style={styles.input}
                      placeholder={translations.quantity}
                      value={JSON.parse(ingredients)[value.id]}
                      keyboardType="numeric"
                      onChangeText={(text) => verifyQuantity(text, value.id)}
                    />
                  )}
                  <Text style={styles.textEachIngredient}>
                    {value.productName}
                  </Text>
                </View>
              ))}
            </ScrollView>
          )}

          {(!allIngredients || allIngredients.length == 0) && (

            <Text style={styles.noInventoryAdded}>
              {translations.noInventoryAdded}
            </Text>
          )}

          <Pressable
            style={({ pressed }) => [
              styles.row,
              { opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={() => setBoolAddImageLink((prev) => !prev)}
          >
            <Text style={styles.textAddImageLink}>
              {translations.addImageLink}
            </Text>
            <Switch
              onValueChange={() => setBoolAddImageLink((prev) => !prev)}
              value={boolAddImageLink}
            />
          </Pressable>

          {boolAddImageLink && (
            <TextInput
              style={styles.input}
              placeholder={translations.dishImageLink}
              onChangeText={(text) => setNewDishImageLink(text)}
              value={newDishImageLink}
            />
          )}
          <Pressable
            style={({ pressed }) => [
              styles.buttonAddNew,
              { opacity: pressed ? 0.5 : 1 },
            ]}
            onPress={() => askAddNewDish()}
          >
            <Text style={styles.buttonTextAddNewDish}>
              {translations.addDish}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default NewDish;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  main: {
    flex: 5,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  header: {
    marginBottom: 20,
    backgroundColor: "#6F42C1",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6F42C1",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  headerText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  body: {
    flex: 1,
  },
  input: {
    height: 45,
    borderColor: "#D3D3D3",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
    fontSize: 16,
    backgroundColor: "#F2F2F2",
  },
  scrollView: {
    marginVertical: 15,
  },
  eachProduct: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  textEachIngredient: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  noInventoryAdded: {
    fontSize: 16,
    color: "#B0B0B0",
    textAlign: "center",
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  textAddImageLink: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  buttonAddNew: {
    backgroundColor: "#6F42C1",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    shadowColor: "#6F42C1",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonTextAddNewDish: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
