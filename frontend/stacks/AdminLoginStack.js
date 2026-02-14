//more laziness

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AdminLoginScreen from "../screens/AdminLoginScreen";
import AdminDashboard from "../screens/AdminDashboard";

const Stack = createNativeStackNavigator();

export default function AdminLoginStack() {
  return (
    <Stack.Navigator initialRouteName="AdminLogin">
      <Stack.Screen
        name="AdminLogin"
        component={AdminLoginScreen}
        options={{ headerShown: false, title: "Login" }}
      />
      <Stack.Screen
        name="AdminDashboard"
        component={AdminDashboard}
        options={{
          headerBackVisible: false,
          gestureEnabled: false,
          headerShown: false,
          title: "Dashboard",
        }}
      />
    </Stack.Navigator>
  );
}
