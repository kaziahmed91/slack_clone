import React from "react";
import { Form, Input, Button, Modal } from "semantic-ui-react";
import { withFormik } from "formik";
import gql from "graphql-tag";
import { compose, graphql } from "react-apollo";
import styled from "styled-components";

const StyledModal = styled(Modal)`
  && {
    margin-top: auto !important;
    display: inline-block !important;
    position: relative;
    top: 20%;
  }
`;

const InvitePeopleModal = ({
  open,
  onClose,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting
}) => (
  <StyledModal open={open} onClose={onClose}>
    <Modal.Header>Invite People To Your Team</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          <Input
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            name="email"
            fluid
            placeholder="User Email"
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
            Add User
          </Button>
        </Form.Group>
      </Form>
    </Modal.Content>
  </StyledModal>
);

const addTeamMemberMutaton = gql`
  mutation($email: String!, $teamId: Int!) {
    addTeamMemberMutaton (email: $email, teamId: $teamId) {
        ok
        errors {
            path  
            message
        }
    }
  }
`;

export default compose(
  // Compose allows adding multiple higher order functions.
  graphql(addTeamMemberMutaton),
  withFormik({
    mapPropsToValues: () => ({ email: "" }), // the name here is mapped to  input values.name
    handleSubmit: async (values,{ props: { onClose, teamId, mutate }, setSubmitting }) => 
    {
      const response = await mutate({
        variables: { teamId, email: values.email},  
      });
      console.log(response);
      onClose();
      setSubmitting(false);
    }
  })
)(InvitePeopleModal);
