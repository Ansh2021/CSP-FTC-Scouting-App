//this is mid practice but whatever

import { Platform } from "react-native";

export const API_URL =
  Platform.OS === "web"
    ? process.env.EXPO_PUBLIC_API_URL
    : process.env.EXPO_PUBLIC_API_URL_PHYSICAL;

// export const API_URL =
