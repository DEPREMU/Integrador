import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

interface SkipButtonProps {
  text?: string;
  setPage: (value: any) => any;
  maxPages: number;
}
const SkipButton: React.FC<SkipButtonProps> = ({
  text = "Skip",
  setPage,
  maxPages,
}) => (
  <Pressable
    style={({ pressed }) => [styles.buttonSkip, { opacity: pressed ? 0.5 : 1 }]}
    onPress={() => setPage(maxPages)}
  >
    <Text style={styles.textSkip}>{text}</Text>
  </Pressable>
);

export default SkipButton;

const styles = StyleSheet.create({
  buttonSkip: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "yellow",
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
  textSkip: {
    color: "black",
    fontSize: 16,
  },
});
