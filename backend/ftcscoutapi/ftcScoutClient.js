import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client/core";
import fetch from "cross-fetch";

const FTCSCOUT_URL = process.env.FTCSCOUT_URL;
const FTCSCOUT_API_TOKEN = process.env.FTCSCOUT_API_TOKEN;

export const ftcScoutClient = new ApolloClient({
  link: new HttpLink({
    uri: FTCSCOUT_URL,
    fetch,
    headers: {
      Authorization: `Bearer ${FTCSCOUT_API_TOKEN}`,
    },
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: "no-cache",
    },
  },
});
