import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Cook from "./Screens/Cook";
import Login from "./Screens/Login";
import Owner from "./Screens/Owner";
import Signin from "./Screens/Signin";
import Waiter from "./Screens/Waiter";
import Loading from "./components/Loading";
import Welcome from "./Screens/Welcome";
import Settings from "./Screens/Settings";
import { useEffect, useState } from "react";
import { FIRST_TIME_LOADING_APP, loadData } from "./components/globalVariables";
import Sales from "./components/Sales";
import Menu from "./Screens/Menu";

export default App = () => {
  const Stack = createNativeStackNavigator();
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFirstTimeLoading = async () => {
      const firstTime = await loadData(FIRST_TIME_LOADING_APP);
      if (firstTime == null) {
        setIsFirstTime(true);
        setLoading(false);
      } else setLoading(false);
    };
    checkFirstTimeLoading();
  }, []);

  if (loading) return <Loading boolActivityIndicator={true} />;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isFirstTime ? "Login" : "Login"}>
        {/* Para cada vista se tiene que agregar aqui para mostrarse mediante un boton */}
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
