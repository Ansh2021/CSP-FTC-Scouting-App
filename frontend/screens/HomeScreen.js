import { View, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View>
      <Text>Welcome to the CSP FTC Scouting App!</Text>
      <Button
        title="Go to Scouting"
        onPress={() => navigation.navigate("ScoutingScreen")}
      />
      <Button
        title="Go to Admin Login"
        onPress={() => navigation.navigate("AdminLogin")}
      />
    </View>
  );
}
