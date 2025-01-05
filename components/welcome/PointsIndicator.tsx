import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Animated, { SharedValue } from "react-native-reanimated";

interface PointsIndicatorProps {
  focusAnimation: SharedValue<number>[];
  maxPages: number;
  page: number;
  setPage: (value: any) => any;
}

const PointsIndicator: React.FC<PointsIndicatorProps> = ({
  focusAnimation,
  maxPages,
  page,
  setPage,
}) => {
  if (!focusAnimation || !maxPages || !styles || !page || !setPage)
    return <Text>Error with arguments</Text>;

  return (
    <View style={styles.indicatorContainer}>
      {[...Array(maxPages)].map((_, index) => (
        <Pressable onPress={() => setPage(index + 1)} key={index}>
          <Animated.View
            style={[
              index + 1 === page ? styles.pointed : styles.indicator,
              {
                transform: [
                  {
                    scale: focusAnimation[index],
                  },
                ],
              },
            ]}
          />
        </Pressable>
      ))}
    </View>
  );
};

export default PointsIndicator;

const styles = StyleSheet.create({
  indicatorContainer: {
    top: 30,
    zIndex: 100,
    position: "absolute",
    flexDirection: "row",
  },
  indicator: {
    width: 20,
    margin: 5,
    height: 20,
    borderRadius: 100,
    backgroundColor: "gray",
  },
  pointed: {
    width: 20,
    height: 20,
    margin: 5,
    borderRadius: 100,
    backgroundColor: "yellow",
    borderWidth: 1,
  },
});
