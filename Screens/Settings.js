import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";

const Settings = ({ navigation }) => {
  return (
    <View style={stylesSettings.container}>
      <Text style={stylesSettings.texts}>Settings</Text>
    </View>
  );
};

export default Settings;

const stylesSettings = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  texts: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
