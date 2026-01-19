import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { colors } from "../themes/colors";
import { useFonts } from "expo-font";
// import LinearGradient from "react-native-linear-gradient";

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    "League-Spartan": require("../assets/fonts/LeagueSpartan-VariableFont_wght.ttf"),
    Montserrat: require("../assets/fonts/Montserrat-VariableFont_wght.ttf"),
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Hello, Scouter!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    // alignItems: "center",
    // justifyContent: "center",
    // backgroundColor: colors.CSPblue,
    backgroundImage: `linear-gradient(to bottom, ${colors.CSPblue} 5%, ${colors.CSPgreen} 90%)`,
    // backgroundColor: `linear-gradient(to bottom, ${colors.CSPblue} 5%, ${colors.CSPgreen} 90%)`,
  },
  welcomeText: {
    fontSize: 40,
    fontWeight: 500,
    marginTop: 30,
    marginLeft: 70,
    fontFamily: "League-Spartan",
    color: "#fff",
  },
});
