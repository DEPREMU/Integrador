import React from "react";
import { Pressable, Text, View, Image, StyleSheet } from "react-native";

interface EachRectangleProps {
  texts: string[];
  onPress?: () => void;
  imageVariable?: any;
}

const EachRectangle: React.FC<EachRectangleProps> = ({
  texts,
  onPress,
  imageVariable,
}) => (
  <View style={styles.container}>
    <Pressable
      style={styles.containerEach}
      onPress={() =>
        onPress && typeof onPress == "function" ? onPress() : null
      }
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
        {imageVariable != null ? (
          <Image source={imageVariable} style={styles.image} />
        ) : (
          <View
            style={{
              backgroundColor: "gray",
              width: 80,
              height: 80,
              borderRadius: 100,
            }}
          />
        )}
      </View>
    </Pressable>
  </View>
);

export default EachRectangle;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    flex: 1,
  },
  containerEach: {
    width: "90%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    marginBottom: 15,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  containerOfLeftSide: {
    flex: 1,
    marginRight: 10,
  },
  textBefore: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 5,
  },
  image: {
    width: 80,
    height: 80,
  },
});
