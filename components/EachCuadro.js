import React from "react";
import { Pressable, Text, View, Image, StyleSheet } from "react-native";

export default EachCuadro = ({ texts, onPress, imageVariable }) => (
  <Pressable
    style={styles.containerEach}
    onPress={() => (onPress && typeof onPress == "function" ? onPress() : null)}
  >
    <View style={[styles.row]}>
      <View style={styles.containerOfLeftSide}>
        {texts != null &&
          texts.map((text, index) => (
            <Text key={index} style={styles.textBefore}>
              {text}
            </Text>
          ))}
      </View>
      {imageVariable != null && <Image source={imageVariable} />}
      <View
        style={{
          backgroundColor: "gray",
          width: 80,
          height: 80,
          borderRadius: 100,
        }}
      />
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    flex: 1 / 2,
  },
  containerEach: {
    flex: 1 / 5,
  },
  row: {
    backgroundColor: "blueviolet",
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 40,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 5,
  },
  textBefore: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  containerOfLeftSide: {
    flex: 2 / 3,
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
});
