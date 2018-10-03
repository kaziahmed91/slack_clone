import React from "react";
import { Form, Input, Button, Modal } from "semantic-ui-react";
import { withFormik } from "formik";
import gql from "graphql-tag";
import { compose, graphql } from "react-apollo";
import styled from "styled-components";
import { allTeamsQuery } from '../graphql/team';
import findIndex from 'lodash/findIndex';

const StyledModal = styled(Modal)`
  && {
    margin-top: auto !important;
    display: inline-block !important;
    position: relative;
    top: 20%;
  }
`;

// ALL THIS BIZNIZZ ADDED BELOW => some of them are given by formik like values, errors, touched etc.
const AddChannelModal = ({
  open,
  onClose,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
}) => (
  
  <StyledModal open={open} onClose={onClose}>
    <Modal.Header>Add Channel</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field> 
          <Input
            value={values.name} // formik
            onChange={handleChange} // formik
            onBlur={handleBlur} // formik
            name="name"
            fluid
            placeholder="Channel name"
          />
        </Form.Field>
        <Form.Group widths="equal">
          <Button disabled={isSubmitting} fluid onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={isSubmitting}
            onClick={handleSubmit} // formik 
            type="submit"
            fluid
          >
            Create Channel
          </Button>
        </Form.Group>
      </Form>
    </Modal.Content>
  </StyledModal>
  
);

const createChannelMutation = gql`
  mutation($teamId: Int!, $name: String!) {
    createChannel(teamId: $teamId, name: $name) {
        ok
        channel {
            id
            name
        }
    }
  }
`;

export default compose( // Compose allows adding multiple higher order functions => given by Apollo
  
  graphql(createChannelMutation),
  // This shizz below straight up copied from Formik github
  withFormik({
    // Transfer outer props into values for formic (its the name = name for us )
    mapPropsToValues: () => ({ name: "" }), // the name here is mapped to  input values.name
    handleSubmit: async (values, { props: { onClose, teamId, mutate }, setSubmitting }) => 
    {
      await mutate({
        variables: { teamId, name: values.name },
        // Update is a Apollo GQL thing under Optimistic UI - createChannel is the mutation listed above
        // This happens after we mutate in the mutate function as listed below
        update: (store, { data: { createChannel } }) => { 
            const { ok, channel } = createChannel; 
            if (!ok) {
                return; 
            }
            // Once the update happens, the following reads the allTeamsQuery (imported above)
            const data = store.readQuery({ query: allTeamsQuery });
            // Find sthe new id that we just created
            const teamIdx = findIndex(data.allTeams, ['id', Number(teamId)]);
            // and updates the number of teams available to the new channel
            data.allTeams[teamIdx].channels.push(channel); 
            store.writeQuery({ query: allTeamsQuery, data });   
        },
        // The following is also an Appollo feature.
          // Before the update occurs, the view is populated with some fake data.
        optimisticResponse: {
            __typename: "Mutation", // we pass the prpops given to our mutation above
            createChannel: {
              teamId,
              __typename: "Channel",
              id: -1, 
              name: values.name,
            }
        }
      });
      onClose();
      setSubmitting(false);
    }
  })
)(AddChannelModal);
