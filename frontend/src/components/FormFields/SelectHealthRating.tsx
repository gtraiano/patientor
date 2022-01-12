import { Field } from 'formik';
import React from 'react';
import { Form } from 'semantic-ui-react';
import { HealthCheckRating } from '../../types/types';

// structure of a single gender option
export type HealthRatingOption = {
    value: number;
    label: string;
};
  
// props for gender select field component
type SelectHealthRatingProps = {
    name: string;
    label: string;
    options?: HealthRatingOption[];
};

const extractOptions = () => {
    return Object.entries(HealthCheckRating)
        .filter(([k, v]) => v !== -1 && /[a-z]+/i.test(k))
        .map(([k, v]) => ({ value: v as number, label: k.replace(/(.+[a-z])([A-Z].+)/g, '$1 $2') }));
};
  
// gender select component
export const SelectHealthRating = ({
    name,
    label,
    options = extractOptions()
}: SelectHealthRatingProps) => (
    <Form.Field>
        <label>{label}</label>
        <Field as="select" name={name} className="ui dropdown">
            {options.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
             ))}
        </Field>
    </Form.Field>
);