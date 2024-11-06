import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Bar } from "react-native-progress";

/**
 * Renders a loading component with optional loading text and progress.
 *
 * @param {Object} props - The component props.
 * @param {boolean} [props.boolLoadingText=true] - The bool to show the text "Loading.". Default: true
 * @param {number} [props.progress=null] - The progress value (between 0 and 1). Null won't show the Bar
 * @param {boolean} [props.boolActivityIndicator=false] - The boolean to show ActivityIndicator. Default: false
 * @returns {JSX.Element} The rendered loading component in order of {loadingText, boolActivityIndicator, progress}.
 */
export default Loading = ({
  boolLoadingText = true,
  progress = null,
  boolActivityIndicator = false,
}) => {
  const [loadingText, setLoadingText] = useState("Loading.");

  useEffect(() => {
    let timer;
    if (boolLoadingText)
      timer = setInterval(() => {
        setLoadingText((prev) => {
          if (prev === "Loading.") return "Loading..";
          if (prev === "Loading..") return "Loading...";
          return "Loading.";
        });
      }, 750);
    else return;
    return () => clearInterval(timer);
  }, [loadingText]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {boolLoadingText && (
        <Text style={{ fontSize: 18, textAlign: "center", marginVertical: 5 }}>
          {loadingText}
        </Text>
      )}
      {boolActivityIndicator && (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
      {progress != null && (
        <Bar
          progress={progress}
          width={200}
          height={15}
          color="#3b5998"
          unfilledColor="#e0e0e0"
          borderWidth={0}
        />
      )}
    </View>
  );
};
