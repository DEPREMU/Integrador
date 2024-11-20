import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Cook from "./Screens/Cook";
import Menu from "./Screens/Menu";
import Login from "./Screens/Login";
import Owner from "./Screens/Owner";
import Sales from "./components/Sales";
import Signin from "./Screens/Signin";
import Waiter from "./Screens/Waiter";
import Loading from "./components/Loading";
import Welcome from "./Screens/Welcome";
import Settings from "./Screens/Settings";
import { useEffect, useState } from "react";
import {
  loadData,
  saveData,
  checkLanguage,
  BOOL_ANIMATIONS,
  FIRST_TIME_LOADING_APP,
} from "./components/globalVariables";

export default App = () => {
  const Stack = createNativeStackNavigator();
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFirstTimeLoading = async () => {
      const firstTime = await loadData(FIRST_TIME_LOADING_APP);
      if (firstTime == null) {
        await saveData(BOOL_ANIMATIONS, JSON.stringify(false));
        await checkLanguage();
        setIsFirstTime(true);
        setLoading(false);
      } else setLoading(false);
    };

    checkFirstTimeLoading();
  }, []);

  if (loading) return <Loading boolActivityIndicator={true} />;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isFirstTime ? "Cook" : "Login"}>
        {/*//? Para cada vista se tiene que agregar aqui para mostrarse mediante un boton */}
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Signin"
          component={Signin}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Owner"
          component={Owner}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Cook"
          component={Cook}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Waiter"
          component={Waiter}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Sales"
          component={Sales}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Menu"
          component={Menu}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
