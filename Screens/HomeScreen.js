import { View, Text, TouchableOpacity, Image } from "react-native";
import stylesHS from "../styles/stylesHomeScreen";
import React, { useEffect, useState } from "react";
import { Error, Loading, userImage } from "../components/globalVariables";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const [loadingText, setLoadingText] = useState("Loading.");
  const [thingsLoaded, setThingsLoaded] = useState(0);
  const thingsToLoad = 10;
  const [errorText, setErrorText] = useState(null);

  useEffect(() => {
    if (thingsLoaded == thingsToLoad) setLoading(false);
    else
      setTimeout(() => {
        if (loadingText.indexOf("...")) setLoadingText("Loading.");
        else if (loadingText.indexOf("..")) setLoadingText("Loading...");
        else if (loadingText.indexOf(".")) setLoadingText("Loading..");
      }, 1000);
  }, [thingsLoaded]);

  if (loading) return <Loading loadingText={loadingText} />;
  if (error && errorText != null) return <Error error={errorText} />;

  return (
    <View style={stylesHS.container}>
      <Image source={userImage} style={stylesHS.imageUser} />
      <Text style={stylesHS.text}>Log in</Text>
    </View>
  );
};
export default HomeScreen;
