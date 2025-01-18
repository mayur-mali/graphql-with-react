# GraphQL with Apollo Client in React

This README guides you through setting up Apollo Client with GraphQL in a React project. It includes the installation steps, configuration for an authorization token, and error handling.

## Installation Steps

### 1. Initialize Your React Project

If you don’t have a React project already:

```bash
npx create-react-app my-graphql-app
cd my-graphql-app
```

### 2. Install Required Packages

Install Apollo Client and GraphQL:

```bash
npm install @apollo/client graphql
```

---

## Configuration

### 1. Set Up Apollo Client

Create a file named `ApolloClient.js` in your `src` directory and configure the Apollo Client:

```javascript
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

// Set the API endpoint
const httpLink = new HttpLink({
  uri: "https://your-graphql-endpoint.com/graphql", // Replace with your GraphQL endpoint
});

// Add an Authorization header
const authLink = new ApolloLink((operation, forward) => {
  // Attach the token to the headers
  const token = localStorage.getItem("authToken"); // Replace this with your token retrieval logic
  operation.setContext({
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return forward(operation);
});

// Handle GraphQL and Network errors
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
      // Optional: Handle specific error codes
      if (message === "Unauthorized") {
        console.warn("User is unauthorized. Redirecting to login...");
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// Combine links
const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]), // Combine errorLink, authLink, and httpLink
  cache: new InMemoryCache(),
});

export default client;
```

### 2. Wrap Your React App with ApolloProvider

In your `index.js` file, wrap your app with `ApolloProvider` to make the Apollo Client available throughout your React components:

```javascript
import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/client";
import client from "./ApolloClient"; // Import the configured Apollo Client
import App from "./App";

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
```

---

## Usage

### 1. Writing GraphQL Queries

Create a `queries.js` file to store your GraphQL queries:

```javascript
import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`;
```

### 2. Fetching Data in Components

Use the `useQuery` hook to fetch data:

```javascript
import React from "react";
import { useQuery } from "@apollo/client";
import { GET_USERS } from "./queries";

const UserList = () => {
  const { loading, error, data } = useQuery(GET_USERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data.users.map((user) => (
        <li key={user.id}>
          {user.name} - {user.email}
        </li>
      ))}
    </ul>
  );
};

export default UserList;
```

---

## Advanced Configuration

### Dynamic Token Refresh

If your token expires, implement a refresh logic in `authLink` to fetch a new token before retrying the request.

### Global Error Handling

Integrate tools like [Sentry](https://sentry.io) for advanced error monitoring.

### Subscription Support

For real-time updates, use Apollo Client’s WebSocket link.

---

## Run the Project

Start your development server:

```bash
npm start
```

Open your browser and navigate to `http://localhost:3000` to see your app in action.

---

## License

This project is licensed under the MIT License.
