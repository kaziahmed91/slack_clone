export default `
  type User {
    id: Int!
    username: String!
    email: String!
    teams: [Team!]!
  }
  type Query {
    getUser(id: Int!): User!
    allUsers: [User!]!
  }
  type Mutation {
    register(username: String!, email: String!, password: String!): RegisterResponse!
    login(email: String!, password: String!): LoginResponse!
  }

  type RegisterResponse {
    ok: Boolean!
    user: User
    errors: [Error!]
  }

  type LoginResponse {
    ok: Boolean!
    token: String
    refreshToken: String
    errors: [Error]
  }
`;

// We created a type above for register response which is returned upon success. 