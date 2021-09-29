import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form } from "formik";
import { TextField } from '../components/FormFields';
import { Diagnosis } from "../types/types";

export type DiagnosisFormValues = Diagnosis;

interface Props {
  onSubmit: (values: DiagnosisFormValues) => void;
  onCancel: () => void;
  initialValues: Diagnosis | undefined
}

export const AddDiagnosisForm = ({ onSubmit, onCancel, initialValues } : Props ) => {
  return (
    <Formik
      initialValues={
        initialValues === undefined
        ? {
            code: "",
            name: "",
            latin: ""
        }
        : initialValues
      }
      onSubmit={onSubmit}
      validate={values => {
        const requiredError = "Field is required";
        const errors: { [field: string]: string } = {};
        if (!values.code) {
          errors.name = requiredError;
        }
        if (!values.name) {
          errors.ssn = requiredError;
        }
        return errors;
      }}
    >
      {({ isValid, dirty }) => {
        return (
          <Form className="form ui">
            <Field
              label="Code"
              placeholder="Code"
              name="code"
              component={TextField}
            />
            <Field
              label="Name"
              placeholder="Name"
              name="name"
              component={TextField}
            />
            <Field
              label="Latin"
              placeholder="Latin"
              name="latin"
              component={TextField}
            />
            <Grid>
              <Grid.Column floated="left" width={5}>
                <Button type="button" onClick={onCancel} color="red">
                  Cancel
                </Button>
              </Grid.Column>
              <Grid.Column floated="right" width={5}>
                <Button
                  type="submit"
                  floated="right"
                  color="green"
                  disabled={!dirty || !isValid}
                >
                  {initialValues === undefined ? 'Add' : 'Change'}
                </Button>
              </Grid.Column>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddDiagnosisForm;
