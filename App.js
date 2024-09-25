import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./Screens/Login";
import Signin from "./Screens/Signin";
import Owner from "./Screens/Owner";
import Cook from "./Screens/Cook";
import Waiter from "./Screens/Waiter";
import Settings from "./Screens/Settings";

const App = () => {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Para cada vista se tiene que agregar aqui para mostrarse mediante un boton */}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
