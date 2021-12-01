import React from 'react';
import { ErrorMessage, Field, FieldProps } from 'formik';
import { Form } from 'semantic-ui-react';

// input field
export interface TextProps extends FieldProps {
    label: string;
    placeholder: string;
    type?: string;
}
  
export const TextField = ({
    field,
    label,
    placeholder,
    type
}: TextProps) => (
    <Form.Field>
        <label>{label}</label>
        <Field type={type} placeholder={placeholder} {...field} />
        <div style={{ color:'red' }}>
            <ErrorMessage name={field.name} />
        </div>
    </Form.Field>
);