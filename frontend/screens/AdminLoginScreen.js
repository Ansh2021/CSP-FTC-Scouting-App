import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "../api";

import * as SecureStore from "expo-secure-store";

export default function AdminLoginScreen() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  // useEffect(() => {
  //     navigation.replace("AdminDashboard");
  // }, []);

  // const handleLogin = async () => {
  //     if(!password) {
  //         Alert.alert("Error", "YOU SHALL NOT PASS");
  //         return;
  //     }

  //     try {
  //         setLoading(true);
  //         console.log("Attempting admin login");
  //         console.log("API URL:", API_URL);

  //         const response = await fetch(`${API_URL}/api/admin/login`, {
  //             method: 'POST',
  //             headers: {
  //                 'Content-Type': 'application/json',
  //             },
  //             body: JSON.stringify({ password }),
  //         });

  //         console.log("Response status:", response.status);

  //         const data = await response.json();

  //         if(!response.ok) {
  //             throw new Error(data.error || 'Uh oh! Login failed.');
  //         }

  //         if(!data.token) {
  //             throw new Error('No token received from server');
  //         }

  //         await SecureStore.setItemAsync('adminToken', data.token);

  //         Alert.alert("Success", "Logged in as admin!");

  //         navigation.navigate("AdminDashboard");
  //     } catch (error) {
  //         // console.log("Login error:", error.message);
  //         Alert.alert("Login Failed", error.message);
  //     } finally {
  //         setLoading(false);
  //     }
  // };

  const handleLogin = async () => {
    let token;
    if (!password) {
      Alert.alert("Error", "YOU SHALL NOT PASS");
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

    // 🔥 Everything above succeeded — now do side effects

    if (Platform.OS !== "web") {
      await SecureStore.setItemAsync("adminToken", token);
    } else {
      localStorage.setItem("adminToken", token);
    }

    // 🔥 Navigate OUTSIDE the try/catch
    navigation.navigate("AdminDashboard");
  };

  return (
    <View>
      <Text>Admin Login</Text>
      <TextInput
        placeholder="Enter admin password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button
        title={!!loading ? "Gimme a sec" : "Login"}
        onPress={handleLogin}
        disabled={!!loading}
      />
    </View>
  );
}
