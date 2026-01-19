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
  TouchableOpacity,
  StyleSheet,
  Platform,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "../api";
import { colors } from "../themes/colors";
import Alert from "@blazejkustra/react-native-alert";

export default function AdminDashboard() {
  const [adminToken, setAdminToken] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigation = useNavigation();

  const [eventCode, setEventCode] = useState("");

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
        navigation.replace("AdminLogin");
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

  const handleScheduleUpdate = () => {
    if (!eventCode) {
      Alert.alert("Error", "Please enter an event code.");
      return;
    }
    console.log("Schedule update requested for event code:", eventCode);

    // const response = await fetch(`${API_URL}/api/admin/update-schedule`, {
    //   METHOD: "POST",
    //   headers: {
    //     Authorization: `Bearer ${adminToken}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ eventCode }),
    // });

    // const data = await response.json();

    // if (!response.ok) {
    //   Alert.alert("Error", data.error || "Failed to update schedule.");
    //   return;
    // }

    Alert.alert("Success", "Schedule updated successfully.");
  };

  const handleLogout = async () => {
    if (Platform.OS === "web") {
      localStorage.removeItem("adminToken");
    } else {
      await SecureStore.deleteItemAsync("adminToken");
    }

    Alert.alert("Logged out", "Have a nice day.");

    navigation.reset({
      index: 0,
      routes: [{ name: "AdminLogin" }],
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
    <View style={styles.container}>
      <Text style={styles.text}>Welcome, worthy one!</Text>
      <TextInput
        placeholder="Event Code"
        value={eventCode}
        onChangeText={setEventCode}
        style={styles.codeInput}
      />
      <TouchableOpacity
        style={styles.powerfulButtons}
        onPress={handleScheduleUpdate}
      >
        <Text style={styles.text}>Update Schedule</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.powerfulButtons}>
        <Text style={styles.text}>Update Team Status</Text>
      </TouchableOpacity>

      <View>
        <TouchableOpacity onPress={handleLogout} style={styles.powerfulButtons}>
          <Text style={styles.text}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundImage: `linear-gradient(to bottom, ${colors.CSPblue} 5%, ${colors.CSPgreen} 90%)`,
    height: "100%",
    width: "100%",
    padding: 20,
    alignContent: "center",
    gap: 20,
  },
  powerfulButtons: {
    backgroundColor: colors.CSPgreen,
    padding: 5,
    borderRadius: 10,
    width: "40%",
    alignSelf: "center",
  },
  text: {
    color: "#fff",
    fontFamily: "Montserrat",
    fontWeight: 400,
    fontSize: 18,
    textAlign: "center",
  },
  codeInput: {
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 5,
    marginVertical: 10,
    fontFamily: "Montserrat",
    fontWeight: 400,
    fontSize: 14,
    width: "40%",
    alignSelf: "center",
  },
});
