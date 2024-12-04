// app.config.js
import "dotenv/config"; // Esta línea carga el archivo .env en Node.js, pero solo se usa en el entorno de desarrollo

export default {
  expo: {
    name: "Order.by",
    slug: "Order.by",
    version: "0.0.2",
    orientation: "portrait",
    icon: "./assets/appLogoImage.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assets: ["./assets/"],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/appLogoImage.png",
        backgroundColor: "#ffffff",
      },
      package: "com.order.by",
    },
    web: {
      favicon: "./assets/appLogoImage.png",
    },
    owner: "depremu",
    extra: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_KEY: process.env.SUPABASE_KEY,
      SECRET_KEY_TO_ENCRYPT: process.env.SECRET_KEY_TO_ENCRYPT,
    },
    plugins: ["expo-localization", "expo-secure-store"],
  },
};
