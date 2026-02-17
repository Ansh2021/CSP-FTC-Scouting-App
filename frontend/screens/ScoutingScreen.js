import { useState, useEffect, use } from "react";
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
import Alert from "@blazejkustra/react-native-alert";
import * as fb from "../firebase.js";
import { db } from "../firebase.js";
import { doc, setDoc } from "firebase/firestore";
import { colors } from "../themes/colors";

//me when i copy and paste code
const Tab = createMaterialTopTabNavigator();
const eventEmitter = new EventEmitter();

const currentEvent = "USGACOLLT"; //change this for state
const team = 19917; //plecholder
const matchNUMBER = 1;

//prematch
let SCOUTER_NAME = "";
let SCOUTER_TEAM = "";
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

const theSubmit = async (submitted) => {
  if (submitted) return;
  if (SCOUTER_NAME == "") {
    Alert.alert("Error", "Please enter your name.");
    return;
  }

  //might need an abs value here to make sure things don't break
  let theData = {
    scouterName: SCOUTER_NAME,
    scouterTeam: SCOUTER_TEAM,
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
  const docID = `${MATCH_NUMBER}_${TEAM_NUMBER}_${SCOUTER_TEAM}`;
  console.log(theData);
  // fb.addEmitter()
  //   .open("scouting")
  //   .applyTo("hello")
  //   .add(theData)
  //   .commit()
  //   .then(() => {
  //     Alert.alert("Success!", "Data submitted successfully.");
  //     {
  //       SCOUTER_NAME = "";
  //       MATCH_PATTERN = "";
  //       TEAM_NUMBER = "";
  //       MATCH_NUMBER = "";
  //       STARTING_POSITION = "";
  //       ALLIANCE = "";
  //       ALLIANCE_NUMBER = "";
  //       PRELOAD = "";
  //       GROUND_INTAKE = "";
  //       AUTO_ARTIFACTS_MADE = 0;
  //       AUTO_ARTIFACTS_MISSED = 0;
  //       AUTO_OFF_LINE = false;
  //       AUTO_PATTERN_AT_END = 0;
  //       TELE_ARTIFACTS_MADE = 0;
  //       TELE_ARTIFACTS_MISSED = 0;
  //       ENDGAME_PARK = "";
  //       END_MATCH_PATTERN = 0;
  //       DEFENSE_RATING = "";
  //       COMMENTS = "";
  //     }
  //     eventEmitter.emit("submit");
  //     console.log("Submitted data:", theData);
  //   });
  await setDoc(
    doc(db, "scouting", currentEvent, "matches", docID),
    theData,
  ).then(() => {
    Alert.alert("Success!", "Data submitted successfully.");
    {
      SCOUTER_NAME = "";
      SCOUTER_TEAM = "";
      MATCH_PATTERN = "";
      TEAM_NUMBER = "";
      MATCH_NUMBER = "";
      STARTING_POSITION = "";
      ALLIANCE = "";
      ALLIANCE_NUMBER = "";
      PRELOAD = "";
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
  mainTabView: {
    flex: 1,
    backgroundImage: `linear-gradient(to bottom, ${colors.CSPblue} 5%, ${colors.CSPgreen} 90%)`,
    padding: 20,
    gap: 10,
    alignItems: "center",
  },
  button: {
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
  redAllianceButton: {
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
  blueAllianceButton: {
    backgroundColor: colors.bluealliance,
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
  text: {
    color: "#fff",
    fontSize: 16,
    height: "100%",
    fontFamily: "Montserrat",
    fontWeight: 400,
    textAlign: "center",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    height: "100%",
    fontFamily: "Montserrat",
    fontWeight: 400,
    textAlign: "center",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 1,
    flexWrap: "wrap",
  },
  textInput: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    width: "90%",
    textAlign: "center",
    fontFamily: "Montserrat",
    fontWeight: 400,
    fontSize: 16,
  },
});

const PreMatch = () => {
  const [scouterName, setScouterName] = useState("");
  const [scouterTeam, setScouterTeam] = useState("");
  const [pattern, setPattern] = useState("");
  const [teamNumber, setTeamNumber] = useState("");
  const [matchNumber, setMatchNumber] = useState(""); //so it doesn't just default to 0 on the screen?!
  const [alliance, setAlliance] = useState(null);
  const [allianceNumber, setAllianceNumber] = useState(""); //blue 1/2, red 1/2
  const [preloadNum, setPreloadNum] = useState("");
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
  const ECLIPTIC = [
    "Alankrita Negi",
    "Alex Rodriguez",
    "Atharv Srivastava",
    "Bhavika Jagetia",
    "Caleb Seibert",
    "Christian Wheeler",
    "Grant Stone",
    "Hunter Dubois",
    "Jack Puckett",
    "Katya Kessler",
    "Lincoln Carroll",
    "Quinn Harkness",
    "Taarika Mukhi",
    "Zaki Hassan",
  ];
  const ASTROBOTS = [
    "Aarav Patel",
    "Akhil Atyam",
    "Alex Vo",
    "Ansh Raghapur",
    "Arnav Dixit",
    "Dia Karthik",
    "Ethan Chew",
    "Eunice Kang",
    "Heidi Nguyen",
    "Humza Molvi",
    "Jacob Truong",
    "Scott Zheng",
    "Tristan Suryono",
    "Vyom Parikh",
  ];

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
    if (ECLIPTIC.includes(name)) {
      setScouterTeam("Ecliptic");
      SCOUTER_TEAM = "Ecliptic";
    } else if (ASTROBOTS.includes(name)) {
      setScouterTeam("Astrobots");
      SCOUTER_TEAM = "Astrobots";
    }

    console.log("Scouter team:", SCOUTER_TEAM);
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
      setPreloadNum("");
      setGroundIntake("");
      setStartingPosition("");
    };

    eventEmitter.on("submit", resetPrematchData);
  }, []);

  return (
    <View style={styles.mainTabView}>
      <TextInput
        style={styles.textInput}
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
            style={styles.textInput}
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
              styles.redAllianceButton,
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
            <Text style={styles.buttonText}>Red</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.blueAllianceButton,
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
            <Text style={styles.buttonText}>Blue</Text>
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
              styles.button,
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
            <Text style={styles.text}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
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
            <Text style={styles.text}>2</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.textInput}
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
              styles.button,
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
            <Text style={styles.buttonText}>Class</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
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
            <Text style={styles.text}>Wall</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
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
            <Text style={styles.text}>N/A</Text>
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
            style={styles.textInput}
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
            <Text style={styles.text}>Ground Intake</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.button,
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
            <Text style={styles.text}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
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
            <Text style={styles.text}>No</Text>
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
            <Text style={styles.text}>Pattern</Text>
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
            <Text style={[styles.text, { fontSize: 12 }]}>PPG</Text>
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
            <Text style={[styles.text, { fontSize: 12 }]}>PGP</Text>
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
            <Text style={[styles.text, { fontSize: 12 }]}>GPP</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const Auto = () => {
  const [autoArtifactsMade, setAutoArtifactsMade] = useState(0);
  const [autoArtifactsMissed, setAutoArtifactsMissed] = useState(0);
  const [autoOffLine, setAutoOffLine] = useState("");
  const [autoPatternAtEnd, setAutoPatternAtEnd] = useState(0);

  useEffect(() => {
    const resetAutoData = () => {
      console.log("Resetting auto data");
      setAutoArtifactsMade(0);
      setAutoArtifactsMissed(0);
      setAutoOffLine("");
      setAutoPatternAtEnd(0);
    };
    eventEmitter.on("submit", resetAutoData);
  }, []);

  return (
    <View style={[styles.mainTabView, { justifyContent: "center" }]}>
      <View
        style={[
          styles.container,
          {
            flexDirection: "column",
            justifyContent: "space-evenly",
            maxHeight: "60%",
          },
        ]}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignSelf: "center",
            justifyContent: "space-evenly",
          }}
        >
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.CSPgreen }]}
            onPress={() => {
              setAutoArtifactsMade(autoArtifactsMade + 1);
              AUTO_ARTIFACTS_MADE++;
              console.log("Auto made:", AUTO_ARTIFACTS_MADE);
            }}
          >
            <Text style={styles.text}>+</Text>
          </TouchableOpacity>
          <View
            style={{
              alignItems: "center",
              width: "40%",
              backgroundColor: colors.artifactpurple,
              padding: 5,
              borderRadius: 10,
              borderColor: "black",
              borderWidth: 2,
            }}
          >
            <Text style={styles.text}>Made: {autoArtifactsMade}</Text>
          </View>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.CSPgreen }]}
            onPress={() => {
              setAutoArtifactsMade(autoArtifactsMade - 1);
              AUTO_ARTIFACTS_MADE--;
              console.log("Auto made:", AUTO_ARTIFACTS_MADE);
            }}
          >
            <Text style={styles.text}>-</Text>
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
            style={[styles.button, { backgroundColor: colors.CSPgreen }]}
            onPress={() => {
              setAutoArtifactsMissed(autoArtifactsMissed + 1);
              AUTO_ARTIFACTS_MISSED++;
              console.log("Auto missed:", AUTO_ARTIFACTS_MISSED);
            }}
          >
            <Text style={styles.text}>+</Text>
          </TouchableOpacity>
          <View
            style={{
              alignItems: "center",
              width: "40%",
              backgroundColor: colors.artifactpurple,
              padding: 5,
              borderRadius: 10,
              borderColor: "black",
              borderWidth: 2,
            }}
          >
            <Text style={styles.text}>Missed: {autoArtifactsMissed}</Text>
          </View>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.CSPgreen }]}
            onPress={() => {
              setAutoArtifactsMissed(autoArtifactsMissed - 1);
              AUTO_ARTIFACTS_MISSED--;
              console.log("Auto missed:", AUTO_ARTIFACTS_MISSED);
            }}
          >
            <Text style={styles.text}>-</Text>
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
            <Text style={styles.text}>Off Line</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.button,
              autoOffLine === true
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
              setAutoOffLine(true);
              AUTO_OFF_LINE = true;
              console.log("Auto off line:", AUTO_OFF_LINE);
            }}
          >
            <Text style={styles.text}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              autoOffLine === false
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
              setAutoOffLine(false);
              AUTO_OFF_LINE = false;
              console.log("Auto off line:", AUTO_OFF_LINE);
            }}
          >
            <Text style={styles.text}>No</Text>
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
            style={[styles.button, { backgroundColor: colors.CSPgreen }]}
            onPress={() => {
              setAutoPatternAtEnd(autoPatternAtEnd + 1);
              AUTO_PATTERN_AT_END++;
              console.log("Auto pattern:", AUTO_PATTERN_AT_END);
            }}
          >
            <Text style={styles.text}>+</Text>
          </TouchableOpacity>
          <View
            style={{
              alignItems: "center",
              width: "40%",
              backgroundColor: colors.artifactpurple,
              padding: 5,
              borderRadius: 10,
              borderColor: "black",
              borderWidth: 2,
            }}
          >
            <Text style={styles.text}>Pattern: {autoPatternAtEnd}</Text>
          </View>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.CSPgreen }]}
            onPress={() => {
              setAutoPatternAtEnd(autoPatternAtEnd - 1);
              AUTO_PATTERN_AT_END--;
              console.log("Auto pattern:", AUTO_PATTERN_AT_END);
            }}
          >
            <Text style={styles.text}>-</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const TeleOp = () => {
  const [teleArtifactsMade, setTeleArtifactsMade] = useState(0);
  const [teleArtifactsMissed, setTeleArtifactsMissed] = useState(0);

  useEffect(() => {
    const resetTeleOpData = () => {
      console.log("Resetting teleop data");
      setTeleArtifactsMade(0);
      setTeleArtifactsMissed(0);
    };
    eventEmitter.on("submit", resetTeleOpData);
  }, []);

  return (
    <View style={[styles.mainTabView, { justifyContent: "center" }]}>
      <View
        style={[
          styles.container,
          {
            flexDirection: "column",
            justifyContent: "space-evenly",
            maxHeight: "40%",
          },
        ]}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignSelf: "center",
            justifyContent: "space-evenly",
          }}
        >
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.CSPgreen }]}
            onPress={() => {
              setTeleArtifactsMade(teleArtifactsMade + 1);
              TELE_ARTIFACTS_MADE++;
              console.log("Teleop made:", TELE_ARTIFACTS_MADE);
            }}
          >
            <Text style={styles.text}>+</Text>
          </TouchableOpacity>
          <View
            style={{
              alignItems: "center",
              width: "40%",
              backgroundColor: colors.artifactpurple,
              padding: 5,
              borderRadius: 10,
              borderColor: "black",
              borderWidth: 2,
            }}
          >
            <Text style={styles.text}>Made: {teleArtifactsMade}</Text>
          </View>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.CSPgreen }]}
            onPress={() => {
              setTeleArtifactsMade(teleArtifactsMade - 1);
              TELE_ARTIFACTS_MADE--;
              console.log("Teleop made:", TELE_ARTIFACTS_MADE);
            }}
          >
            <Text style={styles.text}>-</Text>
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
            style={[styles.button, { backgroundColor: colors.CSPgreen }]}
            onPress={() => {
              setTeleArtifactsMissed(teleArtifactsMissed + 1);
              TELE_ARTIFACTS_MISSED++;
              console.log("Teleop missed:", TELE_ARTIFACTS_MISSED);
            }}
          >
            <Text style={styles.text}>+</Text>
          </TouchableOpacity>
          <View
            style={{
              alignItems: "center",
              width: "40%",
              backgroundColor: colors.artifactpurple,
              padding: 5,
              borderRadius: 10,
              borderColor: "black",
              borderWidth: 2,
            }}
          >
            <Text style={styles.text}>Missed: {teleArtifactsMissed}</Text>
          </View>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.CSPgreen }]}
            onPress={() => {
              setTeleArtifactsMissed(teleArtifactsMissed - 1);
              TELE_ARTIFACTS_MISSED--;
              console.log("Teleop missed:", TELE_ARTIFACTS_MISSED);
            }}
          >
            <Text style={styles.text}>-</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const Endgame = () => {
  const [endgamePark, setEndgamePark] = useState("");
  const [endMatchPattern, setEndMatchPattern] = useState(0);

  useEffect(() => {
    const resetEndgameData = () => {
      console.log("Resetting endgame data");
      setEndgamePark("");
      setEndMatchPattern(0);
    };
    eventEmitter.on("submit", resetEndgameData);
  }, []);

  return (
    <View style={[styles.mainTabView, { justifyContent: "center" }]}>
      <View
        style={[
          styles.container,
          {
            flexDirection: "column",
            justifyContent: "space-evenly",
            maxHeight: "40%",
          },
        ]}
      >
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
              width: "25%",
            }}
          >
            <Text style={styles.text}>Park</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              width: "75%",
              padding: 5,
              // paddingRight: 0,
              gap: 5,
              // justifyContent: "space-evenly",
            }}
          >
            <TouchableOpacity
              style={[
                styles.button,
                { width: "33%" },
                endgamePark === "None"
                  ? {
                      borderColor: "black",
                      backgroundColor: colors.artifactpurple,
                    }
                  : {
                      borderColor: colors.darkCSPgreen,
                      backgroundColor: colors.CSPgreen,
                    },
                // { fontSize: 14 },
              ]}
              onPress={() => {
                setEndgamePark("None");
                ENDGAME_PARK = "None";
                console.log("Endgame park:", ENDGAME_PARK);
              }}
            >
              <Text style={styles.text}>None</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                { width: "33%" },
                endgamePark === "Partial"
                  ? {
                      borderColor: "black",
                      backgroundColor: colors.artifactpurple,
                    }
                  : {
                      borderColor: colors.darkCSPgreen,
                      backgroundColor: colors.CSPgreen,
                    },
                // { fontSize: 14 },
              ]}
              onPress={() => {
                setEndgamePark("Partial");
                ENDGAME_PARK = "Partial";
                console.log("Endgame park:", ENDGAME_PARK);
              }}
            >
              <Text style={styles.text}>Part</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                { width: "33%" },
                endgamePark === "Full"
                  ? {
                      borderColor: "black",
                      backgroundColor: colors.artifactpurple,
                    }
                  : {
                      borderColor: colors.darkCSPgreen,
                      backgroundColor: colors.CSPgreen,
                    },
                // { fontSize: 14 },
              ]}
              onPress={() => {
                setEndgamePark("Full");
                ENDGAME_PARK = "Full";
                console.log("Endgame park:", ENDGAME_PARK);
              }}
            >
              <Text style={styles.text}>Full</Text>
            </TouchableOpacity>
          </View>
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
              width: "100%",
              flexDirection: "row",
              alignSelf: "center",
              justifyContent: "space-evenly",
            }}
          >
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.CSPgreen }]}
              onPress={() => {
                setEndMatchPattern(endMatchPattern + 1);
                END_MATCH_PATTERN++;
                console.log("Endgame pattern:", END_MATCH_PATTERN);
              }}
            >
              <Text style={styles.text}>+</Text>
            </TouchableOpacity>
            <View
              style={{
                alignItems: "center",
                width: "40%",
                backgroundColor: colors.artifactpurple,
                padding: 5,
                borderRadius: 10,
                borderColor: "black",
                borderWidth: 2,
              }}
            >
              <Text style={styles.text}>Pattern: {endMatchPattern}</Text>
            </View>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.CSPgreen }]}
              onPress={() => {
                setEndMatchPattern(endMatchPattern - 1);
                END_MATCH_PATTERN--;
                console.log("Endgame pattern:", END_MATCH_PATTERN);
              }}
            >
              <Text style={styles.text}>-</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const Comments = ({ navigation }) => {
  const [comments, setComments] = useState("");
  const [defenseRating, setDefenseRating] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const resetCommentData = () => {
      console.log("Resetting comment data");
      setComments("");
      setDefenseRating("");
    };
    eventEmitter.on("submit", resetCommentData);
  }, []);

  return (
    <View style={[styles.mainTabView, { justifyContent: "center" }]}>
      <View
        style={[
          styles.container,
          {
            flexDirection: "column",
            justifyContent: "space-evenly",
            maxHeight: "80%",
          },
        ]}
      >
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
              width: "30%",
            }}
          >
            <Text style={styles.text}>Defense</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              width: "65%",
              gap: 5,
              padding: 5,
            }}
          >
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: colors.CSPgreen, padding: 0, width: "20%" },
                defenseRating === "1" ||
                defenseRating === "2" ||
                defenseRating === "3" ||
                defenseRating === "4" ||
                defenseRating === "5"
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
                if (defenseRating === "1") {
                  setDefenseRating("0");
                  DEFENSE_RATING = "0";
                  console.log("Defense rating:", DEFENSE_RATING);
                } else {
                  setDefenseRating("1");
                  DEFENSE_RATING = "1";
                  console.log("Defense rating:", DEFENSE_RATING);
                }
              }}
            >
              <Text style={styles.text}>★</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: colors.CSPgreen, padding: 0, width: "20%" },
                defenseRating === "2" ||
                defenseRating === "3" ||
                defenseRating === "4" ||
                defenseRating === "5"
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
                setDefenseRating("2");
                DEFENSE_RATING = "2";
                console.log("Defense rating:", DEFENSE_RATING);
              }}
            >
              <Text style={styles.text}>★</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: colors.CSPgreen, padding: 0, width: "20%" },
                defenseRating === "3" ||
                defenseRating === "4" ||
                defenseRating === "5"
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
                setDefenseRating("3");
                DEFENSE_RATING = "3";
                console.log("Defense rating:", DEFENSE_RATING);
              }}
            >
              <Text style={styles.text}>★</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: colors.CSPgreen, padding: 0, width: "20%" },
                defenseRating === "4" || defenseRating === "5"
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
                setDefenseRating("4");
                DEFENSE_RATING = "4";
                console.log("Defense rating:", DEFENSE_RATING);
              }}
            >
              <Text style={styles.text}>★</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: colors.CSPgreen, padding: 0, width: "20%" },
                defenseRating === "5"
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
                setDefenseRating("5");
                DEFENSE_RATING = "5";
                console.log("Defense rating:", DEFENSE_RATING);
              }}
            >
              <Text style={styles.text}>★</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            width: "100%",
            height: "60%",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextInput
            style={[styles.textInput, { height: "90%" }]}
            placeholder="Comments"
            multiline={true}
            value={comments}
            onChangeText={(text) => {
              setComments(text);
              COMMENTS = text;
            }}
            onBlur={() => console.log("Comments:", COMMENTS)}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            gap: 5,
            padding: 5,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: colors.CSPgreen, width: "80%" },
            ]}
            onPress={() => {
              theSubmit(submitted);
              setSubmitted(false);
              navigation.navigate("Pre-Match");
              console.log("Attempted submit");
            }}
          >
            <Text style={styles.text}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

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
          initialRouteName="Setup"
        >
          <Tab.Screen
            name="Setup"
            component={PreMatch}
            options={{ gestureEnabled: true }}
          />
          <Tab.Screen
            name="Auto"
            component={Auto}
            options={{ gestureEnabled: true }}
          />
          <Tab.Screen
            name="TeleOp"
            component={TeleOp}
            options={{ gestureEnabled: true }}
          />
          <Tab.Screen
            name="Endgame"
            component={Endgame}
            options={{ gestureEnabled: true }}
          />
          <Tab.Screen
            name="Notes"
            component={Comments}
            options={{ gestureEnabled: true }}
          />
        </Tab.Navigator>
      </View>
    </NavigationIndependentTree>
  );
};

export default ScoutingScreen;
