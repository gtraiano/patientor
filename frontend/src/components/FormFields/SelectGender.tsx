import { Field } from 'formik';
import React from 'react';
import { Form } from 'semantic-ui-react';
import { Gender } from '../../types/types';

// structure of a single gender option
export type GenderOption = {
    value: Gender;
    label: string;
};
  
// props for gender select field component
type SelectGenderProps = {
    name: string;
    label: string;
    options: GenderOption[];
};
  
  // gender select component
export const SelectGender = ({
    name,
    label,
    options
}: SelectGenderProps) => (
    <Form.Field>
        <label>{label}</label>
        <Field as="select" name={name} className="ui dropdown">
            {options.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label || option.value}
                </option>
             ))}
        </Field>
    </Form.Field>
);