import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./Screens/HomeScreen";

const App = () => {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer initialRouteName="Home">
      <Stack.Navigator>
        {/*Para cada vista se tiene que agregar aqui para mostrarse mediante un boton*/}
        <Stack.Screen
          name="Login"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
