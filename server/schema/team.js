export default `

  type Team {
    id: Int!
    name: String!
    owner: User!
    members: [User!]!
    channels: [Channel!]!
  }
  type Mutation {
    createTeam(name: String!): CreateTeamResponse!
    addTeamMember(email: String!, teamId: Int!) : VoidResponse!
  }

  type CreateTeamResponse {
    ok: Boolean!
    team: Team
    errors: [Error]
  }

  type Query {  
    allTeams: [Team!]!
  }

  type VoidResponse {
    ok: Boolean!
    errors: [Error!]
  }
`;

// type RegisterResponse {
//   ok: Boolean!
//   user: User
//   errors: [Error!]
// }