import { View, Text } from "react-native";
import stylesHS from "../styles/stylesHomeScreen";
import { TouchableOpacity } from "react-native-web";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={stylesHS.container}>
      <Text style={stylesHS.text}>Home Screen</Text>
      <TouchableOpacity
        onpress={() => navigation.navigate("HomeScreen")}
        style={stylesHS.settings}
      >
        <Text style={[stylesHS.text, { textAlign: "center" }]}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
};
export default HomeScreen;
