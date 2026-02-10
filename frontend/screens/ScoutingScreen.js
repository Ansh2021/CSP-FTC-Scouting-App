import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { NavigationIndependentTree } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { EventEmitter } from "events";
import { Alert } from "@blazejkustra/react-native-alert";
import * as fb from "../firebase.js";
import { colors } from "../themes/colors";

//me when i copy and paste code
const Tab = createMaterialTopTabNavigator();
const eventEmitter = new EventEmitter();

const currentEvent = "USGACOLLT"; //change this for state

//prematch
let SCOUTER_NAME = "";
let MATCH_PATTERN = ""; // GPP, PGP, PPG
let TEAM_NUMBER = "";
let MATCH_NUMBER = "";
let STARTING_POSITION = ""; // classifier, wall
let ALLIANCE = ""; // red/blue
let ALLIANCE_NUMBER = ""; // blue 1/2, red 1/2
let PRELOAD = 0; //0-3
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

const theSubmit = (submitted) => {
  if (submitted) return;
  if (SCOUTER_NAME == "") {
    Alert.alert("Error", "Please enter your name.");
    return;
  }

  //might need an abs value here to make sure things don't break
  let theData = {
    scouterName: SCOUTER_NAME,
    pattern: MATCH_PATTERN,
    teamNumber: TEAM_NUMBER,
    matchNumber: MATCH_NUMBER,
    startingPosition: STARTING_POSITION,
    alliance: ALLIANCE,
    allianceNumber: ALLIANCE_NUMBER,
    preloadNum: PRELOAD,
    groundIntake: GROUND_INTAKE,
    autoArtifactsMade: AUTO_ARTIFACTS_MADE,
    autoArtifactsMissed: AUTO_ARTIFACTS_MISSED,
    autoOffLine: AUTO_OFF_LINE,
    autoPatternAtEnd: AUTO_PATTERN_AT_END,
    teleArtifactsMade: TELE_ARTIFACTS_MADE,
    teleArtifactsMissed: TELE_ARTIFACTS_MISSED,
    endgamePark: ENDGAME_PARK,
    endMatchPattern: END_MATCH_PATTERN,
    defenseRating: DEFENSE_RATING,
    comments: COMMENTS,
  };
  console.log(theData);
  fb.addEmitter()
    .open("scouting")
    .add(theData)
    .commit()
    .then(() => {
      Alert.alert("Success!", "Data submitted successfully.");
      {
        SCOUTER_NAME = "";
        MATCH_PATTERN = "";
        TEAM_NUMBER = "";
        MATCH_NUMBER = "";
        STARTING_POSITION = "";
        ALLIANCE = "";
        ALLIANCE_NUMBER = "";
        PRELOAD = 0;
        GROUND_INTAKE = "";
        AUTO_ARTIFACTS_MADE = 0;
        AUTO_ARTIFACTS_MISSED = 0;
        AUTO_OFF_LINE = false;
        AUTO_PATTERN_AT_END = 0;
        TELE_ARTIFACTS_MADE = 0;
        TELE_ARTIFACTS_MISSED = 0;
        ENDGAME_PARK = "";
        END_MATCH_PATTERN = 0;
        DEFENSE_RATING = "";
        COMMENTS = "";
      }
      eventEmitter.emit("submit");
      console.log("Submitted data:", theData);
    });
};

//MAKE SURE TO FIND OUT IF I REALLY NEED THIS RECURSIVE PARAMETER
const autoUpdateTeamNumber = (
  alliance,
  allianceNumber,
  matchNumber,
  setTeamNumber,
  recursive = false,
) => {
  if (!alliance || !allianceNumber || !matchNumber) {
    console.log("Not enough info to update team number");
    return;
  }
  fb.addListener()
    .open("schedule")
    .getByID(currentEvent)
    .then((items) => {
      const match = items.matches.find((m) => m.match === Number(matchNumber));
      if (alliance === "Red") {
        const alliance_ = match.red;
        const teamNum = alliance_[allianceNumber - 1] ?? null;
        setTeamNumber(teamNum);
        TEAM_NUMBER = "" + teamNum;
        console.log("Auto-updated team number:", TEAM_NUMBER);
      } else if (alliance === "Blue") {
        const alliance_ = match.blue;
        const teamNum = alliance_[allianceNumber - 1] ?? null;
        setTeamNumber(teamNum);
        TEAM_NUMBER = "" + teamNum;
        console.log("Auto-updated team number:", TEAM_NUMBER);
      }
    });

  // if (!recursive) {
  //   autoUpdateTeamNumber(
  //     alliance,
  //     allianceNumber,
  //     matchNumber,
  //     setTeamNumber,
  //     true,
  //   );
  // }
};
//gimme the team number

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "80%",
    backgroundColor: colors.decodeblue,
    padding: 20,
    alignItems: "center",
    borderRadius: 10,
    borderColor: colors.CSPgreen,
    borderWidth: 2,
    gap: 15,
  },
  prematchView: {
    flex: 1,
    backgroundImage: `linear-gradient(to bottom, ${colors.CSPblue} 5%, ${colors.CSPgreen} 90%)`,
    padding: 20,
    gap: 10,
    alignItems: "center",
  },
});

const PreMatch = () => {
  const [scouterName, setScouterName] = useState("");
  const [pattern, setPattern] = useState("");
  const [teamNumber, setTeamNumber] = useState("");
  const [matchNumber, setMatchNumber] = useState(""); //so it doesn't just default to 0 on the screen?!
  const [alliance, setAlliance] = useState(null);
  const [allianceNumber, setAllianceNumber] = useState(""); //blue 1/2, red 1/2
  const [preloadNum, setPreloadNum] = useState(0);
  const [groundIntake, setGroundIntake] = useState("");
  const [startingPosition, setStartingPosition] = useState("");
  const SCOUTERS = [
    "Aarav Patel",
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

  const handleScouterNameChange = (text) => {
    setScouterName(text);
    SCOUTER_NAME = text;
    if (text.length > 0) {
      const filtered = SCOUTERS.filter((name) =>
        name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredScouters(filtered);
      setDropdownVisible(true);
    } else {
      setFilteredScouters(SCOUTERS);
      setDropdownVisible(false);
    }
  };

  const handleScouterSelect = (name) => {
    setScouterName(name);
    SCOUTER_NAME = name;
    setDropdownVisible(false);
    handleScouterNameChange(name);
    console.log("Selected scouter:", name);
  };

  const handleScouterInputBlur = () => {
    setTimeout(() => {
      // if (
      //   !SCOUTERS.some(
      //     (name) =>
      //       name.trim().toLowerCase() === scouterName.trim().toLowerCase(),
      //   )
      // ) {
      //   setScouterName("");
      //   SCOUTER_NAME = "";
      // }
      setDropdownVisible(false);
    }, 100);
  };

  useEffect(() => {
    const resetPrematchData = () => {
      console.log("Resetting prematch data");
      setScouterName("");
      setPattern("");
      setTeamNumber("");
      setMatchNumber("");
      setAlliance(null);
      setAllianceNumber("");
      setPreloadNum(0);
      setGroundIntake("");
      setStartingPosition("");
    };

    eventEmitter.on("submit", resetPrematchData);
  }, []);

  return (
    <View style={styles.prematchView}>
      <TextInput
        style={{
          backgroundColor: "#fff",
          padding: 10,
          borderRadius: 5,
          width: "100%",
          textAlign: "center",
          fontFamily: "Montserrat",
          fontWeight: 400,
          fontSize: 16,
        }}
        placeholder="Scouter Name"
        value={scouterName}
        onChangeText={handleScouterNameChange}
        onBlur={handleScouterInputBlur}
      />
      {dropdownVisible && (
        <FlatList
          style={{
            backgroundColor: colors.decodeblue,
            marginTop: 2,
            borderRadius: 5,
            maxHeight: 100,
            boxSizing: "border-box",
            padding: 5,
          }}
          data={filteredScouters}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleScouterSelect(item)}
              style={{
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: colors.CSPblue,
                width: "100%",
              }}
            >
              <Text
                style={{
                  margin: "auto",
                  fontSize: 18,
                }}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
      <View style={styles.container}>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignSelf: "center",
            justifyContent: "space-evenly",
          }}
        >
          <TextInput
            placeholder="Match Number"
            value={matchNumber}
            onChangeText={(text) => {
              setMatchNumber(text);
              MATCH_NUMBER = "" + text;
              autoUpdateTeamNumber(
                alliance,
                allianceNumber,
                matchNumber,
                setTeamNumber,
              );
            }}
            inputType="numeric"
            keyboardType="numeric"
            style={{
              backgroundColor: "#fff",
              padding: 10,
              borderRadius: 5,
              width: "90%",
              textAlign: "center",
              fontFamily: "Montserrat",
              fontWeight: 400,
              fontSize: 16,
            }}
          />
        </View>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignSelf: "center",
            justifyContent: "space-evenly",
          }}
        >
          <TouchableOpacity
            style={[
              {
                backgroundColor: colors.redalliance,
                padding: 5,
                borderWidth: 2,
                width: "25%",
                height: "2em",
                borderRadius: "2.25em",
                textAlign: "center",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              },
              alliance === "Red"
                ? { borderColor: "black" }
                : { borderColor: colors.darkredalliance },
            ]}
            onPress={() => {
              setAlliance("Red");
              ALLIANCE = "Red";
              console.log("Selected alliance:", ALLIANCE);
              autoUpdateTeamNumber(
                alliance,
                allianceNumber,
                matchNumber,
                setTeamNumber,
              );
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 12,
                height: "100%",
                fontFamily: "Montserrat",
                fontWeight: 400,
                fontSize: 16,
                textAlign: "center",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Red
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              {
                backgroundColor: colors.bluealliance,
                padding: 5,
                borderWidth: 2,
                borderRadius: "2.25em",
                width: "25%",
                height: "2em",
                textAlign: "center",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              },
              alliance === "Blue"
                ? { borderColor: "black" }
                : { borderColor: colors.darkbluealliance },
            ]}
            onPress={() => {
              setAlliance("Blue");
              ALLIANCE = "Blue";
              console.log("Selected alliance:", ALLIANCE);
              autoUpdateTeamNumber(
                alliance,
                allianceNumber,
                matchNumber,
                setTeamNumber,
              );
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                height: "100%",
                fontFamily: "Montserrat",
                fontWeight: 400,
                textAlign: "center",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Blue
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignSelf: "center",
            justifyContent: "space-evenly",
          }}
        >
          <TouchableOpacity
            style={[
              {
                padding: 5,
                borderRadius: "2.25em",
                borderWidth: 2,
                width: "25%",
                height: "2em",
                textAlign: "center",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              },
              allianceNumber === "1"
                ? {
                    borderColor: "black",
                    backgroundColor: colors.artifactpurple,
                  }
                : {
                    borderColor: colors.darkCSPgreen,
                    backgroundColor: colors.CSPgreen,
                  },
            ]}
            onPress={() => {
              setAllianceNumber("1");
              ALLIANCE_NUMBER = "1";
              console.log("Selected alliance number:", ALLIANCE_NUMBER);
              autoUpdateTeamNumber(
                alliance,
                allianceNumber,
                matchNumber,
                setTeamNumber,
              );
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                height: "100%",
                fontFamily: "Montserrat",
                fontWeight: 400,
                textAlign: "center",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              1
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              {
                padding: 5,
                borderRadius: "2.25em",
                borderWidth: 2,
                width: "25%",
                height: "2em",
                textAlign: "center",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              },
              allianceNumber === "2"
                ? {
                    borderColor: "black",
                    backgroundColor: colors.artifactpurple,
                  }
                : {
                    borderColor: colors.darkCSPgreen,
                    backgroundColor: colors.CSPgreen,
                  },
            ]}
            onPress={() => {
              setAllianceNumber("2");
              ALLIANCE_NUMBER = "2";
              console.log("Selected alliance number:", ALLIANCE_NUMBER);
              autoUpdateTeamNumber(
                alliance,
                allianceNumber,
                matchNumber,
                setTeamNumber,
              );
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                height: "100%",
                fontFamily: "Montserrat",
                fontWeight: 400,
                textAlign: "center",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              2
            </Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={{
            backgroundColor: "#fff",
            padding: 10,
            borderRadius: 5,
            width: "90%",
            textAlign: "center",
            fontFamily: "Montserrat",
            fontWeight: 400,
            fontSize: 16,
          }}
          placeholder="Team Number"
          value={teamNumber}
          onChangeText={(text) => {
            setTeamNumber(text);
            TEAM_NUMBER = "" + text;
          }}
          inputType="numeric"
          keyboardType="numeric"
        />
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignSelf: "center",
            justifyContent: "space-evenly",
          }}
        >
          <TouchableOpacity
            style={[
              {
                padding: 5,
                borderRadius: "2.25em",
                borderWidth: 2,
                width: "25%",
                height: "2em",
                textAlign: "center",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              },
              startingPosition === "Classifier"
                ? {
                    borderColor: "black",
                    backgroundColor: colors.artifactpurple,
                  }
                : {
                    borderColor: colors.darkCSPgreen,
                    backgroundColor: colors.CSPgreen,
                  },
            ]}
            onPress={() => {
              setStartingPosition("Classifier");
              STARTING_POSITION = "Classifier";
              console.log("Selected starting position:", STARTING_POSITION);
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                height: "100%",
                fontFamily: "Montserrat",
                fontWeight: 400,
                textAlign: "center",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Classifier
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              {
                padding: 5,
                borderRadius: "2.25em",
                borderWidth: 2,
                width: "25%",
                height: "2em",
                textAlign: "center",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              },
              startingPosition === "Wall"
                ? {
                    borderColor: "black",
                    backgroundColor: colors.artifactpurple,
                  }
                : {
                    borderColor: colors.darkCSPgreen,
                    backgroundColor: colors.CSPgreen,
                  },
            ]}
            onPress={() => {
              setStartingPosition("Wall");
              STARTING_POSITION = "Wall";
              console.log("Selected starting position:", STARTING_POSITION);
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                height: "100%",
                fontFamily: "Montserrat",
                fontWeight: 400,
                textAlign: "center",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Wall
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              {
                padding: 5,
                borderRadius: "2.25em",
                borderWidth: 2,
                width: "25%",
                height: "2em",
                textAlign: "center",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              },
              startingPosition === "No Show"
                ? {
                    borderColor: "black",
                    backgroundColor: colors.artifactpurple,
                  }
                : {
                    borderColor: colors.darkCSPgreen,
                    backgroundColor: colors.CSPgreen,
                  },
            ]}
            onPress={() => {
              setStartingPosition("No Show");
              STARTING_POSITION = "No Show";
              console.log("Selected starting position:", STARTING_POSITION);
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                height: "100%",
                fontFamily: "Montserrat",
                fontWeight: 400,
                textAlign: "center",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              No Show
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignSelf: "center",
            justifyContent: "space-evenly",
          }}
        >
          <TextInput
            style={{
              backgroundColor: "#fff",
              padding: 10,
              borderRadius: 5,
              width: "90%",
              textAlign: "center",
              fontFamily: "Montserrat",
              fontWeight: 400,
              fontSize: 16,
            }}
            placeholder="Preload Number"
            inputType="numeric"
            keyboardType="numeric"
            value={preloadNum}
            onChangeText={(text) => {
              if (Number(text) < 0 || Number(text) > 3) return;
              setPreloadNum(text);
              PRELOAD = "" + text;
            }}
          />
        </View>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignSelf: "center",
            justifyContent: "space-evenly",
          }}
        >
          <View
            style={{
              alignItems: "center",
              backgroundColor: colors.CSPgreen,
              padding: 5,
              borderRadius: 10,
              borderColor: colors.darkCSPgreen,
              borderWidth: 2,
              width: "40%",
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                height: "100%",
                fontFamily: "Montserrat",
                fontWeight: 400,
                textAlign: "center",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Ground Intake
            </Text>
          </View>
          <TouchableOpacity
            style={[
              {
                padding: 5,
                borderRadius: "2.25em",
                borderWidth: 2,
                width: "25%",
                height: "2em",
                textAlign: "center",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              },
              groundIntake === true
                ? {
                    borderColor: "black",
                    backgroundColor: colors.artifactpurple,
                  }
                : {
                    borderColor: colors.darkCSPgreen,
                    backgroundColor: colors.CSPgreen,
                  },
            ]}
            onPress={() => {
              setGroundIntake(true);
              GROUND_INTAKE = true;
              console.log("Selected ground intake:", GROUND_INTAKE);
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                height: "100%",
                fontFamily: "Montserrat",
                fontWeight: 400,
                textAlign: "center",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Yes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              {
                padding: 5,
                borderRadius: "2.25em",
                borderWidth: 2,
                width: "25%",
                height: "2em",
                textAlign: "center",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              },
              groundIntake === false
                ? {
                    borderColor: "black",
                    backgroundColor: colors.artifactpurple,
                  }
                : {
                    borderColor: colors.darkCSPgreen,
                    backgroundColor: colors.CSPgreen,
                  },
            ]}
            onPress={() => {
              setGroundIntake(false);
              GROUND_INTAKE = false;
              console.log("Selected ground intake:", GROUND_INTAKE);
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                height: "100%",
                fontFamily: "Montserrat",
                fontWeight: 400,
                textAlign: "center",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              No
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignSelf: "center",
            justifyContent: "space-evenly",
          }}
        >
          <View
            style={{
              alignItems: "center",
              backgroundColor: colors.CSPgreen,
              padding: 5,
              borderRadius: 10,
              borderColor: colors.darkCSPgreen,
              borderWidth: 2,
              width: "40%",
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                height: "100%",
                fontFamily: "Montserrat",
                fontWeight: 400,
                textAlign: "center",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Match Pattern
            </Text>
          </View>
          <TouchableOpacity
            style={[
              {
                padding: 5,
                borderRadius: "2.25em",
                borderWidth: 2,
                width: "15%",
                height: "2em",
                textAlign: "center",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              },
              pattern === "PPG"
                ? {
                    borderColor: "black",
                    backgroundColor: colors.artifactpurple,
                  }
                : {
                    borderColor: colors.darkCSPgreen,
                    backgroundColor: colors.CSPgreen,
                  },
            ]}
            onPress={() => {
              setPattern("PPG");
              MATCH_PATTERN = "PPG";
              console.log("Selected pattern:", MATCH_PATTERN);
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                height: "100%",
                fontFamily: "Montserrat",
                fontWeight: 400,
                textAlign: "center",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              PPG
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              {
                padding: 5,
                borderRadius: "2.25em",
                borderWidth: 2,
                width: "15%",
                height: "2em",
                textAlign: "center",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              },
              pattern === "PGP"
                ? {
                    borderColor: "black",
                    backgroundColor: colors.artifactpurple,
                  }
                : {
                    borderColor: colors.darkCSPgreen,
                    backgroundColor: colors.CSPgreen,
                  },
            ]}
            onPress={() => {
              setPattern("PGP");
              MATCH_PATTERN = "PGP";
              console.log("Selected pattern:", MATCH_PATTERN);
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                height: "100%",
                fontFamily: "Montserrat",
                fontWeight: 400,
                textAlign: "center",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              PGP
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              {
                padding: 5,
                borderRadius: "2.25em",
                borderWidth: 2,
                width: "15%",
                height: "2em",
                textAlign: "center",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              },
              pattern === "GPP"
                ? {
                    borderColor: "black",
                    backgroundColor: colors.artifactpurple,
                  }
                : {
                    borderColor: colors.darkCSPgreen,
                    backgroundColor: colors.CSPgreen,
                  },
            ]}
            onPress={() => {
              setPattern("GPP");
              MATCH_PATTERN = "GPP";
              console.log("Selected pattern:", MATCH_PATTERN);
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                height: "100%",
                fontFamily: "Montserrat",
                fontWeight: 400,
                textAlign: "center",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              GPP
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const Auto = () => {};

const ScoutingScreen = () => {
  return (
    <NavigationIndependentTree>
      <View style={{ flex: 1, height: "100%", width: "100%" }}>
        <Tab.Navigator
          screenOptions={{
            headerShown: true,
            tabBarStyle: { backgroundColor: colors.CSPblue },
            tabBarLabelStyle: {
              fontFamily: "Montserrat",
              fontWeight: 400,
              fontSize: 14,
              color: "#fff",
            },
            tabBarIndicatorStyle: {
              backgroundColor: colors.CSPgreen,
              height: 4,
            },
          }}
          initialRouteName="Pre-Match"
        >
          <Tab.Screen
            name="Pre-Match"
            component={PreMatch}
            options={{ gestureEnabled: true }}
          />
        </Tab.Navigator>
      </View>
    </NavigationIndependentTree>
  );
};

export default ScoutingScreen;
