import { View, Text, StyleSheet, ScrollView, FlatList } from "react-native";
import { useState, useEffect } from "react";
// import { DataTable } from "react-native-paper";
import { colors } from "../themes/colors";
import * as fb from "../firebase.js";

const currentEvent = "USGACOLLT"; //change this for state

export default function ScheduleScreen() {
  const [schedule, setSchedule] = useState([]);

  //TODO: may need to switch to useFocusEffect to make this update when screen is focused
  useEffect(() => {
    async function fetchSchedule() {
      const scheduleData = await fb
        .addListener()
        .open("schedule")
        .getByID(currentEvent);
      setSchedule(scheduleData);
      console.log("scheduleData:", scheduleData);
      // console.log("schedule state:", schedule);
    }
    fetchSchedule();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Schedule Screen</Text>
      {/* <FlatList
        data={schedule}
        numColumns={4}
        keyExtractor={(item) => item.match.toString()}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.text}>Match {item.match}</Text>
          </View>
        )}
      /> */}
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
