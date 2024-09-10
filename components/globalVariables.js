import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
const widthDivided = (num) => width / num;
const heightDivided = (num) => height / num;

export { width, height, widthDivided, heightDivided };
