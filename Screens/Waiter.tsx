import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import {
  plusImage,
  checkLanguage,
  loadDataSecure,
  substractImage,
  separatorForDB,
  ROLE_STORAGE_KEY,
  TOKEN_KEY_STORAGE,
  interpolateMessage,
  RESTAURANT_NAME_KEY_STORAGE,
  separatorForDB2,
  removeDataSecure,
  LanguageKeys,
} from "../components/globalVariables";
import {
  getAllDataFromTable,
  getName,
  insertInTable,
} from "../components/DataBaseConnection";
import languages from "../components/languages.json";
import { TextInput } from "react-native";
import { StyleSheet } from "react-native";
import { useStylesWaiter } from "../styles/stylesWaiter";
import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import AlertModel from "../components/AlertModel";
import { Translations } from "../components/interfaceTranslations";

interface WaiterProps {
  navigation: any;
}
interface Product {
  id: number;
  quantity: number;
  notes: string[];
  name: string;
  price: number;
  ingredients: string;
  category: string;
}

const Waiter: React.FC<WaiterProps> = ({ navigation }) => {
  const thingsToLoad = 3;
  const styles = useStylesWaiter();

  const [lang, setLang] = useState<string>("en");
  const [role, setRole] = useState<string | null>(null);
  const [menu, setMenu] = useState<string | null>(null);
  const [onOk, setOnOk] = useState<() => any>(() => () => {});
  const [token, setToken] = useState<string>("");
  const [order, setOrder] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [onCancel, setOnCancel] = useState<() => any>(() => () => {});
  const [onOkText, setOnOkText] = useState<string | null>(null);
  const [textRole, setTextRole] = useState<string>("");
  const [category, setCategory] = useState<string>("Saucers");
  const [orderTotal, setOrderTotal] = useState<number>(0);
  const [categories, setCategories] = useState<string | null>(null);
  const [thingsLoaded, setThingsLoaded] = useState<number>(0);
  const [nameEmployee, setNameEmployee] = useState<string>("");
  const [onCancelText, setOnCancelText] = useState<string | null>(null);
  const [showCategory, setShowCategory] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState<string | null>(null);
  const [textNameEmploye, setTextNameEmploye] = useState<string>("");
  const [menuNotAvailable, setMenuNotAvailable] = useState<string | null>(null);
  const getTranslations = () => languages[lang as LanguageKeys];

  const askLogOut = () => {
    const translations = getTranslations();
    setTitle(translations.logOut);
    setMessage(translations.askLogOut);
    setOnOkText(translations.logOut);
    setOnCancelText(translations.cancel);
    setOnOk(() => () => {
      setVisible(false);
      logOut(navigation);
    });
    setOnCancel(() => () => setVisible(false));
    setVisible(true);
  };

  const logOut = async (navigation: any) => {
    setTitle(translations.logOut);
    setMessage(translations.logOutSuccess);
    setOnOk(() => () => navigation.replace("Login"));
    setOnOkText(translations.ok);
    setVisible(true);
    await removeDataSecure(TOKEN_KEY_STORAGE);
  };

  const fetchMenu = async (restaurantName: string) => {
    if (!restaurantName) return;

    const menu = await getAllDataFromTable(`${restaurantName}_menu`);
    const inventory = await getAllDataFromTable(`${restaurantName}_inventory`);

    if (!menu || !inventory) return;

    const platillosDisponibles: any[] = [];
    const platillosNoDisponibles: any[] = [];

    const menuCategories = [
      ...new Set(menu.map((product) => product.category)),
    ];

    menu.forEach((product) => {
      product.quantity = 0;
      const ingredientsObj = JSON.parse(product.ingredients);
      product["canMake"] = true;

      for (const ingredientName in ingredientsObj) {
        const requiredQuantity = ingredientsObj[ingredientName];
        const inventoryItem = inventory.find(
          (item) => item.productName == ingredientName
        );

        if (!inventoryItem || inventoryItem.stocks < requiredQuantity) {
          product.canMake = false;
          break;
        }
      }

      if (product.canMake) platillosDisponibles.push(product);
      else {
        platillosDisponibles.push(product);
        platillosNoDisponibles.push(product.id);
      }
    });

    setMenu(JSON.stringify(platillosDisponibles));
    setShowCategory((prev) => prev || menuCategories[0]);
    setCategories(JSON.stringify(menuCategories));
    setMenuNotAvailable(JSON.stringify(platillosNoDisponibles));
  };

  const addOrder = async (product: Product) => {
    if (!restaurantName || !order) return;
    await fetchMenu(restaurantName);
    const newOrder = JSON.parse(order) || [];
    let existingProduct = newOrder.find((item: any) => item.id == product.id);
    if (!existingProduct) existingProduct = null;

    if (existingProduct) existingProduct.quantity += 1;
    else {
      product.quantity = 1;
      product.notes = [""];
      newOrder.push(product);
    }

    setOrderTotal(() => {
      let c = 0;
      newOrder.forEach((item: any) => (c += item.price * item.quantity));
      return c;
    });
    setOrder(JSON.stringify(newOrder));
  };

  const addNotes = (id: number) => {
    if (!order) return;
    const newOrders = JSON.parse(order).map((item: Product) => {
      if (item.id == id && item.quantity >= item.notes.length + 1) {
        console.log(item.quantity);
        console.log(item.notes.length);

        console.log(item);

        item.notes.push("");
      }
      return item;
    });
    setOrder(JSON.stringify(newOrders));
  };

  const reduceOrder = (id: number) => {
    if (!order) return;
    const newOrders = JSON.parse(order)
      .map((item: Product) => {
        if (item.id === id) item.quantity -= 1;
        return item;
      })
      .filter((item: Product) => item.quantity > 0);

    if (newOrders.length === 0) setOrder(null);
    else setOrder(JSON.stringify(newOrders));

    const removedItem = JSON.parse(order).find(
      (item: Product) => item.id === id
    );
    setOrderTotal((prevTotal) => prevTotal - removedItem.price);
  };

  const addText = (text: string, index: number, id: number) => {
    if (!order) return;
    const newOrders = JSON.parse(order).map((item: Product) => {
      if (item.id == id) item.notes[index] = text;
      return item;
    });
    setOrder(JSON.stringify(newOrders));
  };

  const substractNote = (id: number, index: number) => {
    if (!order) return;
    const newOrders = JSON.parse(order).map((item: Product) => {
      if (item.id == id) item.notes.splice(index, 1);
      return item;
    });
    setOrder(JSON.stringify(newOrders));
  };

  const askSendOrder = () => {
    if (!restaurantName || !order) return;
    const translations = getTranslations();
    setTitle(translations.sendOrder);
    setMessage(translations.askSendOrder);
    setOnOkText(translations.sendOrder);
    setOnCancelText(translations.cancel);
    setOnOk(() => () => {
      setVisible(false);
      sendOrder(restaurantName, order);
    });
    setOnCancel(() => () => setVisible(false));
    setVisible(true);
  };

  const sendOrder = async (restaurantName: string, order: string) => {
    try {
      const orderData = JSON.parse(order) || [];

      // id, orderDetail, characteristics, orderDate, totalAmount
      let orderDetail: any[] = [];
      let characteristics: any[] = [];
      let orderTime = new Date().toString();
      orderData.forEach((order: any, index: number) => {
        order.notes = order.notes.filter((char: string) => char != "");
        order.notes = `${order.notes.join(separatorForDB)}`;
        orderDetail.push(`${order.quantity}: ${order.name}`);
      });
      orderData.forEach((element: any) => {
        let char = element.notes;
        if (char.length > 0)
          characteristics.push(`${element.name}${separatorForDB}${char}`);
      });

      const dict = {
        orderDetail: orderDetail.join(separatorForDB),
        characteristics: characteristics.join(separatorForDB2),
        orderTime: orderTime,
        totalAmount: orderTotal,
      };

      const error = await insertInTable(`${restaurantName}_orders`, dict);
      if (error) console.error(error);
      else {
        setTitle(translations.orderSent);
        setMessage(translations.orderSentSuccess);
        setOnOkText(translations.ok);
        setOnOk(() => () => {
          setVisible(false);
          setOrder(null);
          setOrderTotal(0);
          fetchMenu(restaurantName);
        });
        setOnCancelText(null);
        setVisible(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const loadLanguage = async () => {
      const lang = await checkLanguage();
      setLang(lang);
      setThingsLoaded((prev) => prev + 1);
    };

    const loadTokenAndRestaurantName = async () => {
      const token = await loadDataSecure(TOKEN_KEY_STORAGE);
      const restaurant = await loadDataSecure(RESTAURANT_NAME_KEY_STORAGE);

      if (token && restaurant) {
        setToken(token);
        const { name } = await getName(restaurant, token);
        if (name) {
          setTextNameEmploye(
            interpolateMessage(getTranslations().nameInterpolate, [name])
          );
          setNameEmployee(name);
        }
        setThingsLoaded((prev) => prev + 1);
      }
      setRestaurantName(restaurant);
      setThingsLoaded((prev) => prev + 1);
    };

    const loadRole = async () => {
      const role = await loadDataSecure(ROLE_STORAGE_KEY);
      setRole(role);
      if (role)
        setTextRole(
          interpolateMessage(languages[lang as LanguageKeys].areaInterpolate, [
            role,
          ])
        );
    };

    loadLanguage();
    loadTokenAndRestaurantName();
    loadRole();
  }, []);

  useEffect(() => {
    if (!restaurantName) return;
    fetchMenu(restaurantName);
    const timer = setInterval(async () => {
      await fetchMenu(restaurantName);
    }, 4000);
    return () => clearInterval(timer);
  }, [restaurantName]);

  useEffect(() => {
    if (thingsLoaded >= thingsToLoad) setLoading(false);
  }, [thingsLoaded]);

  console.log("showCategory:", showCategory);

  const translations = getTranslations();

  if (loading || !restaurantName)
    return <Loading progress={thingsLoaded / thingsToLoad} />;

  return (
    <View style={styles.container}>
      <AlertModel
        onOk={onOk}
        title={title}
        visible={visible}
        message={message}
        OkText={onOkText}
        onCancel={onCancel}
        cancelText={onCancelText}
      />

      {/* Barra superior */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [
            styles.buttonLogOut,
            { opacity: pressed ? 0.7 : 1 },
          ]}
          onPress={askLogOut}
        >
          <Text style={styles.logOutText}>{translations.logOut}</Text>
        </Pressable>
        {/* //!Cambiar a translation.comandas */}
        <Text style={styles.headerText}>Comandas {"\n" + restaurantName}</Text>
        <View style={styles.userInfo}>
          <Text style={styles.userText}>{textNameEmploye}</Text>
          <Text style={styles.userText}>{role}</Text>
        </View>
      </View>

      {/* Botones de categorías */}
      <ScrollView
        style={styles.categoriesContainer} // Aplica la clase con el máximo de altura
        contentContainerStyle={{ padding: 5 }}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {categories != null &&
          JSON.parse(categories).map((category: string, index: number) => (
            <Pressable
              key={index}
              style={({ pressed }) => [
                styles.categoryButton,
                { opacity: pressed ? 0.7 : 1 },
              ]}
              onPress={() => setShowCategory(category)}
            >
              <Text style={styles.categoryText}>{category}</Text>
            </Pressable>
          ))}
      </ScrollView>

      <View style={styles.main}>
        {/* Cuadrícula de productos */}
        <ScrollView
          style={{ maxWidth: "60%", minWidth: "50%" }}
          contentContainerStyle={styles.productsContainer}
        >
          {menu == null && (
            <ActivityIndicator
              size="large"
              color="#FFC107"
              style={{ flex: 1 }}
            />
          )}
          {menu != null && (
            <View style={styles.grid}>
              {JSON.parse(menu).map((product: Product) => {
                if (product.category != showCategory) return null;
                return (
                  <Pressable
                    key={product.id}
                    style={({ pressed }) => [
                      styles.productCard,
                      { opacity: pressed ? 0.7 : 1 },
                    ]}
                    onPress={() => addOrder(product)}
                  >
                    <Text style={styles.productName}>
                      {translations.saucer}
                      {": "}
                      <Text style={styles.productNameBold}>{product.name}</Text>
                    </Text>
                    <Text style={styles.priceText}>
                      {translations.saucerPrice}
                      {": "}
                      <Text style={styles.priceTextBold}>{product.price}</Text>
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        </ScrollView>

        {/* Panel de orden */}
        <View style={styles.orderPanel}>
          <Text style={styles.orderTitle}>
            {interpolateMessage(translations.orderInterpolate, ["X"])}
          </Text>

          <ScrollView
            contentContainerStyle={styles.orderContainer}
            style={styles.orderScroll}
            showsVerticalScrollIndicator={false}
          >
            {order != null && (
              <Order
                order={order}
                translations={translations}
                reduceOrder={reduceOrder}
                addNotes={addNotes}
                substractNote={substractNote}
                addText={addText}
              />
            )}
            <Text style={styles.orderTotal}>
              {translations.total}: {order != null ? orderTotal : 0}$
            </Text>
          </ScrollView>
          {order != null && (
            <Pressable
              style={({ pressed }) => [
                styles.sendButton,
                { opacity: pressed ? 0.7 : 1 },
              ]}
              onPress={() => askSendOrder()}
            >
              <Text style={styles.sendText}>{translations.sendOrder}</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* Botones inferiores */}
      <View style={styles.bottomButtons}>
        <Pressable
          style={({ pressed }) => [
            styles.bottomButton,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Text style={styles.bottomText}>Imprimir</Text>
        </Pressable>
        {/* <Pressable
          style={({ pressed }) => [
            styles.bottomButton,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Text style={styles.bottomText}>Editar</Text>
        </Pressable>         */}
      </View>
    </View>
  );
};

export default Waiter;

interface NotesProps {
  product: Product;
  translations: Translations;
  addText: (text: string, index: number, id: number) => any;
  substractNote: (id: number, index: number) => any;
}

const Notes: React.FC<NotesProps> = ({
  product,
  translations,
  addText,
  substractNote,
}) => {
  const styles = StyleSheet.create({
    notesRow: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 5,
    },
    orderItemNotes: {
      flex: 1,
      borderWidth: 1,
      borderColor: "#ccc",
      padding: 10,
      borderRadius: 5,
    },
    orderItemNoteDelete: {
      flexDirection: "row",
      alignItems: "center",
      marginLeft: 10,
    },
    orderItemDeleteText: {
      color: "red",
      marginRight: 5,
    },
    imageReduceNotes: {
      width: 20,
      height: 20,
    },
  });
  return (
    <>
      {product.notes.map((note: string, index: number) => (
        <View style={styles.notesRow} key={index}>
          <TextInput
            key={index}
            style={styles.orderItemNotes}
            value={note}
            onChangeText={(text) => addText(text, index, product.id)}
          />
          <Pressable
            style={({ pressed }) => [
              styles.orderItemNoteDelete,
              { opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={() => substractNote(product.id, index)}
          >
            <Image source={substractImage} style={styles.imageReduceNotes} />
          </Pressable>
        </View>
      ))}
    </>
  );
};

interface OrderProps {
  order: string;
  addText: (text: string, index: number, id: number) => any;
  addNotes: (id: number) => any;
  reduceOrder: (id: number) => any;
  translations: Translations;
  substractNote: (id: number, index: number) => any;
}

const Order: React.FC<OrderProps> = ({
  order,
  addText,
  addNotes,
  reduceOrder,
  translations,
  substractNote,
}) => {
  const styles = StyleSheet.create({
    orderItemContainer: {
      marginBottom: 10,
      padding: 10,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
    },
    orderViewItem: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      alignItems: "center",
    },
    orderItem: {
      fontSize: 16,
    },
    orderItemDelete: {
      backgroundColor: "red",
      padding: 5,
      borderRadius: 5,
    },
    orderItemDeleteText: {
      color: "white",
    },
    orderItemNotesTitle: {
      fontSize: 14,
      marginTop: 10,
    },
    orderAddNoteButton: {
      marginTop: 10,
      alignSelf: "flex-start",
    },
    imageAddNotes: {
      width: 20,
      height: 20,
    },
    addNoteText: {},
  });

  return (
    <>
      {JSON.parse(order).map((product: Product, index: number) => {
        return (
          <View key={product.id || index} style={styles.orderItemContainer}>
            <View style={styles.orderViewItem}>
              <Text style={styles.orderItem}>
                {product.quantity}: {product.name} {".... "}
                {product.price * product.quantity}$
              </Text>
              <Pressable
                onPress={() => reduceOrder(product.id)}
                style={({ pressed }) => [
                  styles.orderItemDelete,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Text style={styles.orderItemDeleteText}>
                  {translations[product.quantity != 1 ? "reduce" : "delete"]}
                </Text>
              </Pressable>
            </View>
            <Text style={styles.orderItemNotesTitle}>{translations.notes}</Text>
            <Notes
              product={product}
              addText={addText}
              translations={translations}
              substractNote={substractNote}
            />
            <Pressable
              style={({ pressed }) => [
                styles.orderAddNoteButton,
                { opacity: pressed ? 0.7 : 1 },
              ]}
              onPress={() => addNotes(product.id)}
            >
              <Text style={styles.addNoteText}>{translations.addNote}</Text>
              <Image source={plusImage} style={styles.imageAddNotes} />
            </Pressable>
          </View>
        );
      })}
    </>
  );
};
