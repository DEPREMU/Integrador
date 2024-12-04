// layoutContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { Dimensions, Platform } from "react-native";

const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get("window"));

  useEffect(() => {
    const onChange = ({ window }) => {
      setDimensions(window);
    };
    const subscription = Dimensions.addEventListener("change", onChange);

    return () => subscription?.remove();
  }, []);

  const { width, height } = dimensions;
  const isWeb = Platform.OS === "web";
  const isPhone = width <= 768 && height <= 1600;
  const isTablet = width > 768 && height <= 1600;
  const isLargeTablet = width > 1024 && height <= 2048;

  const layoutData = { isTablet, isLargeTablet, isPhone, isWeb, width, height };

  return (
    <LayoutContext.Provider value={layoutData}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useResponsiveLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error(
      "useResponsiveLayout debe ser usado dentro de un LayoutProvider"
    );
  }
  return context;
};
