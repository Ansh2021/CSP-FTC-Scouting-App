import { ftcScoutClient } from "./ftcScoutClient.js";
import { GET_SCHEDULE, GET_TEAM_STATS } from "./ftcScoutQueries.js";
import * as db from "../firebase.js";

export async function getSchedule(eventByCodeSeason2, eventByCodeCode2) {
  // if (!year) {
  //   return res.status(400).json({ error: "Missing event year." });
  // } else if (!eventCode) {
  //   return res.status(400).json({ error: "Missing event code." });
  // }

  const { data } = await ftcScoutClient.query({
    query: GET_SCHEDULE,
    variables: {
      eventByCodeSeason2,
      eventByCodeCode2,
    },
  });

  const matches = data.eventByCode.matches.map((match) => ({
    match: match.matchNum,
    red: match.teams
      .filter((team) => team.alliance === "Red")
      .map((team) => team.teamNumber),
    blue: match.teams
      .filter((team) => team.alliance === "Blue")
      .map((team) => team.teamNumber),
  }));

  console.log(matches);
  return matches;
  //TODO: add firebase here
}

// export async function getTeamStats(req, res) {
//     try {
//         const {number, season} = req.body;

//         if(!number) {
//             return res.status(400).json({error: "Missing team number."});
//         } else if(!season) {
//             return res.status(400).json({error: "Missing season year."});
//         }

//         const {data} = await ftcScoutClient.query({
//             query: GET_TEAM_STATS,
//             variables: {
//                 number: Number(number),
//                 season: Number(season),
//             },
//         });
//     }
// }
