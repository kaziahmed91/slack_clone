import React from 'react';
import styled from 'styled-components';
import { Input } from 'semantic-ui-react';
import { withFormik } from "formik";
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag';

const SendMessageWrapper = styled.div`
  grid-column: 3;
  grid-row: 3;
  margin: 20px;
`;

const sendMessage = ({ 
  channelName,
  open, // below are all formik specific
  onClose,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
}) => (
  <SendMessageWrapper>
    <Input 
      fluid placeholder={`Message #${channelName}`} 
      onKeyDown = { (e) => {if (e.keyCode === 13 && !isSubmitting) { handleSubmit(e)}} } // only submit if person clicks enter 
      name = "message"
      onBlur = {handleBlur}
      onChange = {handleChange}
      values = {values.message}

    />
  </SendMessageWrapper>
);

const submitMessageMutation = gql`
  mutation($channelId: Int!, $text: String!) {
    createMessage(channelId: $channelId, text: $text) 
  }
`

export default compose(  // Compose allows adding multiple higher order functions => given by Apollo
  
  graphql(submitMessageMutation),
  // This shizz below straight up copied from Formik github
  withFormik({
    // Transfer outer props into values for formic (its the name = name for us )
    mapPropsToValues: () => ({ name: "" }), // the name here is mapped to  input values.name
    handleSubmit: async (values, { props: { channelId, mutate }, setSubmitting, resetForm, }) => 
    {
      if (!values.message || !values.message.trim) { //if empty return 
        setSubmitting(false)
        return
      }
      await mutate({
        variables: { channelId, text: values.message },         
      });
      resetForm(false)
    }
  })
)(sendMessage);
