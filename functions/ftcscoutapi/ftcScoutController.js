import { getFTCScoutClient } from "./ftcScoutClient.js";
import {
  GET_SCHEDULE,
  GET_TEAM_STATS,
  GET_EVENT_STATS,
} from "./ftcScoutQueries.js";
import { getDB } from "../firebase.js";

export async function getSchedule(eventByCodeSeason2, eventByCodeCode2) {
  const db = getDB();
  const ftcScoutClient = getFTCScoutClient();

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

  await db.collection("schedule").doc(eventByCodeCode2).set(
    {
      matches,
      scheduleUpdatedAt: new Date(),
    },
    { merge: true },
  );

  console.log(matches);
  return matches;
}

export async function getTeamStats(number, season) {
  const db = getDB();
  const ftcScoutClient = getFTCScoutClient();

  const { data } = await ftcScoutClient.query({
    query: GET_TEAM_STATS,
    variables: {
      number: Number(number),
      season: Number(season),
    },
  });

  const teamStats = {
    name: data.teamByNumber.name,
    schoolName: data.teamByNumber.schoolName,
    autoOPR: data.teamByNumber.quickStats.auto.value,
    teleOPR: data.teamByNumber.quickStats.dc.value,
    totalOPR: data.teamByNumber.quickStats.tot.value,
  };

  await db.collection("teamStats").doc(number).set(
    {
      teamStats,
      teamStatsUpdatedAt: new Date(),
    },
    { merge: true },
  );

  console.log(teamStats);
  return teamStats;
}

export async function getEventStats(eventByCodeSeason2, eventByCodeCode2) {
  const db = getDB();
  const ftcScoutClient = getFTCScoutClient();

  const { data } = await ftcScoutClient.query({
    query: GET_EVENT_STATS,
    variables: {
      eventByCodeSeason2,
      eventByCodeCode2,
    },
  });

  const eventStats = data.eventByCode.teams.reduce((acc, team) => {
    const opr = team.stats?.opr;

    if (!opr) {
      // acc[team.teamNumber] = {
      //   auto: null,
      //   dc: null,
      //   total: null,
      //   hasStats: false,
      // };
      return acc;
    }

    acc[team.teamNumber] = {
      auto: opr.autoPoints,
      dc: opr.dcPoints,
      total: opr.totalPointsNp,
    };

    return acc;
  }, {});

  await db.collection("eventStats").doc(eventByCodeCode2).set(
    {
      eventStats,
      eventStatsUpdatedAt: new Date(),
    },
    { merge: true },
  );

  console.log(eventStats);
  return eventStats;
}
