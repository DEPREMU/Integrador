import { View, Text } from "react-native";
import LogOut from "../components/logOut";
const Cook = ({ navigation }) => {
  return (
    <View>
      <LogOut navigation={navigation} />
      <Text>Cook</Text>
    </View>
  );
};
export default Cook;
