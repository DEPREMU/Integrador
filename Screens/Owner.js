import { View, Text, BackHandler, Alert } from "react-native";
import styleOwner from "../styles/stylesScreenOwner";
import LogOut from "../components/logOut";
import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState } from "react";

const Owner = ({ navigation }) => {
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true;
      };
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  return (
    <View style={styleOwner.container}>
      <LogOut navigation={navigation} />
      <Text style={styleOwner.texts}>Owner</Text>
    </View>
  );
};
export default Owner;
