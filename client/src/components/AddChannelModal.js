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

const AddChannelModal = ({
  open,
  onClose,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting
}) => (
  <StyledModal open={open} onClose={onClose}>
    <Modal.Header>Add Channel</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          <Input
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
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
            onClick={handleSubmit}
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

export default compose(
  // Compose allows adding multiple higher order functions.
  graphql(createChannelMutation),
  withFormik({
    mapPropsToValues: () => ({ name: "" }), // the name here is mapped to  input values.name
    handleSubmit: async (values,{ props: { onClose, teamId, mutate }, setSubmitting }) => 
    {
      await mutate({
        variables: { teamId, name: values.name },
        update: (store, { data: { createChannel } }) => {
            const { ok, channel } = createChannel; 
            if (!ok) {
                return; 
            }
            const data = store.readQuery({ query: allTeamsQuery });
            const teamIdx = findIndex(data.allTeams, ['id', Number(teamId)]);
            data.allTeams[teamIdx].channels.push(channel);
            store.writeQuery({ query: allTeamsQuery, data });

        },
        optimisticResponse: {
            __typename: "Mutation",
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
