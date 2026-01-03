//i'm making this too complicated
//woops

//i need to stop
//this is getting out of hand
//sorry for the spam
//i'll stop now
//i promise
//i lied
//last one i swear
//i think
//ok for real this time

//OH MY GOD THAT WAS ALL GITHUB COPILOT

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  Platform,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "../api";

export default function AdminDashboard() {
  const [adminToken, setAdminToken] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const verifyAdmin = async () => {
      let token;

      if (Platform.OS === "web") {
        token = localStorage.getItem("adminToken");
      } else {
        token = await SecureStore.getItemAsync("adminToken");
      }

      if (!token) {
        Alert.alert("Unauthorized", "HEY! you have to be an admin.");
        navigation.navigate("AdminLogin");
        return;
      }

      setAdminToken(token);
      setCheckingAuth(false);
    };

    verifyAdmin();
  }, []);

  const handleAdminAction = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/protected`, {
        METHOD: "POST",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Action failed. Uhoh.");
      }

      Alert.alert("Success", data.message);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleLogout = async () => {
    if (Platform.OS === "web") {
      localStorage.removeItem("adminToken");
    } else {
      await SecureStore.deleteItemAsync("adminToken");
    }
    Alert.alert("Logged out", "Have a nice day.");
    navigation.reset({
      index: 1,
      routes: [{ name: "HomeScreen" }, { name: "AdminLogin" }],
    });
  };

  if (checkingAuth) {
    return (
      <View>
        <Text>Checking if you are worthy...</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>Welcome, worthy one!</Text>
      <TextInput placeholder="Event Code" />
      <Button title="Update Schedule"></Button>
      <Button title="Update Team Onfield Status"></Button>

      <View>
        <Button title="Logout" onPress={handleLogout} />
      </View>
    </View>
  );
}
