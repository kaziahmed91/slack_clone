import React from 'react';
import Messages from '../components/Messages';
import { graphql } from 'react-apollo'
import gql from 'graphql-tag';
import { Comment } from 'semantic-ui-react'


const MessageContiner = ({ data: {loading, messages}}) => {

    if (loading) return null;    
    console.log(messages, loading)
    return (
      <Messages>
        <Comment.Group>
        { messages.map( m => (
          <Comment key={`${m.id}-message`}>
            <Comment.Content>
              <Comment.Author as='a'>{ m.user.username }</Comment.Author>
              <Comment.Metadata>
                <div> {m.created_at} </div>
              </Comment.Metadata>
              <Comment.Text>{m.text}</Comment.Text>
              <Comment.Actions>
                <Comment.Action>Reply</Comment.Action>
              </Comment.Actions>
            </Comment.Content>
          </Comment>
        )) }
      </Comment.Group>
    </Messages> 
    )
}

const messagesQuery = gql`
  query($channelId: Int!) {
    messages(channelId: $channelId) {
      id
      text
      user {
        username
      }
      created_at
    }
  }
`;
// Since we are passing variables to our query, we do so by passing an object to messagesQuery
export default graphql(messagesQuery, {
    variables: props => ({
      channelId: props.channelId,
    }),
  })(MessageContiner);
