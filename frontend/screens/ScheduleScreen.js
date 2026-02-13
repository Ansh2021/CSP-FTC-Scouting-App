import { View, Text, StyleSheet, ScrollView, FlatList } from "react-native";
import { useState, useEffect } from "react";
import { DataTable } from "react-native-paper";
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
      setSchedule(scheduleData.matches);
      // console.log("schedule state:", schedule);
    }
    fetchSchedule();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Schedule: {currentEvent}</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>
              <Text style={styles.text}>Match</Text>
            </DataTable.Title>
            <DataTable.Title>
              <Text style={styles.text}>Red 1</Text>
            </DataTable.Title>
            <DataTable.Title>
              <Text style={styles.text}>Red 2</Text>
            </DataTable.Title>
            <DataTable.Title>
              <Text style={styles.text}>Blue 1</Text>
            </DataTable.Title>
            <DataTable.Title>
              <Text style={styles.text}>Blue 2</Text>
            </DataTable.Title>
          </DataTable.Header>
          {schedule.map((item) => (
            <DataTable.Row key={item.match}>
              <DataTable.Cell>
                <Text style={styles.text}>{item.match}</Text>
              </DataTable.Cell>
              <DataTable.Cell>
                <Text style={styles.text}>{item.red[0]}</Text>
              </DataTable.Cell>
              <DataTable.Cell>
                <Text style={styles.text}>{item.red[1]}</Text>
              </DataTable.Cell>
              <DataTable.Cell>
                <Text style={styles.text}>{item.blue[0]}</Text>
              </DataTable.Cell>
              <DataTable.Cell>
                <Text style={styles.text}>{item.blue[1]}</Text>
              </DataTable.Cell>
            </DataTable.Row>
          ))}

          <DataTable.Pagination
            page={0}
            numberOfPages={1}
            onPageChange={(page) => {}}
          />
        </DataTable>
      </ScrollView>
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
