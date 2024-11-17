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
import { appName, tableNameErrorLogs } from "./globalVariables";

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

      <EachCuadro
        texts={[restaurantName, translations.ownerText]}
        onPress={() => onPressToReturn()}
      />

      <View style={styles.header}>
        <Text style={styles.headerText}>{translations.newDish}</Text>
      </View>

      <View style={styles.body}>
        <TextInput
          style={styles.input}
          placeholder={translations.dishName}
          onChangeText={(text) => setNewDishName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder={translations.dishPrice}
          value={newDishPrice}
          onChangeText={(text) => setNewDishPrice(isFinite(text) ? text : "")}
          keyboardType="numeric"
        />

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

        {(allIngredients == null || allIngredients.length == 0) && (
          <Text style={styles.noInventoryAdded}>
            {translations.noInventoryAdded}
          </Text>
        )}

        <Pressable
          style={({ pressed }) => [styles.row, { opacity: pressed ? 0.5 : 1 }]}
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
  );
};

export default NewDish;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    marginVertical: 20,
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  body: {
    flex: 1,
    paddingBottom: 20,
  },
  input: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  scrollView: {
    marginBottom: 20,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  eachProduct: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    maxWidth: "60%",
  },
  textEachIngredient: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  noInventoryAdded: {
    fontSize: 16,
    color: "#d9534f",
    textAlign: "center",
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  textAddImageLink: {
    fontSize: 16,
    color: "#007bff",
  },
  buttonAddNew: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonTextAddNewDish: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});
