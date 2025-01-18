import { gql } from "@apollo/client";

export const GET_USER = gql`
  query GetUserQuery {
    getUserQuery {
      _id
      name
      email_id
      apiKey
      role
      phone_number
      trustee_id
      brand_name
      gstIn
      residence_state
      school_name
    }
  }
`;
