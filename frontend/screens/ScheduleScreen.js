import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { DataTable } from "react-native-paper";
import { colors } from "../themes/colors";
// import * as db from "../../backend/firebase.js";

export default function ScheduleScreen() {
  // const [schedule, setSchedule] = useState([]);
  // useEffect(() => {

  // }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Schedule Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundImage: `linear-gradient(to bottom, ${colors.CSPblue} 5%, ${colors.CSPgreen} 90%)`,
    height: "100%",
    width: "100%",
    padding: 20,
  },
  text: {
    color: "#fff",
    fontFamily: "Montserrat",
    fontWeight: 400,
    fontSize: 18,
    textAlign: "center",
  },
});
