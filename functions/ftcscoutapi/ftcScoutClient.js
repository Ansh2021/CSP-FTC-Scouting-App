import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import fetch from "cross-fetch";
import { defineSecret } from "firebase-functions/params";

// const FTCSCOUT_URL = process.env.FTCSCOUT_URL;
// const FTCSCOUT_API_TOKEN = process.env.FTCSCOUT_API_TOKEN;
export const FTCSCOUT_URL = defineSecret("FTCSCOUT_URL");
export const FTCSCOUT_API_TOKEN = defineSecret("FTCSCOUT_API_KEY");

export function getFTCScoutClient() {
  const ftcScoutURL = FTCSCOUT_URL.value();
  const apiToken = FTCSCOUT_API_TOKEN.value();
  const ftcScoutClient = new ApolloClient({
    link: new HttpLink({
      uri: ftcScoutURL,
      fetch,
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    }),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        fetchPolicy: "no-cache",
      },
    },
  });
  return ftcScoutClient;
}
