import {
  loadData,
  saveData,
  checkLanguage,
} from "./utils/globalVariables/utils";
import {
  fontApp,
  fontAppItalic,
  BOOL_ANIMATIONS,
  FIRST_TIME_LOADING_APP,
} from "./utils/globalVariables/constants";
import Cook from "./screens/cook/Cook";
import Menu from "./screens/owner/Menu";
import Login from "./screens/auth/Login";
import Owner from "./screens/owner/Owner";
import Sales from "./components/Sales";
import Signin from "./screens/auth/Signin";
import Waiter from "./screens/waiter/Waiter";
import Loading from "./components/common/Loading";
import Welcome from "./screens/auth/Welcome";
import Settings from "./screens/common/Settings";
import Register from "./screens/register/Register";
import { useFonts } from "expo-font";
import ForgotPassword from "./screens/auth/ForgotPassword";
import { LayoutProvider } from "./components/context/LayoutContext";
import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const App: React.FC = () => {
  const Stack = createNativeStackNavigator();
  const [loading, setLoading] = useState<boolean>(true);
  const [isFirstTime, setIsFirstTime] = useState<boolean>(false);
  const [fontsLoaded, error] = useFonts({
    fontApp: fontApp,
    fontAppI: fontAppItalic,
  });

  useEffect(() => {
    const checkFirstTimeLoading = async () => {
      const firstTime = await loadData(FIRST_TIME_LOADING_APP);

      if (firstTime) {
        setLoading(false);
        return;
      }

      await saveData(BOOL_ANIMATIONS, JSON.stringify(false));
      await checkLanguage();
      setIsFirstTime(true);
      setLoading(false);
    };

    checkFirstTimeLoading();
  }, []);

  if (loading || !fontsLoaded) return <Loading boolActivityIndicator={true} />;

  return (
    <LayoutProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={isFirstTime ? "Welcome" : "Login"}>
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

          <Stack.Screen
            name="Register"
            component={Register}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPassword}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </LayoutProvider>
  );
};

export default App;
