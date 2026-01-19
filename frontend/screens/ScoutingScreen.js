import { View, Text, StyleSheet } from "react-native";
import { useState, NavigationIndependentTree } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { colors } from "../themes/colors";

const Tab = createMaterialTopTabNavigator();

const SCOUTERNAME = "";

const PATTERN = "";
const GROUND_INTAKE = false;

const AUTO_ARTIFACTS_MADE = 0;
const AUTO_ARTIFACTS_MISSED = 0;
const AUTO_OFF_LINE = false;
const AUTO_PATTERN_AT_END = false;

const TELE_ARTIFACTS_MADE = 0;
const TELE_ARTIFACTS_MISSED = 0;

export default function ScoutingScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>get good</Text>
      </View>
    </View>
  );
}

const PreMatch = () => {
  const [pattern, setPattern] = useState("");
  const [scouterName, setScouterName] = useState("");
  const [matchNumber, setMatchNumber] = useState(0);
  const [alliance, setAlliance] = useState(null);
  const [allianceNumber, setAllianceNumber] = useState(0);
  const [preloadNum, setPreloadNum] = useState(0);
  const [teamNumber, setTeamNumber] = useState(0);
  const SCOUTERS = [
    "Aarav Patel",
    "Aiden Di Mino",
    "Akhil Atyam",
    "Alankrita Negi",
    "Alex Rodriguez",
    "Alex Vo",
    "Ansh Raghapur",
    "Arnav Dixit",
    "Atharv Srivastava",
    "Bhavika Jagetia",
    "Caleb Seibert",
    "Christian Wheeler",
    "Dia Karthik",
    "Ethan Chew",
    "Eunice Kang",
    "Grant Stone",
    "Heidi Nguyen",
    "Humza Molvi",
    "Hunter Dubois",
    "Jack Puckett",
    "Jacob Truong",
    "Katya Kessler",
    "Lincoln Carroll",
    "Quinn Harkness",
    "Scott Zheng",
    "Taarika Mukhi",
    "Tristan Suryono",
    "Vyom Parikh",
    "Zaki Harkness",
  ];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    backgroundImage: `linear-gradient(to bottom, ${colors.CSPblue} 5%, ${colors.CSPgreen} 90%)`,
  },
  textContainer: {
    margin: 30,
  },
  text: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Montserrat",
    fontWeight: 400,
  },
});
