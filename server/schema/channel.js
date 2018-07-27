
export default `
type Channel {
  id: Int!
  name: String!
  public: Boolean!
  messages: [Message!]!
  users: [User!]!
}
type Mutation {
  createChannel(teamId: Int!, name: String!, public: Boolean=false): ChannelResponse!
}

type ChannelResponse {
  ok: Boolean!
  channel: Channel
  errors: [Error!]
}
`;