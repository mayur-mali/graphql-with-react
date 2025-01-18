import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

const root = ReactDOM.createRoot(document.getElementById("root"));

const httpLink = createHttpLink({
  uri: "url" + "/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NTA1MTgxY2EzZTk3ZTE5ZjE0MjA3NSIsInJvbGUiOiJvd25lciIsImlhdCI6MTczNzAxNTczOSwiZXhwIjoxNzM5NjA3NzM5fQ.7dQwRwEbJ1wN-5I6kOpcCi22x57ojGIiV1Du5yHQYrQ";
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      alert(message);
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );

      if (message === "Unauthorized") {
        console.warn("User is unauthorized. Redirecting to login...");
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]), // Combine errorLink, authLink, and httpLink
  cache: new InMemoryCache(),
});

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
