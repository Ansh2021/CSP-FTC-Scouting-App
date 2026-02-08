import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "../api";
import { colors } from "../themes/colors";
import Alert from "@blazejkustra/react-native-alert";

import * as SecureStore from "expo-secure-store";

export default function AdminLoginScreen() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    let token;
    if (!password) {
      Alert.alert("Error", "YOU SHALL NOT PASS");
      return;
    }

    if (password.toLowerCase() === "jack") {
      Alert.alert("Jack", "Jack");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      token = data.token;
    } catch (err) {
      Alert.alert("Login error", err.message);
      return;
    } finally {
      setLoading(false);
    }

    if (Platform.OS !== "web") {
      await SecureStore.setItemAsync("adminToken", token);
    } else {
      localStorage.setItem("adminToken", token);
    }

    navigation.replace("AdminDashboard");
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.passwordInput}
      />
      <TouchableOpacity
        onPress={handleLogin}
        disabled={!!loading}
        style={styles.loginButton}
      >
        <Text
          style={{
            fontFamily: "Montserrat",
            fontWeight: 400,
            fontSize: 16,
            color: "#fff",
          }}
        >
          {loading ? "Gimme a sec" : "Login"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundImage: `linear-gradient(to bottom, ${colors.CSPblue} 5%, ${colors.CSPgreen} 90%)`,
    height: "100%",
    width: "100%",
    alignItems: "center",
    padding: 30,
    gap: 20,
  },
  passwordInput: {
    height: 40,
    borderColor: colors.CSPgreen,
    borderWidth: 2,
    marginBottom: 12,
    paddingHorizontal: 8,
    fontFamily: "Montserrat",
    fontWeight: 400,
    fontSize: 14,
    width: "40%",
    color: "#000",
    backgroundColor: "#fff",
  },
  loginButton: {
    backgroundColor: colors.CSPgreen,
    padding: 5,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    width: "40%",
  },
});
