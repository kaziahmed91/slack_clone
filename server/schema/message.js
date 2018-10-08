export default `
type Message {
  id: Int!
  text: String!
  user: User!
  channel: Channel!
  created_at: String!
}
type Mutation {
  createMessage(channelId: Int!, text: String!): Boolean!
}

type Query {
  messages(channelId: Int!) : [Message!]!
}
`;