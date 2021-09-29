import { ErrorMessage, Field, FieldProps } from 'formik';
import React from 'react';
import { Form } from 'semantic-ui-react';

export interface NumberProps extends FieldProps {
    label: string;
    errorMessage?: string;
    min: number;
    max: number;
}
  
export const NumberField = ({ field, label, min, max } : NumberProps ) => (
    <Form.Field>
        <label>{label}</label>
        <Field {...field} type='number' min={min} max={max} />
        <div style={{ color:'red' }}>
            <ErrorMessage name={field.name} />
        </div>
    </Form.Field>
);