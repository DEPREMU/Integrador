import { StyleSheet } from "react-native";
import { height, width, widthDivided } from "../components/globalVariables";

const Colors = {
  borderColor: "#696969",
  shadowColor: "#696969",
  backgroundLight: "#f5f5f5",
  backgroundMedium: "#dcdcdc",
  cardBackground: "#e7e7d1",
  textPrimary: "#2f4f4f",
  headerBackground: "#a9a9a9",
};
/* 
export default styleOwner = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  texts: {
    fontSize: 24,
    fontWeight: "bold",
  },
  animatedView: {
    backgroundColor: "gray",
    position: "absolute",
    width: widthDivided(2.25),
    top: 85,
    zIndex: 1,
    height: "100%",
  },
  buttonShow: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    shadowColor: "white",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    backgroundColor: "rgb(120, 220, 200)",
    borderColor: "black",
    flexDirection: "row",
    padding: 7,
    position: "absolute",
    top: 0,
    height: 85,
    width: width,
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderBottomWidth: 2,
  },
  options: {
    backgroundColor: "rgb(120, 220, 200)",
    borderColor: "black",
    justifyContent: "space-around",
    flexDirection: "row",
    padding: 8,
    borderWidth: 2,
    margin: 5,
    alignItems:"center",
    flex: 1,
  },
  textOptions: {
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "left",
  },
});
*/
export const styleOwner = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundLight,
    flex: 1,
  },
  containerEach: {
    flex: 1,
  },
  row: {
    backgroundColor: Colors.backgroundMedium,
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 40,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal:5,
  },
  textBefore: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  containerOfLeftSide: {
    flex: 2 / 3,
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
});
