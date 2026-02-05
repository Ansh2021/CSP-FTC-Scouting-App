import { View, Text, StyleSheet } from "react-native";
import { colors } from "../themes/colors";

export default function InfoScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          If you couldn't already tell, this is the FTC scouting app for FTC
          teams 16585 and 22327. I built this app just because I got bored over
          Winter Break but also because I'm just a nice guy.
          {"\n\n"}This app was built using React Native and Expo (although you
          probably didn't care about that) and yes it was heavily inspired by
          the CSP FRC scouting app built by THE Priyanshu Biswal. {"\n\n"}Don't
          even try cracking the password for the admin login (I will find you if
          you try). {"\n\n"}If there are any bugs, please reach out to me ASAP
          so I can get it fixed and minimize the damage. {"\n\n"}Lastly, there
          may or may not be easter eggs hidden throughout the app. Try finding
          them (or not). {"\n\n"}Have fun! I guess.
        </Text>
        <Text
          style={{
            fontSize: 5,
            fontFamily: "Montserrat",
            color: colors.CSPblue,
          }}
        >
          {/* stop cheating to find the easter eggs */}
          Hi Jack
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    backgroundImage: `linear-gradient(to bottom, ${colors.CSPblue} 5%, ${colors.CSPgreen} 90%)`,
  },
  textContainer: {
    // marginTop: 30,
    // marginLeft: 30,
    margin: 30,
  },
  text: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Montserrat",
    fontWeight: 400,
  },
});
