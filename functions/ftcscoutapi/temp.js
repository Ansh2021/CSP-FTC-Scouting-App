import { gql } from "@apollo/client";

export const GET_SCHEDULE = gql`
  query getSchedule($eventByCodeSeason2: Int!, $eventByCodeCode2: String!) {
    eventByCode(season: $eventByCodeSeason2, code: $eventByCodeCode2) {
      matches {
        matchNum
        teams {
          teamNumber
          alliance
        }
      }
    }
  }
`;

export const GET_TEAM_STATS = gql`
  query getStats($number: Int!, $season: Int!) {
    teamByNumber(number: $number) {
      name
      schoolName
      quickStats(season: $season) {
        auto {
          value
        }
        dc {
          value
        }
        tot {
          value
        }
      }
    }
  }
`;

export const GET_EVENT_STATS = gql`
  query getEventStats($eventByCodeSeason2: Int!, $eventByCodeCode2: String!) {
    eventByCode(season: $eventByCodeSeason2, code: $eventByCodeCode2) {
      teams {
        stats {
          ... on TeamEventStats2025 {
            opr {
              autoPoints
              dcPoints
              totalPointsNp
            }
          }
        }
        teamNumber
      }
    }
  }
`;
