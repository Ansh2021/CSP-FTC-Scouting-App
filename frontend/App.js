import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AdminLoginScreen from "./screens/AdminLoginScreen";
import AdminDashboard from "./screens/AdminDashboard";
import HomeScreen from "./screens/HomeScreen";
import ScoutingScreen from "./screens/ScoutingScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaProvider>
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ title: "Home" }}
        />
        <Stack.Screen
          name="AdminLogin"
          component={AdminLoginScreen}
          options={{ title: "Admin Login" }}
        />
        <Stack.Screen
          name="AdminDashboard"
          component={AdminDashboard}
          options={{
            title: "Admin Dashboard",
            headerBackVisible: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="ScoutingScreen"
          component={ScoutingScreen}
          options={{ title: "Scouting" }}
        />
      </Stack.Navigator>

      <StatusBar style="auto" />
      </SafeAreaProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
