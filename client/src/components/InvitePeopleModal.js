import React from "react";
import { Form, Input, Button, Modal } from "semantic-ui-react";
import { withFormik } from "formik";
import gql from "graphql-tag";
import { compose, graphql } from "react-apollo";
import styled from "styled-components";
import normalizeErrors from '../normalizeErrors';

// https://www.youtube.com/watch?v=Mj4xJAVs2VQ&index=24&list=PLN3n1USn4xlkdRlq3VZ1sT6SGW0-yajjL

// we can have a styled.div or styled(modal) depending on component or element.\
const StyledModal = styled(Modal)`
  && {
    margin-top: auto !important;
    display: inline-block !important;
    position: relative;
    top: 20%;
  }
`;

// The following variables are from Formik
const InvitePeopleModal = ({ 
  open,
  onClose,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting, 
  touched, 
  errors, // <- these are used to show errors 
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
          
          <p>{touched.email && errors.email ? errors  : null}</p>
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
    addTeamMember (email: $email, teamId: $teamId) {
        ok
        errors {
            path  
            message
        }
    }
  }
`;  
// Compose allows adding multiple higher order functions. React-Apollo TINGS
export default compose(
  graphql(addTeamMemberMutaton),
  withFormik({
    mapPropsToValues: () => ({ email: "" }), // the name here is mapped to  input values.name
      // The following values in the function below are formik specific 
    handleSubmit: async (values,{ props: { onClose, teamId, mutate }, setSubmitting, setErrors }) => 
    {
      const response = await mutate({
        variables: { teamId, email: values.email },
      });
      // console.log(response);
      const { ok,errors } = response.data.addTeamMember;
      // The follownig f(x) are formik specific 
      if (ok) {
        onClose(); // close modal
        setSubmitting(false); // reset form and button
      } else {
        setSubmitting(false);
        let err = normalizeErrors(errors)
        console.log(err)
        setErrors(err); // NormalizeErrors is a util function we created
      }
    }
  })
)(InvitePeopleModal);
