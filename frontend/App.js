import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Image } from "react-native";
import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AdminLoginScreen from "./screens/AdminLoginScreen";
import AdminDashboard from "./screens/AdminDashboard";
import HomeScreen from "./screens/HomeScreen";
import ScoutingScreen from "./screens/ScoutingScreen";
import ScheduleScreen from "./screens/ScheduleScreen";
import InfoScreen from "./screens/InfoScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { colors } from "./themes/colors";
import AdminLoginStack from "./stacks/AdminLoginStack";
import FileSystem, { File } from "expo-file-system";
import { Platform } from "react-native";

const Drawer = createDrawerNavigator();

export default function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [manifest, setManifest] = useState(null);

  useEffect(() => {
    const loadManifest = async () => {
      try {
        let fileContent;

        if (Platform.OS === "web") {
          // Use fetch() on the web
          const response = await fetch("./manifest.json"); // Ensure manifest.json is accessible in the public folder
          if (!response.ok) throw new Error("Failed to fetch manifest.json");
          fileContent = await response.json();
        } else {
          // Use expo-file-system for mobile platforms
          const fileUri = FileSystem.documentDirectory + "manifest.json";
          // const fileContentString = await FileSystem.readAsStringAsync(fileUri);
          const fileContentString = new File(fileUri).text();
          fileContent = JSON.parse(fileContentString);
        }

        setManifest(fileContent);
      } catch (err) {
        setError("Error reading the manifest: " + err.message);
      }
    };

    loadManifest();
  }, []);

  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <SafeAreaProvider>
          <Drawer.Navigator
            initialRouteName="HomeScreen"
            screenOptions={({ navigation }) => ({
              drawerStyle: {
                backgroundColor: colors.decodeblue,
                width: 240,
              },
              headerStyle: {
                backgroundColor: colors.CSPblue,
                height: 40,
              },
              headerTitleStyle: {
                fontFamily: "Montserrat",
                fontWeight: 500,
              },
              drawerActiveBackgroundColor: colors.CSPgreen,
              drawerActiveTintColor: "#fff",
              drawerInactiveTintColor: "#000",
              drawerPosition: "left",
              drawerType: "front",
              headerShown: true,
              headerTintColor: "#fff",
              headerRight: () => {
                return (
                  !isDrawerOpen && (
                    <View
                      style={{
                        position: "fixed",
                        zIndex: 1,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          navigation.toggleDrawer();
                          setIsDrawerOpen(Drawer.isDrawerOpen);
                        }}
                      >
                        {/* <Text>hello</Text> */}
                        {/* <Image
                          source={require("./assets/hamburger-menu.png")}
                          style={{ width: 25, height: 25 }}
                        /> */}
                      </TouchableOpacity>
                    </View>
                  )
                );
              },
            })}
          >
            <Drawer.Screen
              name="HomeScreen"
              component={HomeScreen}
              options={{ title: "Home" }}
            />
            <Drawer.Screen
              name="ScoutingScreen"
              component={ScoutingScreen}
              options={{ title: "Scouting" }}
            />
            <Drawer.Screen
              name="ScheduleScreen"
              component={ScheduleScreen}
              options={{ title: "Schedule" }}
            />
            <Drawer.Screen
              name="InfoScreen"
              component={InfoScreen}
              options={{ title: "Info" }}
            />
            <Drawer.Screen
              name="AdminLoginStack"
              component={AdminLoginStack}
              options={{ title: "Admin" }}
            />
          </Drawer.Navigator>

          <StatusBar style="auto" />
        </SafeAreaProvider>
      </NavigationContainer>
    </NavigationIndependentTree>
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
