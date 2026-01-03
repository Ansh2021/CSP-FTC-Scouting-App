import { View, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

export default function ScoutingScreen() {
  const navigation = useNavigation();

  return (
    <View>
      <Text>get good</Text>
    </View>
  );
}
