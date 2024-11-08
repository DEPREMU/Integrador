// app.config.js
import "dotenv/config"; // Esta línea carga el archivo .env en Node.js, pero solo se usa en el entorno de desarrollo

export default {
  expo: {
    name: "Restaurant",
    slug: "Restaurant",
    version: "0.0.2",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.depremu.Restaurant",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    owner: "depremu",
    extra: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_KEY: process.env.SUPABASE_KEY,
    },
    plugins: ["expo-localization"],
  },
};
