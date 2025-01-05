import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

interface ContinueButtonProps {
  text: string;
  func: () => any;
}

const ContinueButton: React.FC<ContinueButtonProps> = ({ text, func }) => (
  <Pressable
    style={({ pressed }) => [styles.button, { opacity: pressed ? 0.5 : 1 }]}
    onPress={func}
  >
    <Text style={styles.text}>{text}</Text>
  </Pressable>
);

export default ContinueButton;

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "yellow",
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  text: {
    color: "black",
    fontSize: 16,
  },
});
