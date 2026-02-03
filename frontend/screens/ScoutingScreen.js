import { View, Text, StyleSheet } from "react-native";
import { useState, NavigationIndependentTree } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { EventEmitter } from "events";
import * as fb from "../firebase.js";
import { colors } from "../themes/colors";

const Tab = createMaterialTopTabNavigator();
const eventEmitter = new EventEmitter();

const currentEvent = "USGACOLLT"; //change this for state

//prematch
let SCOUTERNAME = "";
let MATCH_PATTERN = ""; // GPP, PGP, PPG
let TEAM_NUMBER = "";
let MATCH_NUMBER = "";
let STARTING_POSITION = ""; // classifier, wall
let ALLIANCE = ""; // red/blue
let ALLIANCE_NUMBER = ""; // blue 1/2, red 1/2
let PRELOAD = ""; //0-3
let GROUND_INTAKE = ""; // true/false

//auto
let AUTO_ARTIFACTS_MADE = 0;
let AUTO_ARTIFACTS_MISSED = 0;
let AUTO_OFF_LINE = false;
let AUTO_PATTERN_AT_END = 0;
//just the number of artifacts that fit the pattern
//GPPPGPPGG for GPP is 4

//tele
let TELE_ARTIFACTS_MADE = 0;
let TELE_ARTIFACTS_MISSED = 0;

//endgame
let ENDGAME_PARK = ""; //none (false), partial, full
let END_MATCH_PATTERN = 0; //just the number of artifacts that fit the pattern

//postmatch
let DEFENSE_RATING = ""; //didn't attempt or 0-5 rating
let COMMENTS = "";

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
  const [scouterName, setScouterName] = useState("");
  const [pattern, setPattern] = useState("");
  const [teamNumber, setTeamNumber] = useState("");
  const [matchNumber, setMatchNumber] = useState(""); //so it doesn't just default to 0 on the screen?!
  const [alliance, setAlliance] = useState(null);
  const [allianceNumber, setAllianceNumber] = useState(""); //blue 1/2, red 1/2
  const [preloadNum, setPreloadNum] = useState(0);
  const [groundIntake, setGroundIntake] = useState("");
  const SCOUTERS = [
    "Aarav Patel",
    // "Aiden Di Mino",
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
    "Zaki Hassan",
  ];
  const [filteredScouters, setFilteredScouters] = useState(SCOUTERS);
  const [dropdownVisible, setDropdownVisible] = useState(false);
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
