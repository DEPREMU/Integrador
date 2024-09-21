import { View, Text } from "react-native";
import LogOut from "../components/LogOut";
const Cook = ({ navigation }) => {
  return (
    <View>
      <LogOut navigation={navigation} />
      <Text>Cook</Text>
    </View>
  );
};
export default Cook;
