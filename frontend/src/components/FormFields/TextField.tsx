import { ErrorMessage, Field, FieldProps } from 'formik';
import React from 'react';
import { Form } from 'semantic-ui-react';

// input field
export interface TextProps extends FieldProps {
    label: string;
    placeholder: string;
}
  
export const TextField = ({
    field,
    label,
    placeholder
}: TextProps) => (
    <Form.Field>
        <label>{label}</label>
        <Field placeholder={placeholder} {...field} />
        <div style={{ color:'red' }}>
            <ErrorMessage name={field.name} />
        </div>
    </Form.Field>
);