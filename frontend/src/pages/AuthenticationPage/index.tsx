import React, { useEffect, useRef, useState } from "react";
import { Grid, Button, Loader } from "semantic-ui-react";
import { Field, Formik, Form, FormikProps } from "formik";
import { TextField } from '../../components/FormFields';

export type AuthenticationFormValues = {
    username: string,
    password: string,
    name?: string
};

enum AuthenticationFormFunction {
    'auth' = 'auth',
    'register' = 'register'
}

interface Props {
  type?: AuthenticationFormFunction,
  busy?: boolean,
  onSubmit: {
    [key in AuthenticationFormFunction]: (values: AuthenticationFormValues) => void;
   } // on submit callback
}

const AuthenticationForm = ( { onSubmit, type = AuthenticationFormFunction.auth, busy = false }: Props ) => {
    const [formType, setFormType] = useState(type);
    const ref = useRef<FormikProps<AuthenticationFormValues>>(null);
    
    useEffect(() => {
      if(onSubmit[formType] === undefined) {
        throw new Error(`Function for ${formType} must be provided`);
        //console.error(`Function for ${formType} must be provided`);
      }
      // clear form fields on form type change
      if(ref.current) {
        ref.current.values.username = '';
        ref.current.values.password = '';
        ref.current.values.name = '';
      }
      
    }, [formType]);
    
    const formHeader = () => {
        return (
            <h3>
                <a
                    onClick={(e) => {
                        e.preventDefault();
                        formType !== AuthenticationFormFunction.auth && setFormType(AuthenticationFormFunction.auth);
                    }}
                    href={formType !== AuthenticationFormFunction.auth ? "" : undefined}
                    style={{ ...formType === AuthenticationFormFunction.auth && { color: "black" } }}
                >
                    Login
                </a>
                &nbsp;or&nbsp;
                <a
                    onClick={(e) => {
                        e.preventDefault();
                        formType !== AuthenticationFormFunction.register && setFormType(AuthenticationFormFunction.register);
                    }}
                    href={formType !== AuthenticationFormFunction.register ? "" : undefined}
                    style={{ ...formType === AuthenticationFormFunction.register && { color: "black" } }}
                >
                    Register
                </a>
            </h3>
        );
    };
    
    return (
    <React.Fragment>
        {formHeader()}
        <Formik
          innerRef={ref}
          initialValues={
              {
                  username: "",
                  password: "",
                  //...(formType === AuthenticationFormFunction.register && { name: "" }),
                  name: ""
              }
          }
          onSubmit={onSubmit[formType]}
          validate={values => {
              const requiredError = "Field is required";
              const errors: { [field: string]: string } = {};
              if (!values.username) {
              errors.username = requiredError;
              }
              if (!values.password) {
              errors.password = requiredError;
              }
              return errors;
          }}
        >
        {({ isValid, dirty }) => {
          return (
            <Form className="form ui">
              <Field
                label="Username"
                placeholder="Username"
                name="username"
                component={TextField}
              />
              {
                  formType === AuthenticationFormFunction.register &&
                  <Field
                    label="Name"
                    placeholder="Name"
                    name="name"
                    component={TextField}
                  />
              }
              <Field
                label="Password"
                placeholder="Password"
                name="password"
                type="password"
                component={TextField}
              />
              <Grid>
                <Grid.Column width={5}>
                  <Button
                    type="submit"
                    color="green"
                    disabled={!dirty || !isValid || busy}
                    size="medium"
                    style={{ width: '10ch', height: '110%' }}
                  >
                    {busy
                      ? <Loader active size="tiny" inline/>
                      : formType === AuthenticationFormFunction.auth ? 'Login' : 'Register'
                    }
                  </Button>
                </Grid.Column>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </React.Fragment>
    );
};

export default AuthenticationForm;
